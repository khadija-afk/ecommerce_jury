

ENV_TEST=NODE_ENV=test TOKEN=fake-test-token NODE_PATH=$(shell pwd)
OPS= --silent --verbose
COV= $(OPS) --coverage


test:
	$(ENV_TEST) npx jest $(OPS) $(filter-out $@,$(MAKECMDGOALS))  

test-cov:
	$(ENV_TEST) npx jest $(COV)

bdd:
	NODE_ENV=test NODE_PATH=/app npx cucumber-js

sequelize-migrate:
	@npx sequelize-cli db:migrate

# Cette ligne permet de gérer des arguments comme 'make test user'
%:
	@:

lint:
	npx eslint controllers

format:
	npx prettier --write controllers
	
.PHONY: test lint bdd

migration-name:
	npx sequelize-cli migration:generate --name <nom_de_la_migration>
migrate:
	npx sequelize-cli db:migrate


