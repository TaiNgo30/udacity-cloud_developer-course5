import { createLogger } from '../../utils/logger.mjs';
import { deleteTodo } from '../../utils/todos.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('deleteTodo');

export async function handler(event) {
  logger.info('Processing event: ', event);

  try {
    const userId = getUserId(event);
    const todoId = event.pathParameters.todoId;

    if (!todoId) {
      logger.error('Todo ID not provided');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'Todo ID not provided' })
      };
    }

    await deleteTodo(userId, todoId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Todo deleted successfully' })
    };
  } catch (error) {
    logger.error('Error deleting todo:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'Failed to delete todo' })
    };
  }
}
