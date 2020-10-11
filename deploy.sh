aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 150363524457.dkr.ecr.eu-west-1.amazonaws.com

docker build -t podcast_server .

docker tag podcast_server:latest 150363524457.dkr.ecr.eu-west-1.amazonaws.com/podcast_server:latest

docker push 150363524457.dkr.ecr.eu-west-1.amazonaws.com/podcast_server:latest