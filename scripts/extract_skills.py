"""
Extract structured skills from JobLens job postings via the OpenAI API.

Reads data/joblens_sample.csv, calls gpt-4o-mini (JSON mode) per posting to
extract categorized skills, reuses the CSV's existing `role_category` column
for role classification, persists raw per-posting results, then aggregates
into three output JSONs:

  - top_skills.json      top 20 skills overall by frequency
  - skills_by_role.json  skill demand broken down by role category
  - top_companies.json   most active hiring companies by posting count

Usage:
  python scripts/extract_skills.py --test          # first 20 rows, prints raw output, no files written
  python scripts/extract_skills.py                 # full dataset: extract + persist raw + aggregate
  python scripts/extract_skills.py --aggregate-only  # re-aggregate from data/output/raw_results.json, no API calls
"""

import argparse
import csv
import json
import os
import re
from collections import Counter, defaultdict
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "data" / "joblens_sample.csv"
OUTPUT_DIR = ROOT / "data" / "output"
RAW_RESULTS_PATH = OUTPUT_DIR / "raw_results.json"
MODEL = "gpt-4o-mini"

# Map raw CSV role_category values to the 4 target labels.
ROLE_MAP = {
    "Software Engineering": "SWE",
    "Data/ML": "Data/ML",
    "Product/Program Management": "Product/Program Mgmt",
    "Technical Ops/Solutions": "Technical Ops/Solutions",
}

# Staffing/recruiting agencies excluded from aggregation - these post on behalf
# of undisclosed end employers, so their skill/company stats don't reflect
# real hiring companies.
STAFFING_AGENCIES = {
    "Apex Systems",
    "TEKsystems",
    "Insight Global",
    "Motion Recruitment",
    "Collabera",
    "Russell Tobin",
    "Compunnel Inc.",
    "Compunnel",
    "Akkodis",
    "Open Systems Technologies",
    "Talent Groups",
    "Dice",
    "ClearanceJobs",
    "Robert Half",
    "Robert Half Technology",
    "Randstad",
    "Randstad Digital",
    "Kforce",
    "Modis",
    "Judge Group",
    "The Judge Group",
    "CyberCoders",
    "Beacon Hill Staffing",
    "Aerotek",
    "Cognizant Technology Solutions",
    "Genesis10",
    "Yoh",
    "Signature Consultants",
    "System One",
    "Belcan",
    "Artech Information Systems",
    "Tata Consultancy Services",
    "TCS",
    "Experis",
    "Aditi Consulting",
    "Ascendion",
    "Diverse Lynx",
    "Actalent",
    "Matlen Silver",
    "UST",
}
STAFFING_AGENCIES_LOWER = {name.lower() for name in STAFFING_AGENCIES}

SYSTEM_PROMPT = """You extract structured skill data from job postings.

Given a job title and description, return a JSON object with this exact shape:
{
  "skills": [
    {"name": "Python", "category": "language/tool/framework"},
    {"name": "Communication", "category": "soft skill"},
    {"name": "PMP", "category": "certification"}
  ]
}

Rules:
- category must be one of: "language/tool/framework", "soft skill", "certification", "other"
- Extract only skills explicitly stated or clearly implied by the text.
- Normalize skill names (e.g. "Python3" -> "Python", "SQL/NoSQL" -> split into "SQL" and "NoSQL").
- Return 5-15 skills per posting, most relevant first.
- Return ONLY the JSON object, no other text.
"""


def normalize_skill_key(name: str) -> str:
    """Grouping key: lowercase, strip hyphens/punctuation, collapse whitespace."""
    key = name.lower()
    key = re.sub(r"[-_/.,]+", " ", key)
    key = re.sub(r"[^\w\s]", "", key)
    key = re.sub(r"\s+", " ", key).strip()
    return key


def load_rows(limit=None):
    with open(CSV_PATH, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    if limit:
        rows = rows[:limit]
    return rows


def extract_skills_for_posting(client, title, description):
    # Truncate very long descriptions to keep token usage reasonable.
    text = description[:6000]
    response = client.chat.completions.create(
        model=MODEL,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Job title: {title}\n\nDescription:\n{text}"},
        ],
        temperature=0,
    )
    content = response.choices[0].message.content
    return json.loads(content)


