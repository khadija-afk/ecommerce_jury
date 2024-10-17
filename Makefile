

include .env.local
export $(shell sed 's/=.*//' .env.local)
    

clean_node_modules:
	rm -rf backend_ecommerce/backend_ecommerce/node_modules

build-custom-jenkins:
	docker build -t custom-jenkins . -f Dockerfile-jenkins 

test:
	npx jest

start-front:
	docker-compose up --build -d frontend

start-back-build: clean_node_modules build-backend-base
	docker-compose up --build -d backend

build-backend-base:
	@echo "Building base image from Dockerfile.base..."
	cd backend_ecommerce/backend_ecommerce/ &&\
	docker build -f Dockerfile.base -t backend_base:1.0.1 .

start-back: clean_node_modules build-backend-base
	docker-compose down backend
	docker-compose up  backend 

bl:
	docker-compose logs -f backend

start-j:
	docker-compose up --build -d jenkins

down-all:
	docker-compose down

baws:
	ssh -i "e-commerce.pem" ec2-user@ec2-13-53-198-233.eu-north-1.compute.amazonaws.com

start-all: down-all clean_node_modules build-backend-base
	docker-compose up --build -d

start-app: down-all clean_node_modules build-backend-base
	docker-compose up --build -d backend frontend db phpmyadmi

bb:
	@docker exec -it backend bash

bash-j:
	@docker exec -it jenkins bash

sequelize-migrate:
	@npx sequelize-cli db:migrate


