import { evaluateStrategy } from "../core/strategy.js";
import type { AgentReadableOutput, StrategyInput } from "../core/types.js";

export type JsonSchema = {
  type: "object";
  required: string[];
  properties: Record<string, unknown>;
};

export interface CmcSkillManifest {
  name: "risk-gated-narrative-alpha";
  displayName: string;
  version: "1.0.0";
  track: "BNB Hack Track 2: Strategy Skills";
  description: string;
  inputSchema: JsonSchema;
  outputSchema: JsonSchema;
  permissions: {
    custody: "none";
    trading: "analysis-only";
    externalApis: string[];
  };
  integrations: string[];
  capabilities: string[];
  auditFields: string[];
  reviewExamples: Array<{
    name: string;
    path: string;
    purpose: string;
  }>;
}

export interface CmcSkillResponse {
  skill: CmcSkillManifest["name"];
  version: CmcSkillManifest["version"];
  output: AgentReadableOutput & {
    executionGuards: string[];
    takeProfitPct: number;
    cooldownHours: number;
  };
  audit: {
    sourceAdapters: string[];
    custodyMode: "analysis-only";
    riskGateSummary: string;
    dataMode: "deterministic-demo" | "live-compatible-payload";
    adapterReady: boolean;
    liveReady: boolean;
    inputSource?: string;
    inputGeneratedAt?: string;
    warnings: string[];
  };
}

export const cmcSkillManifest: CmcSkillManifest = {
  name: "risk-gated-narrative-alpha",
  displayName: "Risk-Gated Narrative Alpha Skill",
  version: "1.0.0",
  track: "BNB Hack Track 2: Strategy Skills",
  description:
    "Turns CMC-style market, narrative, and portfolio-risk signals into buy, hold, or avoid decisions with hard risk gates.",
  inputSchema: {
    type: "object",
    required: ["token", "market", "narrative", "risk"],
    properties: {
      token: { type: "object", description: "Token identity and eligibility context." },
      market: { type: "object", description: "CMC-style market metrics, including optional dataAgeMinutes freshness context." },
      narrative: { type: "object", description: "News, social, KOL, and catalyst signals." },
      risk: { type: "object", description: "Portfolio drawdown, data freshness, and execution risk limits." },
    },
  },
  outputSchema: {
    type: "object",
    required: [
      "decision",
      "confidence",
      "maxPositionPct",
      "stopLossPct",
      "scoreBreakdown",
      "riskGates",
      "executionGuards",
    ],
    properties: {
      decision: { enum: ["buy", "hold", "avoid"] },
      confidence: { type: "number", minimum: 0, maximum: 100 },
      maxPositionPct: { type: "number", minimum: 0 },
      stopLossPct: { type: "number", minimum: 0 },
      scoreBreakdown: { type: "object" },
      riskGates: { type: "array" },
      executionGuards: { type: "array" },
    },
  },
  permissions: {
    custody: "none",
    trading: "analysis-only",
    externalApis: ["CoinMarketCap Agent Hub compatible input adapter"],
  },
  integrations: ["CoinMarketCap Agent Hub", "BNB Agent SDK", "Trust Wallet Agent Kit"],
  capabilities: [
    "pre-trade-risk-gates",
    "backtestable-strategy-spec",
    "cmc-agent-hub-payload-normalization",
    "bnb-agent-tool-wrapper",
    "analysis-only-execution-guards",
  ],
  auditFields: ["dataMode", "adapterReady", "liveReady", "riskGateSummary", "warnings"],
  reviewExamples: [
    {
      name: "Deterministic demo response",
      path: "examples/cmc-skill-response.json",
      purpose: "Shows the exact JSON payload a downstream agent can consume.",
    },
    {
      name: "Live-style CMC Agent Hub payload",
      path: "examples/cmc-agent-hub-payload.json",
      purpose: "Shows the enriched CMC-compatible adapter input shape.",
    },
    {
      name: "Baseline comparison report",
      path: "docs/backtest-baseline-report.md",
      purpose: "Compares risk-gated decisions against a naive buy-all baseline.",
    },
  ],
};

export const cmcSkillResponseSchema: JsonSchema = {
  type: "object",
  required: ["skill", "version", "output", "audit"],
  properties: {
    skill: { const: cmcSkillManifest.name },
    version: { const: cmcSkillManifest.version },
    output: cmcSkillManifest.outputSchema,
    audit: {
      type: "object",
      required: ["sourceAdapters", "custodyMode", "riskGateSummary", "dataMode", "adapterReady", "liveReady", "warnings"],
      properties: {
        sourceAdapters: { type: "array" },
        custodyMode: { const: "analysis-only" },
        riskGateSummary: { type: "string" },
        dataMode: { enum: ["deterministic-demo", "live-compatible-payload"] },
        adapterReady: { type: "boolean" },
        liveReady: { type: "boolean" },
        inputSource: { type: "string" },
        inputGeneratedAt: { type: "string" },
        warnings: { type: "array" },
      },
    },
  },
};

export function runCmcSkill(input: StrategyInput): CmcSkillResponse {
  const result = evaluateStrategy(input);

  return {
    skill: cmcSkillManifest.name,
    version: cmcSkillManifest.version,
    output: {
      ...result.agentOutput,
      executionGuards: result.executionGuards,
      takeProfitPct: result.position.takeProfitPct,
      cooldownHours: result.position.cooldownHours,
    },
    audit: {
      sourceAdapters: ["cmc-style-market", "narrative-alpha", "portfolio-risk"],
      custodyMode: "analysis-only",
      riskGateSummary: result.risk.summary,
      dataMode: "deterministic-demo",
      adapterReady: true,
      liveReady: false,
      warnings: ["Demo scenarios are deterministic fixtures; refresh with a live CMC payload before execution."],
    },
  };
}
