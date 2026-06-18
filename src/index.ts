export { evaluateStrategy } from "./core/strategy.js";
export { runSimulation } from "./core/simulation.js";
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
export { cmcSkillManifest, runCmcSkill } from "./integrations/cmcSkill.js";
export type { CmcSkillManifest, CmcSkillResponse } from "./integrations/cmcSkill.js";
