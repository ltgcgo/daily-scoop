#!/bin/bash
args=( "$@" )
deno run --allow-read --allow-write --allow-net dist/main.js ${args[@]}
exit