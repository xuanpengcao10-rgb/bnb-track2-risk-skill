import type { StrategyInput } from "../core/types.js";
import { cmcSkillManifest, runCmcSkill, type CmcSkillResponse } from "./cmcSkill.js";

export interface BnbAgentStrategyTool {
  name: "risk_gated_narrative_alpha";
  description: string;
  inputSchema: typeof cmcSkillManifest.inputSchema;
  outputSchema: typeof cmcSkillManifest.outputSchema;
  permissions: typeof cmcSkillManifest.permissions;
  execute: (input: StrategyInput) => CmcSkillResponse;
}

export const bnbAgentStrategyTool: BnbAgentStrategyTool = {
  name: "risk_gated_narrative_alpha",
  description: "Pre-trade strategy gate for BNB ecosystem tokens with custody-free risk controls.",
  inputSchema: cmcSkillManifest.inputSchema,
  outputSchema: cmcSkillManifest.outputSchema,
  permissions: cmcSkillManifest.permissions,
  execute: runCmcSkill,
};
