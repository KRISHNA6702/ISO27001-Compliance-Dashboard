import React, { useMemo, useState } from "react";


const C = {
  bg: "#0A0F16",
  panel: "#111925",
  panel2: "#151F2C",
  border: "#22303F",
  borderBright: "#32455A",
  text: "#E7ECF2",
  muted: "#8C9AAC",
  dim: "#54687D",
  teal: "#3FB08A",
  amber: "#DDA43D",
  orange: "#DD7148",
  red: "#C1443C",
  redDeep: "#8C2F2F",
  slate: "#5B6C80",
};

const STATUS_META = {
  implemented: { label: "Implemented", color: C.teal, glyph: "✓" },
  partial: { label: "Partial", color: C.amber, glyph: "◐" },
  gap: { label: "Gap", color: C.red, glyph: "!" },
  na: { label: "N/A", color: C.slate, glyph: "–" },
};

const RISK_META = {
  low: { label: "Low", color: C.teal, order: 0 },
  medium: { label: "Medium", color: C.amber, order: 1 },
  high: { label: "High", color: C.orange, order: 2 },
  critical: { label: "Critical", color: C.redDeep, order: 3 },
};

/* ---------------------------------------------------------------
   DATA — ISO/IEC 27001:2022 Annex A control titles
--------------------------------------------------------------- */
const ORG = ["Policies for information security","Information security roles and responsibilities","Segregation of duties","Management responsibilities","Contact with authorities","Contact with special interest groups","Threat intelligence","Information security in project management","Inventory of information and other associated assets","Acceptable use of information and other associated assets","Return of assets","Classification of information","Labelling of information","Information transfer","Access control","Identity management","Authentication information","Access rights","Information security in supplier relationships","Addressing information security within supplier agreements","Managing information security in the ICT supply chain","Monitoring, review and change management of supplier services","Information security for use of cloud services","Incident management planning and preparation","Assessment and decision on information security events","Response to information security incidents","Learning from information security incidents","Collection of evidence","Information security during disruption","ICT readiness for business continuity","Legal, statutory, regulatory and contractual requirements","Intellectual property rights","Protection of records","Privacy and protection of PII","Independent review of information security","Compliance with policies, rules and standards","Documented operating procedures"];

const PEOPLE = ["Screening","Terms and conditions of employment","Information security awareness, education and training","Disciplinary process","Responsibilities after termination or change of employment","Confidentiality or non-disclosure agreements","Remote working","Information security event reporting"];

const PHYSICAL = ["Physical security perimeters","Physical entry","Securing offices, rooms and facilities","Physical security monitoring","Protecting against physical and environmental threats","Working in secure areas","Clear desk and clear screen","Equipment siting and protection","Security of assets off-premises","Storage media","Supporting utilities","Cabling security","Equipment maintenance","Secure disposal or re-use of equipment"];

const TECH = ["User endpoint devices","Privileged access rights","Information access restriction","Access to source code","Secure authentication","Capacity management","Protection against malware","Management of technical vulnerabilities","Configuration management","Information deletion","Data masking","Data leakage prevention","Information backup","Redundancy of information processing facilities","Logging","Monitoring activities","Clock synchronization","Use of privileged utility programs","Installation of software on operational systems","Networks security","Security of network services","Segregation of networks","Web filtering","Use of cryptography","Secure development life cycle","Application security requirements","Secure system architecture and engineering principles","Secure coding","Security testing in development and acceptance","Outsourced development","Separation of development, test and production environments","Change management","Test information","Protection of information systems during audit testing"];

const STATUS_CYCLE = ["implemented","implemented","implemented","partial","implemented","gap","implemented","implemented","partial","na","implemented","gap","implemented","partial","implemented","implemented","gap","implemented","na","implemented"];
const RISK_BY_STATUS = {
  implemented: ["low", "low", "medium", "low", "medium"],
  partial: ["medium", "high", "medium", "high"],
  gap: ["high", "critical", "high", "critical"],
  na: ["low"],
};

function buildTheme(prefix, name, items, startIdx) {
  return items.map((title, i) => {
    const gi = startIdx + i;
    const status = STATUS_CYCLE[gi % STATUS_CYCLE.length];
    const riskPool = RISK_BY_STATUS[status];
    const risk = riskPool[gi % riskPool.length];
    return {
      id: `${prefix}.${i + 1}`,
      title,
      theme: name,
      status,
      risk,
    };
  });
}

const CONTROLS = [
  ...buildTheme("A.5", "Organizational", ORG, 0),
  ...buildTheme("A.6", "People", PEOPLE, 37),
  ...buildTheme("A.7", "Physical", PHYSICAL, 45),
  ...buildTheme("A.8", "Technological", TECH, 59),
];

const THEMES = [
  { key: "Organizational", eyebrow: "A.5", total: ORG.length },
  { key: "People", eyebrow: "A.6", total: PEOPLE.length },
  { key: "Physical", eyebrow: "A.7", total: PHYSICAL.length },
  { key: "Technological", eyebrow: "A.8", total: TECH.length },
];

