import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'

export const handler:APIGatewayProxyHandler = async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event);

  let parsedBody:CreateTodoRequest;

  try {
    parsedBody = JSON.parse(event.body);
  } catch (error) {
    console.log("Error parsing event body: ", error);
  }

  await createTodo(parsedBody, "04");

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      parsedBody,
    }),
  };
};