def extract_all(test_mode: bool):
    load_dotenv(ROOT / ".env")
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("OPENAI_API_KEY not found in environment or .env")

    client = OpenAI(api_key=api_key)

    limit = 20 if test_mode else None
    rows = load_rows(limit=limit)
    print(f"Loaded {len(rows)} rows{' (test mode)' if test_mode else ''}")

    results = []

    for i, row in enumerate(rows):
        title = row["title"]
        description = row["description"]
        company = row["company_name"]
        raw_role = row["role_category"].strip()
        role = ROLE_MAP.get(raw_role, raw_role or "Unknown")

        try:
            extracted = extract_skills_for_posting(client, title, description)
        except Exception as e:
            print(f"[{i+1}/{len(rows)}] ERROR on job_id={row.get('job_id')}: {e}")
            continue

        skills = extracted.get("skills", [])

        if test_mode:
            print(f"\n--- [{i+1}/{len(rows)}] {company} | {title} | role={role} ---")
            print(json.dumps(extracted, indent=2))

        results.append({
            "job_id": row["job_id"],
            "company": company,
            "role": role,
            "skills": skills,
        })

    if test_mode:
        print("\n=== TEST MODE: no output files written. Review above, then re-run without --test. ===")
        return None

    print(f"\nProcessed {len(results)} postings.")
    return results


def aggregate(results):
    """Build the 3 output JSONs from raw per-posting results, with skill normalization.

    Skills are grouped for counting by a normalized key (lowercase, hyphens/
    punctuation stripped), but each group keeps one clean display label —
    the first-seen raw name for that key.
    """
    skill_counter = Counter()
    skill_by_role = defaultdict(Counter)
    company_counter = Counter()
    display_names = {}  # normalized key -> display label

    excluded_count = 0

    for entry in results:
        role = entry["role"]
        company = entry["company"]
        if company.strip().lower() in STAFFING_AGENCIES_LOWER:
            excluded_count += 1
            continue
        for s in entry["skills"]:
            name = s.get("name", "").strip()
            if not name:
                continue
            key = normalize_skill_key(name)
            if not key:
                continue
            if key not in display_names:
                display_names[key] = name
            skill_counter[key] += 1
            skill_by_role[role][key] += 1
        company_counter[company] += 1

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    top_skills = [
        {"skill": display_names[key], "count": count}
        for key, count in skill_counter.most_common(20)
    ]
    with open(OUTPUT_DIR / "top_skills.json", "w", encoding="utf-8") as f:
        json.dump(top_skills, f, indent=2)

    skills_by_role_out = {
        role: [
            {"skill": display_names[key], "count": count}
            for key, count in counter.most_common(20)
        ]
        for role, counter in skill_by_role.items()
    }
    with open(OUTPUT_DIR / "skills_by_role.json", "w", encoding="utf-8") as f:
        json.dump(skills_by_role_out, f, indent=2)

    top_companies = [{"company": name, "postings": count} for name, count in company_counter.most_common(20)]
    with open(OUTPUT_DIR / "top_companies.json", "w", encoding="utf-8") as f:
        json.dump(top_companies, f, indent=2)

    print(f"Excluded {excluded_count} staffing-agency postings out of {len(results)} total.")
    print(f"Wrote output to {OUTPUT_DIR}")


def run(test_mode: bool, aggregate_only: bool):
    if aggregate_only:
        if not RAW_RESULTS_PATH.exists():
            raise SystemExit(f"No raw results found at {RAW_RESULTS_PATH}. Run without --aggregate-only first.")
        with open(RAW_RESULTS_PATH, encoding="utf-8") as f:
            results = json.load(f)
        print(f"Loaded {len(results)} persisted raw results from {RAW_RESULTS_PATH}")
        aggregate(results)
        return

    results = extract_all(test_mode)
    if results is None:  # test mode
        return

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(RAW_RESULTS_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"Wrote raw per-posting results to {RAW_RESULTS_PATH}")

    aggregate(results)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", action="store_true", help="Run on first 20 rows only, print raw output, write no files")
    parser.add_argument("--aggregate-only", action="store_true", help="Re-aggregate from data/output/raw_results.json without calling the API")
    args = parser.parse_args()
    run(test_mode=args.test, aggregate_only=args.aggregate_only)
