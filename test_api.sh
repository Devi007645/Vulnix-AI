#!/bin/bash
source ~/.nvm/nvm.sh
cd /home/dell/projects/Vulnix-AI
# Kill any existing node processes
pkill node || true
# Start server
./node_modules/.bin/tsx src/server/index.ts > test_run.log 2>&1 &
PID=$!
echo "Waiting for server to start..."
sleep 15
echo "Sending request..."
curl -X POST http://localhost:3000/api/scans/ -H "Content-Type: application/json" -d '{"target": "scanme.nmap.org"}'
echo -e "\nServer logs:"
cat test_run.log
kill $PID
