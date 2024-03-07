"use strict";

let ServerEvent = class extends EventTarget {
	// Read-only section
	#readyState = 0;
	#url = "";
	#withCredentials = false;
	get readyState() {
		return this.#readyState;
	};
	get url() {
		return this.#url;
	};
	get withCredentials() {
		return this.#withCredentials;
	};
	// Private section
	#wit
	// Customizable section
	headers = {};
};

export default ServerEvent;