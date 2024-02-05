"use strict";

import hashProvider from "./hashesInterface.js";
import SquaresRNG from "./squaresInterface.js";

(async function () {
// Get target issue
if (!Deno.args[0]) {
	console.error(`Issue not provided!`);
	Deno.exit(1);
};
let issueDirStat, workDir;
try {
	issueDirStat = await Deno.stat(`./data/${Deno.args[0]}`);
} catch (err) {
	console.error(`Issue read error!\n  ${err.stack.replaceAll(`file://${Deno.cwd()}`, "@app")}`);
};
if (!issueDirStat.isDirectory) {
	console.error(`Issue is not a directory.`);
	Deno.exit(1);
};
workDir = `./data/${Deno.args[0]}`;

// Calculate issue hash
let seed = hashProvider(await Deno.readTextFile(`${workDir}/seed.txt`));
console.info(`Seed of issue ${Deno.args[0]}: 0x${seed.toString(16).padStart(32, "0")}`);

// Read the issue data

// Grouped sort against issue data

// Emit results to console in TSV

// Emit results to file in MD

})();