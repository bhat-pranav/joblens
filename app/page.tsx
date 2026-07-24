import TopSkills from "./components/TopSkills";
import SkillsByRole from "./components/SkillsByRole";
import TopCompanies from "./components/TopCompanies";
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
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6">
      <p
        className="font-mono text-xs tabular"
        style={{ color: "var(--signal)" }}
      >
        {index}
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
      <main className="relative z-10 flex w-full max-w-2xl flex-col gap-16">
        <header>
          <h1
            className="font-display text-5xl tracking-tight sm:text-6xl"
            style={{ color: "var(--ink)" }}
          >
            JobLens
          </h1>
          <p className="mt-3 max-w-md text-sm" style={{ color: "var(--fog)" }}>
            What the job market is actually asking for, extracted from real
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
            index="01"
            title="Top Skills"
            subtitle="The 20 most requested skills across all postings, sized by frequency."
          />
          <TopSkills items={topSkills} />
        </section>

        <section>
          <SectionHeading
            index="02"
            title="Skills by Role"
            subtitle="Top skills within each role category. Switch roles to see how requirements shift."
          />
          <SkillsByRole data={skillsByRole} />
        </section>

        <section>
          <SectionHeading
            index="03"
            title="Top Hiring Companies"
            subtitle="Ranked by posting count. Recruiting and staffing agencies excluded — this reflects the employers doing the hiring."
          />
          <TopCompanies items={topCompanies} />
        </section>

        <footer
          className="flex flex-col gap-2 pt-4 font-mono text-[11px]"
          style={{ borderTop: "1px solid var(--hairline)", color: "var(--fog)" }}
        >
          <p>
            Source: 1,000-posting sample from a 124k-row LinkedIn job
            postings dataset. Skills and role extraction performed
            per-posting by GPT-4o-mini; 119 recruiting-agency postings
            filtered from the companies view; skill names normalized to
            merge duplicate phrasing.
          </p>
          <p>
            Built by Pranav Bhat —{" "}
            <a
              href="https://github.com/bhat-pranav/joblens"
              className="underline decoration-dotted underline-offset-2"
              style={{ color: "var(--fog)" }}
            >
              source on GitHub
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
