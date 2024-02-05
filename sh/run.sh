#!/bin/bash
if [ ! -f "./dist/main.js" ]; then
	shx build
fi
deno run --allow-read --allow-write ./dist/main.js "$@"
exit