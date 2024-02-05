"use strict";

let tsvObject = (tsv) => {
	tsv = tsv.split("\n");
	tsv.forEach((e, i, a) => {
		a[i] = e.split("\t");
	});
	let attrs = [],
	outArr = [];
	tsv.forEach((e0, i0) => {
		e0.forEach((e1, i1) => {
			if (i0) {
				outArr[i0 - 1] = outArr[i0 - 1] || {};
				if (attrs[i1] && e1.length) {
					outArr[i0 - 1][attrs[i1]] = e1;
				};
			} else {
				attrs.push(e1);
			};
		});
	});
	return outArr;
};

export default tsvObject;