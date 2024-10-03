## Description


## Installation Guide

1. Clone the repository:

    ```bash
    git clone https://github.com/edexy/poixel-api-service.git

2. Change to the project directory:
    ```bash
    cd poixel-api-service

3. Install project dependencies:
    ```bash
    yarn install

4. Create a `.env` file in the project root with the following environment variables:
    ```dotenv
    # Server
    NODE_ENV=dev

    # JWT Token
    JWT_SECRET=any-random-string

    # Database
    DATABASE_NAME=poixel.sqlite

5. Run migration
   ```bash
   yarn migrate


## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```
## Usage
-Swagger Documentation

http://localhost:3090/docs

## Test

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

## Routes
- {/v1/api/auth/register, POST}:  Register a user
- {/v1/api/auth/login, POST}:  User login
- {/v1/api/auth/admin, POST}: Create admin user

- {/v1/api/ping, GET}: health check
- {/v1/api/admin/users, GET}:  list of all user
- {/v1/api/admin/users/:userId, PUT}: Update user details
- {/v1/api/admin/users/:userId, DELETE}:  Delete User