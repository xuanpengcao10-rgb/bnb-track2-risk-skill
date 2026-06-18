import { evaluateStrategy } from "../core/strategy.js";
import type { AgentReadableOutput, StrategyInput } from "../core/types.js";

type JsonSchema = {
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
      market: { type: "object", description: "CMC-style market metrics." },
      narrative: { type: "object", description: "News, social, KOL, and catalyst signals." },
      risk: { type: "object", description: "Portfolio drawdown and execution risk limits." },
    },
  },
  outputSchema: {
    type: "object",
    required: ["decision", "confidence", "maxPositionPct", "stopLossPct", "riskGates", "executionGuards"],
    properties: {
      decision: { enum: ["buy", "hold", "avoid"] },
      confidence: { type: "number", minimum: 0, maximum: 100 },
      maxPositionPct: { type: "number", minimum: 0 },
      stopLossPct: { type: "number", minimum: 0 },
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
    },
  };
}
