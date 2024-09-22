import { createLogger } from '../../src/utils/logger.mjs'
import { createTodoBusiness } from '../../src/businessLogic/todos.mjs'
import { getUserId } from '../../src/utils/todos.mjs'

const logger = createLogger('createTodo')

export async function handler(event) {
  logger.info('Processing event: ', event)

  try {
    const userId = getUserId(event)
    const newTodo = JSON.parse(event.body)

    if (!newTodo || !newTodo.name) {
      logger.error('Invalid input for new todo')
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'Invalid input' })
      }
    }

    const item = await createTodoBusiness(userId, newTodo)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ item })
    }
  } catch (error) {
    logger.error('Error creating todo:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'Failed to create todo' })
    }
  }
}
