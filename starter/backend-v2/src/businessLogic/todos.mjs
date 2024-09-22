import { createTodo, getTodos, updateTodo, deleteTodo, generateUploadUrl } from '../dataLayer/todosAccess.mjs'

export async function createTodoBusiness(userId, newTodo) {
  return await createTodo(userId, newTodo)
}

export async function getTodosBusiness(userId) {
  return await getTodos(userId)
}

export async function updateTodoBusiness(userId, todoId, updatedTodo) {
  return await updateTodo(userId, todoId, updatedTodo)
}

export async function deleteTodoBusiness(userId, todoId) {
  return await deleteTodo(userId, todoId)
}

export async function generateUploadUrlBusiness(todoId) {
  return await generateUploadUrl(todoId)
}
