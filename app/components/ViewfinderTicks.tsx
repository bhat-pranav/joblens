const CORNERS = [
  { top: 0, left: 0, borderRight: "none", borderBottom: "none" },
  { top: 0, right: 0, borderLeft: "none", borderBottom: "none" },
  { bottom: 0, left: 0, borderRight: "none", borderTop: "none" },
  { bottom: 0, right: 0, borderLeft: "none", borderTop: "none" },
] as const;

export default function ViewfinderTicks() {
  return (
    <div className="pointer-events-none fixed inset-4 z-0 sm:inset-6" aria-hidden>
      {CORNERS.map((corner, i) => (
        <span
          key={i}
          className="absolute h-4 w-4"
          style={{
            ...corner,
            border: "1px solid var(--fog)",
            opacity: 0.35,
          }}
        />
      ))}
    </div>
  );
}
