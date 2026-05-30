import { buildLogicPrompt } from "./logicPrompt.js";
import { testArguments } from "./testArguments.js";

for (const argument of testArguments) {
  console.log("\n==============================");
  console.log(argument.name);
  console.log("==============================");
  console.log(buildLogicPrompt(argument.text));
}