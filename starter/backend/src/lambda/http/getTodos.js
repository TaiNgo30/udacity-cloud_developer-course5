import { createLogger } from '../../utils/logger.mjs';
import { getTodos } from '../../utils/todos.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('getTodos');

export async function handler(event) {
  logger.info('Processing event: ', event);

  try {
    const userId = getUserId(event);

    if (!userId) {
      logger.error('User ID not found');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'User ID not found' })
      };
    }

    const items = await getTodos(userId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ items })
    };
  } catch (error) {
    logger.error('Error fetching todos:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'Failed to fetch todos' })
    };
  }
}
