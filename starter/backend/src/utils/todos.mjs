import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);

const dynamoDb = new XAWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const bucketName = process.env.ATTACHMENTS_BUCKET;

/**
 * Create a new TODO item
 * @param userId - user id who owns the TODO item
 * @param newTodo - details of the TODO item to be created
 * @returns - a newly created TODO item
 */
export async function createTodo(userId, newTodo) {
  const todoId = uuidv4();

  const item = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    ...newTodo
  };

  await dynamoDb.put({
    TableName: todosTable,
    Item: item
  }).promise();

  return item;
}

/**
 * Get all TODO items for a specific user
 * @param userId - user id who owns the TODO items
 * @returns - a list of TODO items
 */
export async function getTodos(userId) {
  const result = await dynamoDb.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise();

  return result.Items;
}

/**
 * Update a TODO item
 * @param userId - user id who owns the TODO item
 * @param todoId - id of the TODO item to be updated
 * @param updatedTodo - details to be updated
 * @returns - updated TODO item
 */
export async function updateTodo(userId, todoId, updatedTodo) {
  await dynamoDb.update({
    TableName: todosTable,
    Key: { userId, todoId },
    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeValues: {
      ':name': updatedTodo.name,
      ':dueDate': updatedTodo.dueDate,
      ':done': updatedTodo.done
    },
    ExpressionAttributeNames: {
      '#name': 'name'
    }
  }).promise();
}

/**
 * Delete a TODO item
 * @param userId - user id who owns the TODO item
 * @param todoId - id of the TODO item to be deleted
 */
export async function deleteTodo(userId, todoId) {
  await dynamoDb.delete({
    TableName: todosTable,
    Key: { userId, todoId }
  }).promise();
}

/**
 * Generate a signed URL to upload an attachment file to S3
 * @param todoId - id of the TODO item to be uploaded
 * @returns - a pre-signed URL to upload the attachment
 */
export async function generateUploadUrl(userId, todoId) {
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  });

  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: `${todoId}.png`, // assuming the uploaded file is a PNG, you can modify as needed
    Expires: parseInt(process.env.SIGNED_URL_EXPIRATION)
  });

  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}.png`;
  await updateTodoAttachmentUrl(userId, todoId, attachmentUrl);

  return url;
}

export async function updateTodoAttachmentUrl(userId, todoId, attachmentUrl) {
  const params = {
    TableName: todosTable,
    Key: { userId, todoId },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    }
  };

  await dynamoDb.update(params).promise();
}