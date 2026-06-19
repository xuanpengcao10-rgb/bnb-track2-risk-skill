import { runSimulation } from "./core/simulation.js";
import { sampleScenarios } from "./data/scenarios.js";
import { runCmcSkill } from "./integrations/cmcSkill.js";

const report = runSimulation(sampleScenarios);

console.log("Risk-Gated Narrative Alpha Skill");
console.log("BNB Hack Track 2 Strategy Skill demo");
console.log("");
console.log("Summary");
console.log(JSON.stringify(report.summary, null, 2));
console.log("");
console.log("Baseline comparison");
console.log(JSON.stringify(report.baselineComparison, null, 2));
console.log("");
console.log("Agent/tool responses");

for (const row of report.rows) {
  console.log(`\n[${row.id}] ${row.label}`);
  console.log(JSON.stringify(runCmcSkill(row.input), null, 2));
  console.log(`Outcome: ${row.simulationOutcome.label} (${row.simulationOutcome.estimatedReturnPct}%)`);
}
