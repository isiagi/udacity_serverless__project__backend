import * as uuid from "uuid";
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { TodoAccess } from "../dataLayer/todoAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { DeleteTodoRequest } from "../requests/DeleteItemRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const XAWS = AWSXRay.captureAWS(AWS)

const TodoAccessService = new TodoAccess();

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export const getUserTodo = async (userId: string): Promise<TodoItem[]> => {

  return await TodoAccessService.getUserTodos(userId)
  
}

export const createTodo = async (
  CreateTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> => {
  const itemId = uuid.v4();

  return await TodoAccessService.createTodo({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    name: CreateTodoRequest.name,
    dueDate: CreateTodoRequest.dueDate,
    done: false,
    attachmentUrl: "",
  });
};

export const deleteTodo = async (DeleteTodoRequest: DeleteTodoRequest): Promise<DeleteTodoRequest> => {
  return await TodoAccessService.deleteTodo({
    todoId: DeleteTodoRequest.todoId,
    userId: DeleteTodoRequest.userId,
  });
};


export const updateTodo = async (key:DeleteTodoRequest, updateTodoRequest: UpdateTodoRequest):Promise<Partial<TodoItem>> => {
  const keys:DeleteTodoRequest = {
    todoId: key.todoId,
    userId: key.userId,
  }
  const updateBody = {
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  }
  return await TodoAccessService.updateTodo(updateBody, keys)

}

export const createAttachmentPresignedUrl = async function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}
