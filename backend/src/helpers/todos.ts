import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

const todosAccess = new TodosAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  return await todosAccess.getTodosForUser(userId)
}

export async function createTodo(userId: string, newTodo: CreateTodoRequest): Promise<TodoItem> {
  const itemId = uuid.v4()
  const todoItem: TodoItem = {
    todoId: itemId,
    userId,
    createdAt: new Date().toISOString(),
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false,
    attachmentUrl: null
  }
  return await todosAccess.createTodoItem(todoItem);
}

export async function updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
  await todosAccess.updateTodoItem(userId, todoId, updatedTodo);
}

export async function deleteTodo(userId: string, todoId: string) {
  await todosAccess.deleteTodoItem(userId, todoId);
}