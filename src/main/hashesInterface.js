"use strict";

import jsSHA3 from "../../libs/jsSHA/sha3.js";

let mixDown = (buffer, wider = false) => {
	let bufView = new Uint16Array(buffer); // Hashed output
	let components = new Uint16Array(4); // 32-bit input
	let resultView = new Uint32Array(components.buffer); // ui32 output
	if (wider) {
		bufView.forEach((e, i) => {
			// Little-endian 48-bit
			components[i % 3] ^= e; // Continuous XOR operations
		});
		return components[0] + components[1] * 65536 + components[2] * 0x100000000;
	} else {
		bufView.forEach((e, i) => {
			// Little-endian 32-bit
			components[i & 1] ^= e; // Continuous XOR operations
		});
		return resultView[0];
	};
};

let hashProvider = (input, wider = false) => {
	let hashHost = new jsSHA3(`SHA3-384`, `TEXT`, {
		"encoding": "UTF8"
	});
	hashHost.update(input);
	return mixDown(hashHost.getHash("ARRAYBUFFER"), wider);
};

export default hashProvider;