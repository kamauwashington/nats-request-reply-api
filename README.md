# Nats.io Request/Reply as ExpressJS REST API

> This repository is purely for reference and is illustrative in it is purpose. Please do not use in production as is, use this as a guide
or starting point for a production level implementation.


This project illustrates the use of [Nats.io](https://nats.io/) built in [Request/Reply streaming pattern](https://docs.nats.io/nats-concepts/core-nats/reqreply) within an [ExpressJS]() API. The goal behind this implementation is to showcase a loosely coupled pub-sub Rest API pattern, wherein the implementation of an API request is handled by
a subscriber.

This pattern is useful in many ways, but there are a few freebies from this implementation :
* Any programming language can use Nats.io API to initiate Request/Response directly with Nats.io bypassing HTTP entirely
* The API can be written in NodeJS|Go|Python|Java|.NET Core, and the Subscriber can be written in NodeJS|Go|Python|Java|.NET Core
* The subscriber can be swapped out and or A|B tested
* The Nats Subject can be subscribed to by (n) additional subscribers, for activities like logging, direct push to a DataLake, and so on.

> What will be seen in this example is a stock ticker being published to a Nats Subject, and Alpha Vantage Daily Adjusted API replying to the request token asynchronously.

## Prerequisites

Before you continue, ensure you have met the following requirements:

* [Nats Server](https://docs.nats.io/running-a-nats-service/introduction/installation#downloading-a-release-build) or [Nats Docker Server](https://hub.docker.com/_/nats) installed and running
    * If installing the Go Server, [Go](https://go.dev/doc/install) must be installed
* NodeJS v18 or higher installed
* Npm installed
* Get a free [AlphaVantage](https://www.alphavantage.co/support/#api-key) key!

## Environment Variables

This repository uses dotenv, feel free to create a .env file to set the ALPHA_VANTAGE_KEY, or override other aspects of the program.

* ALPHA_VANTAGE_KEY : The API Key provided by Alpha Vantage (defaults to **no-key**)
* PORT : The port the express server should run on (defaults to **3000**)
* SUBJECT : The Nats subject the Request/Reply will be issued on (defaults to **stock.request**)
* NATS_SERVER : The Nats server that will be facilitating Pub-Sub (defaults to  **localhost**)

## Running the Application

1) 'cd' to the root of this repository (where it was cloned)
1) Create a file in the root named **.env**
    * Add the AlphaVantage key in this file as follows : **ALPHA_VANTAGE_KEY=< insert key here >**
1) run **npm install** from the command line
1) open a terminal to the root of this repository and run :
    * **npm run daily-adjusted-subscription**
    * _allow the subscription a few additional seconds to bind, 503 errors may be experienced during this binding time_
1) open a second terminal to the root of this repository and run :
    * **npm run api**
1) open Postman or a browser and execute a GET request to : 
    * **http://localhost:3000/stock-info?symbol=AAPL**
    * The symbol can be changed to get different results
        * Try MSFT, IBM, CRM, GOEV, AVAV, TJX, CRM, V



## Notes
* Notice that the API has no prior knowledge as to what the subscriber is going to provide
* Validation can be put in place or a canonical can be used to ensure correctness of the reply
* This repository is heavily commented to provide context as to what and why, if in VS Code feel free to collapse all comments if they are obtrusive
    * On Mac -> Press <kbd>&#8984;</kbd> + <kbd>K</kbd> then <kbd>&#8984;</kbd> + <kbd>/</kbd> 
    * On Windows & Linux -> Press <kbd>Ctrl</kbd> + <kbd>K</kbd> then <kbd>Ctrl</kbd> + <kbd>/</kbd> 