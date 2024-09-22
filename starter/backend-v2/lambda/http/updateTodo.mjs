import { createLogger } from '../../src/utils/logger.mjs'
import { updateTodoBusiness } from '../../src/businessLogic/todos.mjs'
import { getUserId } from '../../src/utils/todos.mjs'

const logger = createLogger('updateTodo')

export async function handler(event) {
  logger.info('Processing event: ', event)

  try {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)

    if (!todoId || !updatedTodo) {
      logger.error('Invalid input')
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'Invalid input' })
      }
    }

    await updateTodoBusiness(userId, todoId, updatedTodo)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Todo updated successfully' })
    }
  } catch (error) {
    logger.error('Error updating todo:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'Failed to update todo' })
    }
  }
}
