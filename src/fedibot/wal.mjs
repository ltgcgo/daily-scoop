"use strict";

// Performace could be improved with sorted arrays or a flat-out linked list.

import TextEmitter from "../../libs/twinkle/miniSignal.mjs";
import {Loaf} from "../../libs/bread/bread.mjs";
//import {LinkedList} from "./linkedList.mjs";

let utf8Enc = new TextEncoder(),
utf8Dec = new TextDecoder("utf-8");
let ovm43 = Loaf.use("ovm43"); // This is not Base64, but an encoding scheme inspired by KORG 7 over 8, just fyi. Even faster than Quick Base 64!
let randomBufferSource = new Uint8Array(18),
randomBufferTarget = new Uint8Array(24);

let getRandomId = () => {
	crypto.getRandomValues(randomBufferSource);
	ovm43.encodeBytes(randomBufferSource, randomBufferTarget);
	return utf8Dec.decode(randomBufferTarget);
};

let WALTask = class {
	id;
	data;
	constructor(id, data) {
		this.id = id;
		this.data = data;
	};
};

let WALHandler = class extends EventTarget {
	source; // ReadableStream for a file
	sink; // WritableStream for a file
	#queue = []; // Should be a linked list in other programming languages, built in reverse
	#markQueue(task) {
		//
	};
	#markResolve(id, queueIndex) {
		//
	};
	async play(handler){
		//
	};
	constructor() {
		super();
	};
};

export default WALHandler;
