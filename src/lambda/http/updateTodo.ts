import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { getUserId } from '../utils'

import { updateTodo } from '../../businessLogic/todos'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    const todoId = event.pathParameters.todoId;

    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

    const userId = getUserId(event)

    const key = {
      todoId: todoId,
      userId,
    };

    const newTodo = {
      name: updatedTodo.name,
      dueDate: updatedTodo.dueDate,
      done: updatedTodo.done
    }

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    await updateTodo(key, newTodo)

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: " ",
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
