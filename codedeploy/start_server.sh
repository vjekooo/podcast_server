#!/bin/bash
# Start up the server

cd /home/ubuntu/podcast/server

docker-compose up -d --build

docker rmi $(docker images -q -f dangling=true)