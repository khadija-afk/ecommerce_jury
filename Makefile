

include .env.local
export $(shell sed 's/=.*//' .env.local)


ifeq ($(ENV), DEV)
include .env.dev
export $(shell sed 's/=.*//' .env.dev)
else ifeq ($(ENV), PROD)
include .env.prod
export $(shell sed 's/=.*//' .env.prod)
endif

clean_node_modules:
	rm -rf backend_ecommerce/backend_ecommerce/node_modules

build-custom-jenkins:
	docker build -t custom-jenkins . -f Dockerfile-jenkins 

test:
	npx jest

start-nginx: down-all build-backend-base
	
	docker-compose up --build -d nginx

pull:
	git pull

deploy-prod: pull start-nginx

start-front:
	docker-compose up --build -d frontend

sz:
	docker-compose up --build zap

rf:
	docker-compose restart frontend

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

lf:
	docker-compose logs -f frontend
lz:
	docker-compose logs -f zap

start-j:
	docker-compose up --build -d jenkins

down-all:
	@echo "CORS_URL is $(CORS_URL)"
	@echo "VITE_CORS_URL is $(VITE_CORS_URL)"
	docker-compose down

baws:
	ssh -i "e-commerce.pem" ubuntu@ec2-16-16-64-7.eu-north-1.compute.amazonaws.com

start-all: down-all clean_node_modules build-backend-base
	docker-compose up --build -d

start-app: down-all clean_node_modules build-backend-base
	docker-compose up --build -d backend frontend db phpmyadmi

bb:
	@docker exec -it backend bash

bf:
	@docker exec -it frontend bash
bz:
	@docker exec -it zap bash


bash-j:
	@docker exec -it jenkins bash

openssl:
	mkdir ssl &&\
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/selfsigned.key -out ssl/selfsigned.crt -subj "/CN=localhost"

sequelize-migrate:
	@npx sequelize-cli db:migrate

.PHONY: pull start-nginx rf

