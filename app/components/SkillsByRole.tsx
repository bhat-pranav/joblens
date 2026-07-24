"use client";

import { useState } from "react";

type Skill = { skill: string; count: number };
type SkillsByRoleData = Record<string, Skill[]>;

const ROLES: { key: string; label: string; accent: string }[] = [
  { key: "SWE", label: "SWE", accent: "var(--role-swe)" },
  { key: "Data/ML", label: "Data/ML", accent: "var(--role-dataml)" },
  { key: "Product/Program Mgmt", label: "Product/PM", accent: "var(--role-pm)" },
  { key: "Technical Ops/Solutions", label: "Tech Ops", accent: "var(--role-ops)" },
];

export default function SkillsByRole({ data }: { data: SkillsByRoleData }) {
  const roles = ROLES.filter((r) => data[r.key]);
  const [activeKey, setActiveKey] = useState(roles[0].key);
  const active = roles.find((r) => r.key === activeKey) ?? roles[0];
  const items = data[active.key];
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {roles.map((role) => {
          const isActive = role.key === activeKey;
          return (
            <button
              key={role.key}
              type="button"
              onClick={() => setActiveKey(role.key)}
              className="flex items-center gap-2 rounded-full py-1.5 pl-2.5 pr-3.5 text-sm transition-colors"
              style={{
                background: isActive ? "var(--surface-raised)" : "transparent",
                border: `1px solid ${isActive ? role.accent : "var(--hairline)"}`,
                color: isActive ? "var(--ink)" : "var(--fog)",
              }}
              aria-pressed={isActive}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: role.accent }}
                aria-hidden
              />
              {role.label}
            </button>
          );
        })}
      </div>

      <div
        className="rounded-sm p-4 sm:p-5"
        style={{
          border: `1px solid ${active.accent}`,
          background: "var(--surface-raised)",
        }}
      >
        <ol className="flex flex-col">
          {items.slice(0, 20).map((item, i) => {
            const pct = Math.max((item.count / max) * 100, 4);
            return (
              <li
                key={item.skill}
                className="grid grid-cols-[1.75rem_9rem_1fr_3rem] items-center gap-3 py-2 sm:grid-cols-[1.75rem_12rem_1fr_3rem]"
                style={{ borderTop: i === 0 ? "none" : "1px solid var(--hairline)" }}
              >
                <span
                  className="text-right font-mono text-xs tabular"
                  style={{ color: "var(--fog)" }}
                >
                  {i + 1}
                </span>
                <span
                  className="truncate text-sm"
                  style={{ color: "var(--ink)" }}
                  title={item.skill}
                >
                  {item.skill}
                </span>
                <span
                  className="h-1.5 rounded-full"
                  style={{ background: "var(--hairline)" }}
                >
                  <span
                    className="block h-1.5 rounded-full"
                    style={{ width: `${pct}%`, background: active.accent }}
                  />
                </span>
                <span
                  className="text-right font-mono text-xs tabular"
                  style={{ color: "var(--fog)" }}
                >
                  {item.count.toLocaleString()}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