/* ---------------------------------------------------------------
   GAUGE
--------------------------------------------------------------- */
function Gauge({ percent }) {
  const size = 220, cx = size / 2, cy = size / 2, r = 88, sw = 12;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - percent / 100);
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  const zoneColor = percent >= 80 ? C.teal : percent >= 55 ? C.amber : C.red;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {ticks.map((i) => {
        const angle = i * 6;
        const major = i % 5 === 0;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy - r - 14}
            x2={cx}
            y2={cy - r - (major ? 22 : 18)}
            stroke={major ? C.borderBright : C.border}
            strokeWidth={major ? 2 : 1}
            transform={`rotate(${angle} ${cx} ${cy})`}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={sw} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={zoneColor}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.4,0,.2,1)" }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="40" fontWeight="600" fill={C.text}>
        {percent}%
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" fontFamily="'IBM Plex Sans', sans-serif" fontSize="11" letterSpacing="1.5" fill={C.muted}>
        COVERAGE
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------
   SMALL UI PARTS
--------------------------------------------------------------- */
function StatCard({ eyebrow, value, sub, accent }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 10.5, letterSpacing: 1.2, color: C.dim, fontFamily: "'IBM Plex Sans', sans-serif", textTransform: "uppercase", marginBottom: 8 }}>
        {eyebrow}
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 600, color: accent || C.text, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status];
  const isGap = status === "gap";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10.5,
        letterSpacing: 0.6,
        padding: "3px 8px",
        borderRadius: 4,
        color: m.color,
        border: `1px solid ${m.color}55`,
        background: `${m.color}14`,
        transform: isGap ? "rotate(-1.5deg)" : "none",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <span>{m.glyph}</span>
      {m.label.toUpperCase()}
    </span>
  );
}

function RiskChip({ risk }) {
  const m = RISK_META[risk];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.text }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0, boxShadow: `0 0 6px ${m.color}88` }} />
      {m.label}
    </span>
  );
}

