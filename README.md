# Nora AI Assistant - Backend

A backend for the Nora AI assistant based on OpenAI APIs.

This backend has the fllowing utilities:
- NestJS
- TypeScript
- ESLint
- Prettier
- Morgan
- Jest
- Postman Docs
- Husky Pre-Commit
- Makefile
- Docker
- Docker Compose
- OpenAI

## Prerequisites

The following dependencies are required:
- Node ^21.0.0
- NPM ^10.2.0

The following dependencies are optional, but are still very convenient:
- Docker ^24.0.6
- Docker Compose ^2.22.0
- GNU Make ^3.81

## Configuration

This service can be configured by a .env file. Run the following command:

```bash
cp env_example .env
```
to copy the env_example content into the .env file, then modify the environment variables. 

The env_example has the following env vars:
- `LISTENING_PORT` (required): the listening port of the service. For example, `3001`, or `8081`. It's required.
- `AUTH_API_KEY_HEADER_NAME` (required): the header name of the request that contains the API Key. For example, `x-api-key`. It's required.
- `AUTH_API_KEY_VALUE` (required): the value of the API Key. It is strongly recommended to use a number of characters >= 32 and keep the value as complex as possible, even if difficult to remember. It's required.
- `OPEN_AI_API_KEY` (required): the API Key used to communicate with the OpenAI APIs. You must have an OpenAI accoun with a project and an API Key already created.
- `OPEN_AI_MODEL` (required): the model used to communicate with the OpenAI APIs, like `gpt-4o-mini`, or `gpt-4o`.
- `DOCKER_CONTAINER_NAME` (optional, but required for docker only): the container name, like `nora-backend`. It's useful to run the dockerized service.
- `DOCKER_IMAGE_NAME` (optional, but required for docker only): the container name, like `nora-backend`. It's useful to run the dockerized service.
- `DOCKER_PORT` (optional, but required for docker only): the listening port of the dockerized service, like `8081`, or `8088`. It's useful to run the dockerized service.

## Preparation

This service uses an Husky pre-commit. The pre-commit executes a code linting and test coverage before each commit.

Install Husky with the following  command:
```bash
npm run prepare
```

Sometimes you might even need to recreate the pre-commit Husky from scratch... don't worry, this is the right command:
```bash
npx husky add .husky/pre-commit "npm run lint && npm run test:cov"
```

## Installing

```bash
npm install
# or
npm i
```

## Running (without Docker)

```bash
# development
npm run start

# watch mode
npm run start:dev

# debug mode
npm run start:debug

# prod mode
npm run start:prod # after the npm run build command
```

## Running (with Docker)

Build the docker image with the following command:

```bash
docker build -t ${DOCKER_IMAGE_NAME} .
# or
make docker-build
```

Then, run the dockerized service:

```bash
docker-compose up -d
# or
make docker-up
```

To stop the dockerized service, run one of the following two commands:

```bash
docker-compose down
# or
make docker-down
```

## Unit Tests

```bash
# unit tests
npm run test

# unit tests (watch mode)
npm run test:watch

# test coverage
npm run test:cov
```

## Code Linting

```bash
npm run lint
```

## Code Formatting

```bash
npm run format
```

## Inspect the dockerized service
See container logs:
```bash
docker-compose logs -f ${DOCKER_IMAGE_NAME} --tail=50
# or
make docker-logs
```

## Cleaning
To clear build and test coverage files, run:
```bash
rm -rf coverage/
rm -rf dist

# or
make clean
```

## Contacts

Don't hesitate to contact me for any info, bugs, or improvements! Below are my contacts:
- [GitHub](https://github.com/chralex00)
- [Email](mailto:christian.alessandro.atzeni.00@outlook.com)