"use strict";

import hashProvider from "./hashesInterface.js";
import SquaresRNG from "./squaresInterface.js";
import tsvObject from "./tsvReader.js";

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
console.info(`Seed of issue ${Deno.args[0]}: 0x${seed.toString(16).padStart(8, "0")}`);
let ptr = 0;

// Read the issue data
let grouped = {}, groups = new Set();
tsvObject(await Deno.readTextFile(`${workDir}/artwork.tsv`)).forEach((e) => {
	let vote = parseInt(e.vote || -1);
	groups.add(vote);
	grouped[vote] = grouped[vote] || [];
	grouped[vote].push({
		source: e.source
	});
});

// Grouped sort against issue data
let sortedGroups = Array.from(groups);
sortedGroups.forEach((vote) => {
	grouped[vote].forEach((source) => {
		source.hash = hashProvider(source.source, true);
		//console.debug(`0x${source.hash.toString(16).padStart(12,"0")}: ${source.source}`);
	});
	grouped[vote].sort((a, b) => {
		return a.hash - b.hash;
	});
});
sortedGroups.sort((a, b) => {
	return b - a;
});
let sortedGrouped = {};
sortedGroups.forEach((e) => {
	sortedGrouped[e] = [];
});
sortedGroups.forEach((e0) => {
	let workGroup = grouped[e0];
	while (workGroup.length) {
		let rngResult = SquaresRNG.f64(seed + ptr);
		let emitIndex = Math.floor(rngResult * workGroup.length);
		//console.debug(`len: ${workGroup.length}, ptr: ${ptr}, idx: ${emitIndex}, rng: ${rngResult}`);
		sortedGrouped[e0].push(workGroup.splice(emitIndex, 1)[0]);
		ptr ++;
	};
});

// Emit results
let tsvFile = `vote\tsource`;
console.info(`\nMarkdown of this issue:\n`);
sortedGroups.forEach((vote) => {
	sortedGrouped[vote].forEach((source) => {
		// To file in TSV
		tsvFile += `\n${vote}\t${source.source}`;
		// To console in MD
		console.info(`* ![]() [source](${source.source})`);
	});
});
await Deno.writeTextFile(`${workDir}/orderedArt.tsv`, tsvFile);

})();