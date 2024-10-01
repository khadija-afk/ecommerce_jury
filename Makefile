


clean_node_modules:
	@rm -rf backend_ecommerce/backend_ecommerce/node_modules

build-custom-jenkins:
	docker build -t custom-jenkins . -f Dockerfile-jenkins 

test:
	npx jest

start-front:
	docker-compose up --build -d frontend

start-back: clean_node_modules
	docker-compose up --build -d backend

start-j:
	docker-compose up --build -d jenkins

down-all:
	docker-compose down

start-all: down-all clean_node_modules
	docker-compose up --build -d

bash-b:
	@docker exec -it backend bash

bash-j:
	@docker exec -it jenkins bash

sequelize-migrate:
	@npx sequelize-cli db:migrate


