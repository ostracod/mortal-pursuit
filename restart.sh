#!/bin/sh

echo "Restarting..."

pkill -f "node mortalPursuit.js"
sleep 1
NODE_ENV="production" nohup node mortalPursuit.js > serverMessages.txt 2>&1 &


