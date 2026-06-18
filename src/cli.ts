import { runSimulation } from "./core/simulation.js";
import { sampleScenarios } from "./data/scenarios.js";

const report = runSimulation(sampleScenarios);

console.log("Risk-Gated Narrative Alpha Skill");
console.log("BNB Hack Track 2 Strategy Skill demo");
console.log("");
console.log("Summary");
console.log(JSON.stringify(report.summary, null, 2));
console.log("");
console.log("Agent-readable decisions");

for (const row of report.rows) {
  console.log(`\n[${row.id}] ${row.label}`);
  console.log(JSON.stringify(row.decision.agentOutput, null, 2));
  console.log(`Outcome: ${row.simulationOutcome.label} (${row.simulationOutcome.estimatedReturnPct}%)`);
}
