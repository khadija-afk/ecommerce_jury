

start-front:
	docker-compose up --build -d frontend

start-back:
	docker-compose up --build -d backend

start-all:
	docker-compose up --build

bash-backend:
	@docker exec -it backend bash
sequelize-migrate:
	@npx sequelize-cli db:migrate