import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getTodosForUser(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
    }).promise()
    const items = result.Items
    logger.info('Getting TODOS for user', {
      userId
    })
    return items as TodoItem[]
  }

  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()
    logger.info('TODO item created', {
      todoItem,
    })
    return todoItem
  }

  async updateTodoItem(userId: string, todoId: string, todoItem: TodoUpdate) {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: { todoId },
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      UpdateExpression: `SET name=:${todoItem.name}, done=:${todoItem.done}, dueDate=:${todoItem.dueDate}`
    }).promise()
    logger.info('TODO item updated', {
      todoId,
      userId,
      todoItem,
    })
  }

  async deleteTodoItem(userId: string, todoId: string) {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: { todoId },
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()
    logger.info('TODO item deleted', {
      todoId,
      userId,
    })
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
