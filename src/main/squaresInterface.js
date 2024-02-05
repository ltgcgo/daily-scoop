"use strict";

import {
	squares,
	squares4
} from "../../libs/squares-wasm/squares-rng.js";

let SquaresRNG = {};
SquaresRNG.ui32 = (x) => {
	return squares4(x);
};
SquaresRNG.ui32_5 = (x) => {
	return squares(x);
};
SquaresRNG.f64 = (x) => {
	return squares(x) / 4294967296;
};

export default SquaresRNG;