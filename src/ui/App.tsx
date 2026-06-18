import { useMemo, useState } from "react";
import {
  ArrowSquareOut,
  ChartLineUp,
  CheckCircle,
  Code,
  Gauge,
  LockKey,
  ShieldCheck,
  TrendDown,
  WarningCircle,
} from "@phosphor-icons/react";
import { evaluateStrategy } from "../core/strategy.js";
import { runSimulation } from "../core/simulation.js";
import type { EquityCurvePoint } from "../core/simulation.js";
import type { RiskGateResult, StrategyAction } from "../core/types.js";
import { sampleScenarios } from "../data/scenarios.js";

const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: value >= 10_000_000 ? "compact" : "standard",
  }).format(value);

const actionCopy: Record<StrategyAction, { label: string; tone: string; detail: string }> = {
  buy: {
    label: "BUY",
    tone: "positive",
    detail: "Risk gates are open and narrative strength justifies controlled exposure.",
  },
  hold: {
    label: "HOLD",
    tone: "neutral",
    detail: "The setup is worth monitoring, but not strong enough for fresh exposure.",
  },
  avoid: {
    label: "AVOID",
    tone: "danger",
    detail: "The agent should protect capital because at least one gate or signal threshold failed.",
  },
};

function GateIcon({ gate }: { gate: RiskGateResult }) {
  if (gate.passed) return <CheckCircle weight="fill" aria-hidden="true" />;
  if (gate.severity === "critical") return <WarningCircle weight="fill" aria-hidden="true" />;
  return <TrendDown weight="fill" aria-hidden="true" />;
}

