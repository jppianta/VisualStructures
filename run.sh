#!/bin/bash          
echo Compiling Grammar
nearleyc ./grammar/test.ne -o ./grammar/test.js
echo Running Parser
node index.js