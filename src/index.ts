export { evaluateStrategy } from "./core/strategy.js";
export { runSimulation } from "./core/simulation.js";
export type { BaselineComparison, EquityCurvePoint, SimulationOutcome, SimulationResult, SimulationRow, SimulationSummary } from "./core/simulation.js";
export type {
  AgentReadableOutput,
  MarketSignals,
  NarrativeSignals,
  RiskGateResult,
  RiskLimits,
  RiskProfile,
  StrategyAction,
  StrategyInput,
  StrategyResult,
  TokenContext,
} from "./core/types.js";
export { sampleScenarios } from "./data/scenarios.js";
export { cmcSkillManifest, cmcSkillResponseSchema, runCmcSkill } from "./integrations/cmcSkill.js";
export type { CmcSkillManifest, CmcSkillResponse } from "./integrations/cmcSkill.js";
export { normalizeCmcAgentHubPayload, runCmcAgentHubSkill } from "./integrations/cmcAgentHub.js";
export type { CmcAgentHubPayload } from "./integrations/cmcAgentHub.js";
export { bnbAgentStrategyTool } from "./integrations/bnbAgentTool.js";
export type { BnbAgentStrategyTool } from "./integrations/bnbAgentTool.js";
