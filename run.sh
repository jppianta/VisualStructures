#!/bin/bash
echo Compiling Grammar
nearleyc ./grammar/grammar.ne -o ./grammar/grammar.js
echo Running Parser
node index.js