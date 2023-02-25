import * as AWS from "aws-sdk";
// const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from "aws-sdk/clients/dynamodb";

// const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from "../models/TodoItem";
import { DeleteTodoRequest } from "../requests/DeleteItemRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly TODOS_CREATED_AT_INDEX = process.env.TODOS_CREATED_AT_INDEX
  ) {}

  async getUserTodos(userId: string): Promise<TodoItem[]> {
    console.log("Getting all groups");

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName : this.TODOS_CREATED_AT_INDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
      })
      .promise();

    const items = result.Items;
    return items as TodoItem[];
  }

  async createTodo(newItem: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: newItem,
      })
      .promise();

    return newItem;
  }

  async deleteTodo(key: DeleteTodoRequest): Promise<DeleteTodoRequest> {
    try {
      await this.docClient
        .delete({
          TableName: this.todosTable,
          Key: key,
        })
        .promise();
    } catch (error) {
      console.log("Error deleting Todo", error);
    }

    return key;
  }

  async updateTodo(
    updatedTodo: UpdateTodoRequest,
    key: DeleteTodoRequest
  ): Promise<Partial<TodoItem>> {

    try {

      const newTodo = {
        ":name": updatedTodo.name,
        ":dueDate": updatedTodo.dueDate,
        ":done": updatedTodo.done,
      };

      const params = {
        TableName: this.todosTable,
        Key: key,
        UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeNames: {
          "#name": ":name",
        },
        ExpressionAttributeValues: newTodo,
        ReturnValues: "ALL_NEW",
      };

      await this.docClient.update(params).promise();
      
    } catch (error) {
      console.log("Error deleting Todo", error);
    }

    return key;
  }
}

function createDynamoDBClient() {
  // if (process.env.IS_OFFLINE) {
  //   console.log('Creating a local DynamoDB instance')
  //   return new XAWS.DynamoDB.DocumentClient({
  //     region: 'localhost',
  //     endpoint: 'http://localhost:8000'
  //   })
  // }

  return new AWS.DynamoDB.DocumentClient();
}
