# Serverless - Isiagi Geofrey Udacity Project Todo-Api

This project was generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.16.0.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `auth` - containing JWT Interfaces and Get User from token function
- `businessLogic` - containing shared code base calling different methods which talk to other service in this case Dynamodb service ***data store***
- `dataLayer` - containing a ***Class*** with differnt methods performing actions to DynamoDB
- `lambda` - containing **auth** folder, **http** and a **utils** file. Each file discussed below.
- `auth` - containing the authorization service of the app with ***Auth0-Jwks url***
- `http` - containing the differnt lambda functions performing the CRUD operation of the app.
- `utils` - containing util function to get ***userId*** from the authorization Token
## Outside of the Lambda Folder
- `models` and `requests` folder - containing Interfaces
- `utils` folder - contain a file have a function used for logging instead of using ***console.log()***


### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file
- [jwks-rsa]
- [jsonwebtoken]
- [uuid]
- [winston]
- [aws-xray-sdk]
- [serverless-iam-roles-per-function]
- [serverless-reqvalidator-plugin]
- [serverless-aws-documentation]

> ## Note: 
The code works best when deploy and when used local, some Configurations might be necessary.
