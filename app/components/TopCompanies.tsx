type Company = { company: string; postings: number };

export default function TopCompanies({ items }: { items: Company[] }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr
          className="font-mono text-xs uppercase tracking-wider"
          style={{ color: "var(--fog)" }}
        >
          <th className="w-10 pb-2 text-left font-normal">Rank</th>
          <th className="pb-2 text-left font-normal">Company</th>
          <th className="pb-2 text-right font-normal">Postings</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={item.company} style={{ borderTop: "1px solid var(--hairline)" }}>
            <td className="py-2.5 pl-2.5" style={{ borderLeft: `2px solid ${i < 3 ? "var(--signal)" : "transparent"}` }}>
              <span
                className="font-mono text-xs tabular"
                style={{ color: i < 3 ? "var(--signal)" : "var(--fog)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </td>
            <td className="py-2.5 pr-3 text-sm" style={{ color: "var(--ink)" }}>
              {item.company}
            </td>
            <td
              className="py-2.5 text-right font-mono text-sm tabular"
              style={{ color: "var(--fog)" }}
            >
              {item.postings.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
