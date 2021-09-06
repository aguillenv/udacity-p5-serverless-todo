import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    const result = await DocumentClient.query({
        TableName: 'TodosTable',
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
