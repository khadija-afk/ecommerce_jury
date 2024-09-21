
OPS= --silent --verbose
COV= $(OPS) --coverage

test:
	NODE_ENV=test npx jest $(OPS)

test-cov:
	NODE_ENV=test npx jest $(COV)

sequelize-migrate:
	@npx sequelize-cli db:migrate

.PHONY: test

