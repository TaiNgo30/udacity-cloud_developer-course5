import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const dynamoDb = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.ATTACHMENTS_BUCKET

export async function createTodo(userId, newTodo) {
  const todoId = uuidv4()
  const item = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    ...newTodo
  }

  await dynamoDb.put({
    TableName: todosTable,
    Item: item
  }).promise()

  return item
}

export async function getTodos(userId) {
  const result = await dynamoDb.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()

  return result.Items
}

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
  }).promise()
}

export async function deleteTodo(userId, todoId) {
  await dynamoDb.delete({
    TableName: todosTable,
    Key: { userId, todoId }
  }).promise()
}

export async function generateUploadUrl(userId, todoId) {
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: `${todoId}.png`,
    Expires: parseInt(process.env.SIGNED_URL_EXPIRATION)
  })

  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}.png`
  await updateTodoAttachmentUrl(userId, todoId, attachmentUrl)

  return url
}

async function updateTodoAttachmentUrl(userId, todoId, attachmentUrl) {
  const params = {
    TableName: todosTable,
    Key: { userId, todoId },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    }
  }

  await dynamoDb.update(params).promise()
}
