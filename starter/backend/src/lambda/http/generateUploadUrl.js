import { createLogger } from '../../utils/logger.mjs';
import { generateUploadUrl, updateTodoAttachmentUrl } from '../../utils/todos.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('generateUploadUrl');

export async function handler(event) {
  logger.info('Processing event: ', event);

  try {
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

    const userId = getUserId(event);
    if (!userId) {
      logger.error('User ID not provided');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'User ID not provided' })
      };
    }

    const uploadUrl = await generateUploadUrl(todoId);
    const attachmentUrl = `https://${process.env.ATTACHMENTS_BUCKET}.s3.amazonaws.com/${todoId}`;
    await updateTodoAttachmentUrl(userId, todoId, attachmentUrl);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ uploadUrl })
    };
  } catch (error) {
    logger.error('Error generating upload URL:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'Failed to generate upload URL' })
    };
  }
}
