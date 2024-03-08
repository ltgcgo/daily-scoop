"use strict";

import TextEmitter from "../../libs/rochelle/textEmit.mjs";

let uDec = new TextDecoder("utf-8", {fatal: true});
let instance = Deno.env.get("INSTANCE");
let token = Deno.env.get("TOKEN");

let sse = await fetch(`https://${instance}/api/v1/streaming/user`, {
	"headers": {
		"Accept": "text/event-stream",
		"Authorization": `Bearer ${token}`
	}
});
if (sse.status != 200) {
	console.debug(await sse.text());
} else {
	console.debug(`SSE connected.`);
	let lineFeed = new TextEmitter(sse.body);
	lineFeed.addEventListener("chunk", () => {
		console.debug(`SSE received raw chunk.`);
	});
	lineFeed.addEventListener("raw", () => {
		console.debug(`SSE received raw line.`);
	});
	lineFeed.addEventListener("fail", console.debug);
	lineFeed.addEventListener("error", console.debug);
	lineFeed.addEventListener("text", ({data}) => {
		console.debug(data);
	});
	lineFeed.addEventListener("close", () => {
		console.debug(`SSE closed.`);
	});
};