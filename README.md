
# Flights Weather APP

This project is a NestJS application designed to retrieve weather information for flights registered in a database. It leverages an external API to fetch current weather data for airports associated with the flights. To enhance performance and reduce API calls, the application utilizes Redis for caching the weather data, which is managed within a Docker container. This architecture allows for efficient data retrieval while ensuring that the application remains responsive and capable of handling high traffic. The app runs with an SQL Database with TypeORM.

For running this app you must have installed:
1. SQL Server
1. XAMPP or relative to your OS
1. Docker Engine

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contribution](#contribution)
- [License](#license)
- [Contact](#contact)

## Features

- [ /weather ] Find all the flights and the corresponding weather of the airports
- [ /weather/flight/:flightNum ] Find The weather of a specific Flight
- [ /flights ] Retrieve all the flights without weather

## Technologies Used

- [ NEST JS ](https://nestjs.com/)
- [ SQL ](https://dev.mysql.com/doc/)
- [ TYPE ORM ](https://typeorm.io/)
- [ TYPESCRIPT ](https://www.typescriptlang.org/)
- [ REDIS ](https://redis.io/es/)
- [ DOCKER ](https://www.docker.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nicolasbava/flights-weather-app
   cd your_repository

2. Start Docker Engine:
   open Docker Desktop so Docker Engine is running
   open a console in the project
   run docker-compose up
   it will run at port 6379

3. Start XAMPP server:
   open XAMPP
   start Apache service
   start MySQL service at port 3306

4. Install Project Dependencies
   at root project run "npm run install"

5. Run the APP
   in root of the project run "npm run start:dev" for dev environment


6. Run the Tests
   in root of the project run "npm run test"


## Resources

- 2023 How to use cache in NestJS with Redis: https://www.tomray.dev/nestjs-caching-redis
- NESTJS Docs: https://docs.nestjs.com/techniques/caching
- 2024 Implementing Caching in NestJS: Quick guide: https://medium.com/@citi_zen/implementing-caching-in-nestjs-quick-guide-2cfe50dd241d
- Free Weather API OPEN-METEO:  https://open-meteo.com/
- NESTJS Docs Rate Limiting: https://docs.nestjs.com/security/rate-limiting


## Routes

- {/, GET}: get Hello World

- {/weather, GET}: get all flights with weather combined 
- {/weather/flight/:id, GET}: get one flight with weather by flightNum

- {/flights, GET}: get all flights without weather
- {/flights/:id, GET}: get one flight without weather by id in database
- {/flights/flight/:id, GET}: get one flight by flightNum