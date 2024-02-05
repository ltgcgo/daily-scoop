"use strict";

import jsSHA3 from "../../libs/jsSHA/sha3.js";

let mixDown = (buffer) => {
	let bufView = new Uint16Array(buffer); // Hashed output
	let components = new Uint16Array(2); // 32-bit input
	let resultView = new Uint32Array(components.buffer); // ui32 output
	bufView.forEach((e, i) => {
		// Little-endian
		components[i & 1] ^= e; // Continuous XOR operations
	});
	return resultView[0];
};

let hashProvider = (input) => {
	let hashHost = new jsSHA3(`SHA3-384`, `TEXT`, {
		"encoding": "UTF8"
	});
	hashHost.update(input);
	return mixDown(hashHost.getHash("ARRAYBUFFER"));
};

export default hashProvider;