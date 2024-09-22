import { createLogger } from '../../src/utils/logger.mjs'
import { getTodosBusiness } from '../../src/businessLogic/todos.mjs'
import { getUserId } from '../../src/utils/todos.mjs'

const logger = createLogger('getTodos')

export async function handler(event) {
  logger.info('Processing event: ', event)

  try {
    const userId = getUserId(event)

    if (!userId) {
      logger.error('User ID not found')
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'User ID not found' })
      }
    }

    const items = await getTodosBusiness(userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ items })
    }
  } catch (error) {
    logger.error('Error fetching todos:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'Failed to fetch todos' })
    }
  }
}
