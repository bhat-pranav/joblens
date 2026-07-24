type Skill = { skill: string; count: number };

const TOTAL_POSTINGS = 1000;

export default function TopSkills({ items }: { items: Skill[] }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  const tierA = items.slice(0, 3);
  const tierB = items.slice(3, 8);
  const tierC = items.slice(8, 20);

  return (
    <div className="flex flex-col gap-8">
      <ol className="flex flex-col gap-5">
        {tierA.map((item, i) => {
          const pct = (item.count / max) * 100;
          const shareOfPostings = Math.round((item.count / TOTAL_POSTINGS) * 100);
          return (
            <li key={item.skill}>
              <div className="flex items-baseline gap-4">
                <span
                  className="font-display leading-none tabular"
                  style={{ fontSize: "3.25rem", color: "var(--signal)" }}
                >
                  {i + 1}
                </span>
                <span
                  className="font-display leading-none"
                  style={{ fontSize: "2.25rem", color: "var(--ink)" }}
                >
                  {item.skill}
                </span>
              </div>
              <div
                className="mt-2 h-2.5 w-full"
                style={{ background: "var(--hairline)" }}
              >
                <div
                  className="h-full"
                  style={{ width: `${pct}%`, background: "var(--signal)" }}
                />
              </div>
              <p
                className="mt-1.5 font-mono text-xs tabular"
                style={{ color: "var(--fog)" }}
              >
                {item.count.toLocaleString()} mentions · in {shareOfPostings}% of
                postings analyzed
              </p>
            </li>
          );
        })}
      </ol>

      <ol className="flex flex-col">
        {tierB.map((item, i) => {
          const pct = (item.count / max) * 100;
          return (
            <li
              key={item.skill}
              className="grid grid-cols-[2rem_1fr_4rem] items-center gap-3 py-2.5"
              style={{ borderTop: "1px solid var(--hairline)" }}
            >
              <span
                className="font-mono text-sm tabular"
                style={{ color: "var(--fog)" }}
              >
                {String(i + 4).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-base" style={{ color: "var(--ink)" }}>
                  {item.skill}
                </span>
                <span
                  className="block h-1.5"
                  style={{ background: "var(--hairline)" }}
                >
                  <span
                    className="block h-full"
                    style={{ width: `${pct}%`, background: "var(--signal)" }}
                  />
                </span>
              </span>
              <span
                className="text-right font-mono text-sm tabular"
                style={{ color: "var(--fog)" }}
              >
                {item.count.toLocaleString()}
              </span>
            </li>
          );
        })}
      </ol>

      <ol
        className="grid grid-cols-1 gap-x-6 sm:grid-cols-2"
        style={{ borderTop: "1px solid var(--hairline)" }}
      >
        {tierC.map((item, i) => (
          <li
            key={item.skill}
            className="flex items-center justify-between gap-3 py-1.5 font-mono text-xs"
            style={{ borderBottom: "1px solid var(--hairline)" }}
          >
            <span style={{ color: "var(--fog)" }}>
              <span className="tabular">{String(i + 9).padStart(2, "0")}</span>{" "}
              <span style={{ color: "var(--ink)" }}>{item.skill}</span>
            </span>
            <span className="tabular" style={{ color: "var(--fog)" }}>
              {item.count.toLocaleString()}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
