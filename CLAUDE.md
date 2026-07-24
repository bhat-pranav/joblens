## Job Lens

Data-viz app showing real job-market skill demand extracted from postings via LLM.
Static Next.js frontend + standalone Python extraction pipeline (offline, output committed as JSON).

### Pipeline (scripts/extract_skills.py)

- Input: data/joblens_sample.csv — 1,000 postings sampled from a 124k-row LinkedIn dataset
- Calls gpt-4o-mini (JSON mode, temp=0) to extract 5-15 categorized skills per posting
- Remaps CSV's role_category to 4 labels: SWE, Data/ML, Product/Program Mgmt, Technical Ops/Solutions
- Filters ~40 known staffing/recruiting agencies before aggregating
- Skill names normalized for counting, clean labels kept for display
- Outputs: data/output/top_skills.json, skills_by_role.json, top_companies.json, raw_results.json (61k lines, cached to avoid re-hitting API)
- Modes: --test (20-row dry run), full run, --aggregate-only (re-aggregate from cache)
- Already run end-to-end: all four output files populated, 119 agency postings excluded

### Frontend (app/page.tsx)

- Next.js 16 / React 19 / Tailwind 4, statically imports the three output JSONs at build time — no runtime API/DB
- Three sections: TopSkills.tsx, SkillsByRole.tsx, TopCompanies.tsx
- Custom editorial/monospace design system (--ink, --fog, --signal, --hairline)
- Custom OG image (app/opengraph-image.tsx), custom favicon (app/icon.tsx)
- Deployed on Vercel, metadataBase set to deployed URL

### Known gaps

- No rate limiting concerns (offline pipeline, not user-facing API)
- No tests, no CI, no re-run automation
- .env holds OPENAI_API_KEY for pipeline re-runs (value not inspected)

### Git history

5 commits: scaffold → extraction script → frontend build → polish → Vercel metadata fix
