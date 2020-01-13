#!/bin/bash
# Start up the web server.

cd /home/ubuntu/podcast/server

file="/docker-compose.yaml"
if [ -f "$file" ]
then
    docker-compose down
fi