export function App() {
  const [scenarioId, setScenarioId] = useState(sampleScenarios[0].id);
  const scenario = sampleScenarios.find((item) => item.id === scenarioId) ?? sampleScenarios[0];
  const decision = useMemo(() => evaluateStrategy(scenario.input), [scenario]);
  const simulation = useMemo(() => runSimulation(sampleScenarios), []);
  const action = actionCopy[decision.action];
  const json = JSON.stringify(decision.agentOutput, null, 2);
  const freshnessGate = decision.risk.gates.find((gate) => gate.id === "data-freshness");

  return (
    <main className="app-shell">
      <a className="skip-link" href="#analysis">Skip to analysis</a>
      <section className="hero-grid" aria-labelledby="page-title">
        <div className="hero-copy">
          <div className="eyebrow"><ShieldCheck size={16} weight="fill" /> BNB Hack Track 2 Strategy Skill</div>
          <h1 id="page-title">Risk-Gated Narrative Alpha Skill</h1>
          <p>
            A strategy module for AI trading agents that converts market, narrative, and risk signals into a
            custody-free decision: when to buy, hold, or refuse the trade.
          </p>
          <div className="hero-links" aria-label="Integration targets">
            <span>CMC-style signal schema</span>
            <span>BNB Agent SDK compatible</span>
            <span>Trust Wallet execution guard</span>
          </div>
        </div>

        <div className="decision-panel" aria-label="Current strategy decision">
          <div className="decision-header">
            <span>{scenario.input.token.symbol}</span>
            <strong className={`action-pill ${action.tone}`}>{action.label}</strong>
          </div>
          <div className="confidence-ring" style={{ "--confidence": `${decision.confidence}%` } as React.CSSProperties}>
            <div>
              <span>{decision.confidence}</span>
              <small>confidence</small>
            </div>
          </div>
          <p>{action.detail}</p>
          <div className="decision-foot">
            <span>{decision.risk.summary}</span>
            <span>Data age {freshnessGate?.observed ?? "not supplied"}</span>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Strategy proof points">
        <ProofPoint label="Scenarios" value={simulation.summary.totalScenarios.toString()} detail="deterministic judge path" />
        <ProofPoint label="Risk blocks" value={simulation.summary.riskBlockedCount.toString()} detail="hard gate refusals" />
        <ProofPoint label="Capital preserved" value={`${simulation.summary.capitalPreservedPct}%`} detail="blocked losing setups" />
        <ProofPoint label="Custody" value="0" detail="keys or signatures held" />
      </section>

      <section className="workspace-grid" id="analysis">
        <aside className="scenario-rail" aria-label="Scenario selector">
          <div className="rail-title">
            <Gauge size={18} weight="bold" /> Scenarios
          </div>
          {sampleScenarios.map((item) => (
            <button
              className={item.id === scenarioId ? "scenario-button active" : "scenario-button"}
              key={item.id}
              onClick={() => setScenarioId(item.id)}
              type="button"
            >
              <span>{item.input.token.symbol}</span>
              <strong>{item.label}</strong>
              <small>next move {item.nextMovePct > 0 ? "+" : ""}{item.nextMovePct}%</small>
            </button>
          ))}
        </aside>

        <section className="analysis-stack" aria-label="Strategy analysis">
          <div className="section-heading">
            <div>
              <span>Selected setup</span>
              <h2>{scenario.label}</h2>
            </div>
            <a href="https://dorahacks.io/hackathon/bnbhack-twt-cmc/detail" target="_blank" rel="noreferrer">
              Track detail <ArrowSquareOut size={15} />
            </a>
          </div>

          <div className="metrics-grid">
            <Metric label="Signal score" value={decision.signalScore} suffix="/100" />
            <Metric label="Risk score" value={decision.riskScore} suffix="/100" />
            <Metric label="Max position" value={decision.position.maxPortfolioPct} suffix="%" />
            <Metric label="Stop loss" value={decision.position.stopLossPct} suffix="%" />
          </div>

          <div className="split-grid">
            <section className="panel gates-panel">
              <div className="panel-title"><LockKey size={18} weight="bold" /> Risk gates</div>
              <div className="gate-list">
                {decision.risk.gates.map((gate) => (
                  <div className={gate.passed ? "gate-row passed" : `gate-row failed ${gate.severity}`} key={gate.id}>
                    <div className="gate-icon"><GateIcon gate={gate} /></div>
                    <div>
                      <strong>{gate.label}</strong>
                      <p>{gate.rationale}</p>
                    </div>
                    <span>{typeof gate.observed === "number" && gate.id === "liquidity" ? formatUsd(gate.observed) : gate.observed}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel thesis-panel">
              <div className="panel-title"><ChartLineUp size={18} weight="bold" /> Trade thesis</div>
              <p className="thesis">{decision.thesis}</p>
              <ScoreBreakdown scores={decision.agentOutput.scoreBreakdown} />
              <div className="guard-block">
                <strong>Invalidation</strong>
                <ul>
                  {decision.invalidationConditions.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </section>
          </div>

          <div className="split-grid lower">
            <section className="panel json-panel">
              <div className="panel-title"><Code size={18} weight="bold" /> Agent-readable output</div>
              <pre>{json}</pre>
            </section>

            <section className="panel summary-panel">
              <div className="panel-title"><ShieldCheck size={18} weight="bold" /> Simulation summary</div>
              <EquityCurveChart curve={simulation.equityCurve} />
              <div className="summary-list">
                <Metric label="Scenarios" value={simulation.summary.totalScenarios} />
                <Metric label="Risk blocks" value={simulation.summary.riskBlockedCount} />
                <Metric label="Average confidence" value={simulation.summary.averageConfidence} suffix="%" />
                <Metric label="Estimated portfolio return" value={simulation.summary.estimatedPortfolioReturnPct} suffix="%" />
                <Metric label="Capital preserved" value={simulation.summary.capitalPreservedPct} suffix="%" />
              </div>
              <div className="adapter-list" aria-label="Live integration adapters">
                <span>CMC Agent Hub payload adapter</span>
                <span>BNB agent tool wrapper</span>
                <span>Custody-free wallet guardrails</span>
              </div>
              <p className="simulation-note">
                Sample data is deterministic for judging. Live deployments can replace the scenario adapter with
                CMC Agent Hub feeds and route the output into a BNB trading agent.
              </p>
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}

function EquityCurveChart({ curve }: { curve: EquityCurvePoint[] }) {
  const width = 360;
  const height = 150;
  const padding = 20;
  const returns = curve.map((point) => point.cumulativeReturnPct);
  const minReturn = Math.min(0, ...returns);
  const maxReturn = Math.max(0, ...returns);
  const span = Math.max(maxReturn - minReturn, 1);
  const points = curve.map((point, index) => {
    const x = padding + (index / Math.max(curve.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((point.cumulativeReturnPct - minReturn) / span) * (height - padding * 2);
    return { ...point, x, y };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const zeroY = height - padding - ((0 - minReturn) / span) * (height - padding * 2);

  return (
    <div className="equity-card">
      <div className="equity-head">
        <span>Backtest equity curve</span>
        <strong>{curve.at(-1)?.cumulativeReturnPct ?? 0}%</strong>
      </div>
      <svg className="equity-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Deterministic backtest equity curve">
        <line className="equity-zero" x1={padding} x2={width - padding} y1={zeroY} y2={zeroY} />
        <polyline className="equity-line" points={line} fill="none" />
        {points.map((point) => (
          <g key={`${point.step}-${point.label}`}>
            <circle className="equity-dot" cx={point.x} cy={point.y} r="4" />
            <text x={point.x} y={height - 5} textAnchor="middle">{point.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Metric({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}{suffix}</strong>
    </div>
  );
}

function ProofPoint({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="proof-point">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function ScoreBreakdown({ scores }: { scores: { market: number; narrative: number; signal: number; risk: number } }) {
  const rows = [
    { label: "Market", value: scores.market },
    { label: "Narrative", value: scores.narrative },
    { label: "Signal", value: scores.signal },
    { label: "Risk", value: scores.risk },
  ];

  return (
    <div className="score-breakdown" aria-label="Score breakdown">
      {rows.map((row) => (
        <div className="score-row" key={row.label}>
          <div>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
          <div className="score-track">
            <span style={{ "--score": `${row.value}%` } as React.CSSProperties} />
          </div>
        </div>
      ))}
    </div>
  );
}
