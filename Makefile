
build-custom-jenkins:
	docker build -t custom-jenkins . -f Dockerfile-jenkins 

test:
	npx jest

start-front:
	docker-compose up --build -d frontend

start-back:
	docker-compose up --build -d backend

start-j:
	docker-compose up --build -d jenkins

start-all:
	docker-compose up --build

bash-b:
	@docker exec -it backend bash

bash-j:
	@docker exec -it jenkins bash

sequelize-migrate:
	@npx sequelize-cli db:migrate