"use strict";

import ServerEvents from "../../libs/eclipsed/client.mjs";
import {SmallBot} from "../../libs/small-bot-matrix/mod.ts";

const instance = Deno.env.get("INSTANCE");
const token = Deno.env.get("MASTO_TOKEN");
const mxToken = Deno.env.get("MX_TOKEN");
const mxRoom = Deno.env.get("MX_ROOM");

console.info(`The bot will send messages to this room: ${mxRoom}`);

// Matrix integration
/*
console.info(`Logging in into the Matrix account...`);
let mxClient = new SmallBot({
	"accessToken": mxToken
});
await mxClient.start();
await mxClient.sendMessage(mxRoom, "m.text", `Daily Scoop has successfully logged in into this Matrix account! Will connect to Mastodon soon.`);
console.info(`Logged in into the Matrix account.`);
*/

// Mastodon integration
console.info(`Connecting to Mastodon...`);
let sseClient = new ServerEvents(`https://${instance}/api/v1/streaming/user`, {
	"headers": {
		"Authorization": `Bearer ${token}`
	}
});
sseClient.addEventListener("connecting", () => {
	console.debug(`Client connecting...`);
});
sseClient.addEventListener("open", async () => {
	console.debug(`Client connected.`);
	//await mxClient.sendMessage(mxRoom, "m.text", `Daily Scoop has successfully logged into Mastodon! Now listening for mentions.`);
});
sseClient.addEventListener("disconnect", () => {
	console.debug(`Client disconnected.`);
});
sseClient.addEventListener("close", () => {
	console.debug(`Client closed.`);
});
sseClient.addEventListener("notification", async ({data}) => {
	let post = JSON.parse(data);
	if (post.type != "mention") {
		console.info(`Post was not a mention: ${post?.status?.url} (${post.id})`);
		return;
	};
	let botNotMentioned = true;
	if (post.status.mentions) {
		// The bot is not yet "self-aware"...
		botNotMentioned = false;
	} else {
		console.info(`Post didn't contain a mention: ${post.status.url}`);
		return;
	};
	if (botNotMentioned) {
		console.info(`Post didn't mention the bot: ${post.status.url}`);
		return;
	};
	let tagNotAttached = true;
	if (post.status.tags) {
		post.status.tags.forEach(({name}) => {
			if (name.toLowerCase() == "weeklypony") {
				tagNotAttached = false;
			};
		});
	};
	if (tagNotAttached) {
		console.info(`Post didn't attach an appropriate tag: ${post.status.url}`);
		return;
	};
	let target = post;
	if (!post.status.media_attachments?.length) {
		// The post may not be a submission itself
		console.info(`Post didn't offer attachments, so trying to trace up: ${post.status.url}`);
		if (post.status.in_reply_to_id) {
			try {
				let targetRaw = await (await fetch (`https://${instance}/api/v1/statuses/${post.status.in_reply_to_id}`, {
					"headers": {
						"Authorization": `Bearer ${token}`
					}
				})).json();
				target = {
					"account": targetRaw.account,
					"status": targetRaw
				}
			} catch (err) {
				console.info(`Tracing failed: ${post.status.url}`);
			};
		} else {
			console.info(`No replies, falling back: ${post.status.url}`);
		};
	};
	console.debug(`Submitted:  ${target.status.url}`);
	console.debug(`Submission: ${post.status.url}`);
	try {
		await fetch(`https://${instance}/api/v1/statuses/${target.status.id}/reblog`, {
			"method": `POST`,
			"headers": {
				"Authorization": `Bearer ${token}`
			}
		});
	} catch (err) {
		console.debug(`Boosting failed: ${target.status.url}`);
	};
	//console.info(`[${post.account.display_name}](${post.account.url}) (\`@${post.account.acct}\`) submitted an entry from [${target.account.display_name}](${target.account.url}) (\`@${target.account.acct}\`)!\nView: ${target.status.url}`);
});
