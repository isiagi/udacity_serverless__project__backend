import * as uuid from "uuid";

import { TodoAccess } from "../dataLayer/todoAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { DeleteTodoRequest } from "../requests/DeleteItemRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const TodoAccessService = new TodoAccess();

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
