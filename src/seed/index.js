"use strict";

let uEnc = new TextEncoder();
let map = uEnc.encode("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_");
let length = Math.ceil(384 / 6);
let randomSource = new Uint8Array(length);
let randomTarget = new Uint8Array(length);

crypto.getRandomValues(randomSource);
for (let i = 0; i < length; i ++) {
	randomTarget[i] = map[randomSource[i] & 63];
};
Deno.stdout.write(randomTarget);