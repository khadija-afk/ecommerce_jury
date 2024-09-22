

ENV_TEST=NODE_ENV=test TOKEN=fake-test-token SECRET_KEY=fake-test-secret-key
OPS= --silent --verbose
COV= $(OPS) --coverage

test:
	$(ENV_TEST) npx jest $(OPS)

test-cov:
	$(ENV_TEST) npx jest $(COV)

sequelize-migrate:
	@npx sequelize-cli db:migrate

.PHONY: test

