import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";

import { deleteTodo } from '../../businessLogic/todos'


export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event);

  const todoId = event.pathParameters.todoId;

  const key = {
    todoId: todoId,
    userId: "04",
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
};