function FilterPill({ active, onClick, children, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: 12.5,
        padding: "6px 12px",
        borderRadius: 999,
        border: `1px solid ${active ? (color || C.borderBright) : C.border}`,
        background: active ? `${color || C.borderBright}22` : "transparent",
        color: active ? (color || C.text) : C.muted,
        cursor: "pointer",
        transition: "all 150ms ease",
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------
   MAIN
--------------------------------------------------------------- */
export default function App() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");

  const total = CONTROLS.length;
  const implementedCount = CONTROLS.filter((c) => c.status === "implemented").length;
  const partialCount = CONTROLS.filter((c) => c.status === "partial").length;
  const gapCount = CONTROLS.filter((c) => c.status === "gap").length;
  const naCount = CONTROLS.filter((c) => c.status === "na").length;
  const applicable = total - naCount;
  const coveragePercent = Math.round(((implementedCount + partialCount * 0.5) / applicable) * 100);
  const highRiskCount = CONTROLS.filter((c) => c.risk === "high" || c.risk === "critical").length;
  const criticalGaps = CONTROLS.filter((c) => c.status === "gap" && c.risk === "critical").length;

  const themeStats = useMemo(
    () =>
      THEMES.map((t) => {
        const items = CONTROLS.filter((c) => c.theme === t.key);
        const impl = items.filter((c) => c.status === "implemented").length;
        const gaps = items.filter((c) => c.status === "gap").length;
        const pct = Math.round((impl / items.length) * 100);
        return { ...t, impl, gaps, pct };
      }),
    []
  );

  const gaps = useMemo(
    () =>
      CONTROLS.filter((c) => c.status === "gap").sort((a, b) => RISK_META[b.risk].order - RISK_META[a.risk].order),
    []
  );

  const filtered = useMemo(() => {
    return CONTROLS.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (riskFilter !== "all" && c.risk !== riskFilter) return false;
      if (themeFilter !== "all" && c.theme !== themeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!c.title.toLowerCase().includes(q) && !c.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, statusFilter, riskFilter, themeFilter]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: ${C.teal}44; }
        table { border-collapse: collapse; width: 100%; }
        tbody tr { transition: background 120ms ease; }
        tbody tr:hover { background: ${C.panel2}; }
        input::placeholder { color: ${C.dim}; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .fade { animation: fadeUp 500ms ease both; }
      `}</style>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 24px 64px" }}>
        {/* HEADER */}
        <div className="fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28, borderBottom: `1px solid ${C.border}`, paddingBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dim, marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>
              ISO/IEC 27001:2022 · ANNEX A
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
              Compliance Control Ledger
            </h1>
            <div style={{ color: C.muted, fontSize: 13.5, marginTop: 6 }}>
              {total} controls across 4 themes · Statement of Applicability tracking
            </div>
          </div>
          <div style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.muted }}>
            <div>AUDIT REFERENCE</div>
            <div style={{ color: C.text, fontSize: 14, marginTop: 2 }}>SOA-2026-Q3</div>
          </div>
        </div>

        {/* TOP: GAUGE + STATS */}
        <div className="fade" style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 28 }}>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Gauge percent={coveragePercent} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, flex: 1, minWidth: 280 }}>
            <StatCard eyebrow="Implemented" value={implementedCount} sub={`of ${applicable} applicable`} accent={C.teal} />
            <StatCard eyebrow="Partial" value={partialCount} sub="in-progress controls" accent={C.amber} />
            <StatCard eyebrow="Gaps" value={gapCount} sub={`${criticalGaps} critical-risk`} accent={C.red} />
            <StatCard eyebrow="High / Critical Risk" value={highRiskCount} sub="across all controls" accent={C.orange} />
          </div>
        </div>

        {/* THEME BREAKDOWN */}
        <div className="fade" style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: C.dim, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
            CONTROL THEMES
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {themeStats.map((t) => (
              <div key={t.key} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <div>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.dim, marginRight: 8 }}>{t.eyebrow}</span>
                    <span style={{ fontWeight: 600, fontSize: 14.5 }}>{t.key}</span>
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, color: t.pct >= 70 ? C.teal : t.pct >= 40 ? C.amber : C.red }}>
                    {t.pct}%
                  </span>
                </div>
                <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{ height: "100%", width: `${t.pct}%`, background: t.pct >= 70 ? C.teal : t.pct >= 40 ? C.amber : C.red, transition: "width 700ms ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted }}>
                  <span>{t.impl}/{t.total} implemented</span>
                  {t.gaps > 0 && <span style={{ color: C.red }}>{t.gaps} gap{t.gaps > 1 ? "s" : ""}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GAP WATCHLIST */}
        {gaps.length > 0 && (
          <div className="fade" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: C.dim, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
              GAP WATCHLIST · ORDERED BY RISK IMPACT
            </div>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
              {gaps.map((g, i) => (
                <div
                  key={g.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 18px",
                    borderTop: i === 0 ? "none" : `1px solid ${C.border}`,
                    borderLeft: `3px solid ${RISK_META[g.risk].color}`,
                  }}
                >
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.dim, width: 48, flexShrink: 0 }}>{g.id}</span>
                  <span style={{ flex: 1, fontSize: 13.5 }}>{g.title}</span>
                  <span style={{ fontSize: 11.5, color: C.muted, flexShrink: 0 }}>{g.theme}</span>
                  <RiskChip risk={g.risk} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FILTERS */}
        <div className="fade" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: C.dim, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
            FULL CONTROL LEDGER
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search control ID or title…"
              style={{
                flex: "1 1 220px",
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                color: C.text,
                fontSize: 13,
                fontFamily: "'IBM Plex Sans', sans-serif",
                outline: "none",
              }}
            />
            <select
              value={themeFilter}
              onChange={(e) => setThemeFilter(e.target.value)}
              style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13 }}
            >
              <option value="all">All themes</option>
              {THEMES.map((t) => (
                <option key={t.key} value={t.key}>{t.key}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            <FilterPill active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>All statuses</FilterPill>
            {Object.entries(STATUS_META).map(([k, m]) => (
              <FilterPill key={k} active={statusFilter === k} onClick={() => setStatusFilter(statusFilter === k ? "all" : k)} color={m.color}>
                {m.label}
              </FilterPill>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <FilterPill active={riskFilter === "all"} onClick={() => setRiskFilter("all")}>All risk levels</FilterPill>
            {Object.entries(RISK_META).map(([k, m]) => (
              <FilterPill key={k} active={riskFilter === k} onClick={() => setRiskFilter(riskFilter === k ? "all" : k)} color={m.color}>
                {m.label}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="fade" style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            <table>
              <thead>
                <tr style={{ position: "sticky", top: 0, background: C.panel2, zIndex: 1 }}>
                  {["ID", "Control", "Theme", "Status", "Risk"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 10.5, letterSpacing: 1, color: C.dim, borderBottom: `1px solid ${C.border}`, fontFamily: "'IBM Plex Mono', monospace" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.dim, whiteSpace: "nowrap" }}>{c.id}</td>
                    <td style={{ padding: "10px 16px", fontSize: 13.5 }}>{c.title}</td>
                    <td style={{ padding: "10px 16px", fontSize: 12.5, color: C.muted, whiteSpace: "nowrap" }}>{c.theme}</td>
                    <td style={{ padding: "10px 16px" }}><StatusBadge status={c.status} /></td>
                    <td style={{ padding: "10px 16px" }}><RiskChip risk={c.risk} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: C.dim, fontSize: 13 }}>
                      No controls match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "10px 16px", fontSize: 11.5, color: C.dim, borderTop: `1px solid ${C.border}`, fontFamily: "'IBM Plex Mono', monospace" }}>
            SHOWING {filtered.length} OF {total} CONTROLS
          </div>
        </div>
      </div>
    </div>
  );
}
