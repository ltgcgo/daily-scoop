"use strict";

// Doesn't work...

import {Loaf} from "../../libs/bread/bread.mjs";

let utf8Dec = new TextDecoder("utf-8");
let ovm43 = Loaf.use("ovm43");
let randomBufferSource = new Uint8Array(18),
randomBufferTarget = new Uint8Array(24);

let getRandomId = () => {
	crypto.getRandomValues(randomBufferSource);
	ovm43.encodeBytes(randomBufferSource, randomBufferTarget);
	return utf8Dec.decode(randomBufferTarget);
};

let internalToken = Symbol("Polak is cute");

let LinkedNode = class {
	#head; // The first element
	#tail; // The last element
	#prev; // Previous element
	#next; // Next element
	#host; // The host list
	get head() {
		return this.#head;
	};
	get tail() {
		return this.#tail;
	};
	get prev() {
		return this.#prev;
	};
	get next() {
		return this.#next;
	};
	get host() {
		return this.#host;
	};
	setPrev(node, token) {
		if (token != internalToken) {
			throw(new Error("Used illegal internal method"));
		};
		this.#prev = node;
	};
	setNext(node, token) {
		if (token != internalToken) {
			throw(new Error("Used illegal internal method"));
		};
		this.#next = node;
	};
	setHead(node, token) {
		if (token != internalToken) {
			throw(new Error("Used illegal internal method"));
		};
		this.#head = node;
	};
	setTail(node, token) {
		if (token != internalToken) {
			throw(new Error("Used illegal internal method"));
		};
		this.#tail = node;
	};
	setHost(host, token) {
		if (token != internalToken) {
			throw(new Error("Used illegal internal method"));
		};
		this.#host = host;
	};
	#id;
	get id() {
		return this.#id;
	};
	data;
	prepend(data) {
		// Add a node before this
		let targetNode = new LinkedNode(data);
		targetNode.setNext(this, internalToken);
		targetNode.setTail(this.#tail, internalToken);
		if (this.#prev) {
			this.#prev.setNext(targetNode, internalToken);
			targetNode.setPrev(this.#prev, internalToken);
			targetNode.setHead(this.#head, internalToken);
		} else if (this.#head == this) {
			this.#head = targetNode;
		};
		this.#prev = targetNode;
		return targetNode;
	};
	append(data) {
		// Add a node after this
		let targetNode = new LinkedNode(data);
		targetNode.setPrev(this, internalToken);
		targetNode.setHead(this.#head, internalToken);
		if (this.#next) {
			this.#next.setPrev(targetNode, internalToken);
			targetNode.setNext(this.#next, internalToken);
			targetNode.setTail(this.#tail, internalToken);
		} else if (this.#tail == this) {
			this.#tail = targetNode;
		};
		this.#next = targetNode;
		return targetNode;
	};
	unshift(data) {
		return this.#head.prepend(data);
	};
	push(data) {
		return this.#tail.append(data);
	};
	delete() {
		this.#prev.setNext(this.#next, internalToken);
		this.#next.setPrev(this.#prev, internalToken);
		if (this.#head = this) {
			if (this.#next) {
				this.#next.setHead(this.#next, internalToken);
				this.#host.setRoot(this.#next, internalToken);
			} else {
				this.#host.setRoot(null, internalToken);
			};
		};
		if (this.#tail = this) {
			if (this.#prev) {
				this.#prev.setTail(this.#prev, internalToken);
			};
		};
	};
	forEach(handler) {
		let target = this;
		handler(target.data, target.id, this.#host);
		while (target != this.#tail) {
			target = target.next;
			handler(target.data, target.id, this.#host);
		};
	};
	forEachRev(handler) {
		let target = this;
		handler(target.data, target.id, this.#host);
		while (target != this.#head) {
			target = target.prev;
			handler(target.data, target.id, this.#host);
		};
	};
	async awaitEach(handler) {
		let target = this;
		handler(target.data, target.id, this.#host);
		while (target != this.#tail) {
			target = target.next;
			await handler(target.data, target.id, this.#host);
		};
	};
	async awaitEachRev(handler) {
		let target = this;
		handler(target.data, target.id, this.#host);
		while (target != this.#head) {
			target = target.prev;
			await handler(target.data, target.id, this.#host);
		};
	};
	constructor(data, internalArgs) {
		this.data = data;
		this.#id = getRandomId();
		this.#head = this;
		this.#tail = this;
	};
};
let LinkedList = class {
	#root; // The first element
	//#view; // The current view
	get root() {
		return this.#root;
	};
	setRoot(root, token) {
		if (token != internalToken) {
			throw(new Error("Used illegal internal method"));
		};
		this.#root = root;
	};
	unshift(data) {
		this.#root.unshift(data);
	};
	push(data) {
		this.#root.push(data);
	};
	forEach(handler) {
		this.#root.forEach(handler);
	};
	forEachRev(handler) {
		this.#root.tail.forEachRev(handler);
	};
	async awaitEach(handler) {
		await this.#root.awaitEach(handler);
	};
	async awaitEachRev(handler) {
		await this.#root.tail.awaitEachRev(handler);
	};
	constructor(data) {
		this.#root = new LinkedNode(data);
		this.#root.setHost(this, internalToken);
	};
};

export {
	LinkedList,
	LinkedNode
};
