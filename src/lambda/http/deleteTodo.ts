import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";

import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'


export const handler = middy(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event);

  const todoId = event.pathParameters.todoId;

  const userId = getUserId(event)

  const key = {
    todoId: todoId,
    userId,
  };

  // console.log("Removing item with key: ", key);
  await deleteTodo(key)


  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: " ",
  };
})

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);