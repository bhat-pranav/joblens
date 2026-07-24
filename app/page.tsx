import TopSkills from "./components/TopSkills";
import SkillsByRole from "./components/SkillsByRole";
import TopCompanies from "./components/TopCompanies";
import ViewfinderTicks from "./components/ViewfinderTicks";
import topSkills from "@/data/output/top_skills.json";
import skillsByRole from "@/data/output/skills_by_role.json";
import topCompanies from "@/data/output/top_companies.json";

const METHODOLOGY = [
  "1,000 POSTINGS SAMPLED",
  "119 AGENCY POSTINGS FILTERED",
  "SKILLS EXTRACTED VIA GPT-4o-mini",
  "4 ROLE CATEGORIES",
];

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6">
      <p
        className="font-mono text-xs uppercase tracking-wider"
        style={{ color: "var(--signal)" }}
      >
        {eyebrow}
      </p>
      <h2
        className="mt-1 font-display text-3xl"
        style={{ color: "var(--ink)" }}
      >
        {title}
      </h2>
      <p className="mt-1.5 text-sm" style={{ color: "var(--fog)" }}>
        {subtitle}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex flex-1 justify-center px-5 py-16 sm:px-10">
      <ViewfinderTicks />
      <main className="relative z-10 flex w-full max-w-2xl flex-col gap-16">
        <header>
          <h1
            className="font-display text-5xl tracking-tight sm:text-6xl"
            style={{ color: "var(--ink)" }}
          >
            JobLens
          </h1>
          <p className="mt-3 max-w-md text-sm" style={{ color: "var(--fog)" }}>
            What the job market is actually asking for, focused out of real
            postings.
          </p>
          <p
            className="mt-6 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-wider"
            style={{ color: "var(--fog)" }}
          >
            {METHODOLOGY.map((stat, i) => (
              <span key={stat} className="flex items-center gap-2">
                {i > 0 && (
                  <span style={{ color: "var(--signal)" }} aria-hidden>
                    ·
                  </span>
                )}
                {stat}
              </span>
            ))}
          </p>
        </header>

        <section>
          <SectionHeading
            eyebrow="01 — Signal Strength"
            title="Top Skills"
            subtitle="The 20 most requested skills across all postings, sized by frequency."
          />
          <TopSkills items={topSkills} />
        </section>

        <section>
          <SectionHeading
            eyebrow="02 — Filter By Role"
            title="Skills by Role"
            subtitle="Top skills within each role category — switch the filter to change the lens."
          />
          <SkillsByRole data={skillsByRole} />
        </section>

        <section>
          <SectionHeading
            eyebrow="03 — Employer Log"
            title="Top Hiring Companies"
            subtitle="Ranked by posting count. Recruiting and staffing agencies excluded — this reflects the employers doing the hiring."
          />
          <TopCompanies items={topCompanies} />
        </section>

        <footer
          className="pt-4 font-mono text-[11px]"
          style={{ borderTop: "1px solid var(--hairline)", color: "var(--fog)" }}
        >
          Source: 1,000-posting sample drawn from a 124k-row LinkedIn job
          postings dataset. Skill and role extraction performed per-posting by
          GPT-4o-mini; skill names normalized to merge duplicate phrasing.
        </footer>
      </main>
    </div>
  );
}
