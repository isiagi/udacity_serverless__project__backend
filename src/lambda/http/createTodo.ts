import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { createTodo } from "../../businessLogic/todos";

import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { TodoItem } from "../../models/TodoItem";

import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("todoAccess");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing event: ", event);

    let parsedBody: CreateTodoRequest;

    try {
      parsedBody = JSON.parse(event.body);
    } catch (error) {
      logger.error("Error parsing event body: ", error);
    }

    if (parsedBody.name === "" || parsedBody.dueDate === "") {
      
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: "Todo fields can not be empty",
      };
    }

    const userId = getUserId(event);

    const result: TodoItem = await createTodo(parsedBody, userId);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        item: result,
      }),
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
