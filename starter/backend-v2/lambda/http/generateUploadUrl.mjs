import { createLogger } from '../../src/utils/logger.mjs'
import { generateUploadUrlBusiness } from '../../src/businessLogic/todos.mjs'
import { getUserId } from '../../src/utils/todos.mjs'

const logger = createLogger('generateUploadUrl')

export async function handler(event) {
  logger.info('Processing event: ', event)

  try {
    const todoId = event.pathParameters.todoId

    if (!todoId) {
      logger.error('Todo ID not provided')
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'Todo ID not provided' })
      }
    }

    const userId = getUserId(event)
    if (!userId) {
      logger.error('User ID not provided')
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'User ID not provided' })
      }
    }

    const uploadUrl = await generateUploadUrlBusiness(todoId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ uploadUrl })
    }
  } catch (error) {
    logger.error('Error generating upload URL:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'Failed to generate upload URL' })
    }
  }
}
