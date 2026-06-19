import type { StrategyInput } from "../core/types.js";
import { cmcSkillManifest, cmcSkillResponseSchema, runCmcSkill, type CmcSkillResponse, type JsonSchema } from "./cmcSkill.js";

export interface BnbAgentStrategyTool {
  name: "risk_gated_narrative_alpha";
  description: string;
  inputSchema: typeof cmcSkillManifest.inputSchema;
  outputSchema: JsonSchema;
  permissions: typeof cmcSkillManifest.permissions;
  execute: (input: StrategyInput) => CmcSkillResponse;
}

export const bnbAgentStrategyTool: BnbAgentStrategyTool = {
  name: "risk_gated_narrative_alpha",
  description: "Pre-trade strategy gate for BNB ecosystem tokens with custody-free risk controls.",
  inputSchema: cmcSkillManifest.inputSchema,
  outputSchema: cmcSkillResponseSchema,
  permissions: cmcSkillManifest.permissions,
  execute: runCmcSkill,
};
