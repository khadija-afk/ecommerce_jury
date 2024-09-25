

ENV_TEST=NODE_ENV=test TOKEN=fake-test-token
OPS= --silent --verbose
COV= $(OPS) --coverage

test:
	$(ENV_TEST) npx jest $(OPS) $(filter-out $@,$(MAKECMDGOALS))  

test-cov:
	$(ENV_TEST) npx jest $(COV)

sequelize-migrate:
	@npx sequelize-cli db:migrate

# Cette ligne permet de gérer des arguments comme 'make test user'
%:
	@:

.PHONY: test

