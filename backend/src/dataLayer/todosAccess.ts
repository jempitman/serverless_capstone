import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { FileStorage } from './fileStorage'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('Todos-Access')
const fileStorage = new FileStorage()

// TODO: Implement the dataLayer logic

/**
 * Layer to interact with AWS databases
 */

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly rankIndex = process.env.TODOS_DUE_DATE_INDEX,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly simpleEmailService = new XAWS.SES()
    ){}

    /**
     * @function getAllTodos
     * 
     * @param userId decrypted from JWT
     * @returns array of TodoItems for the user from the Todos DynamoDB
     */

    async getAllTodos(userId: string): Promise<TodoItem[]>{

        logger.info('Getting all Todos')

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.rankIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: true
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async getTodo(userId: string, todoId: string): Promise<TodoItem[]>{

        logger.info(`Querying todoItem with ID ${todoId}`)

        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'todoId = :todoId AND userId = :userId',
            ExpressionAttributeValues: {
                ':todoId': todoId,
                ':userId': userId   
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async newTodo(todoItem: TodoItem): Promise<TodoItem>{
        logger.info(`Creating todoItem with ID: ${todoItem.todoId}`)

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    async updateTodo(updatedTodo: any): Promise<TodoItem>{
        
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId: updatedTodo.todoId,
                userId: updatedTodo.userId},
            ExpressionAttributeNames: {"#N": "name"},
            UpdateExpression: "set #N = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
                ":name": updatedTodo.name,
                ":dueDate": updatedTodo.dueDate,
                ":done": updatedTodo.done,
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
        logger.info(`Updating todoItem with ID: ${updatedTodo.todoId}`)

        return updatedTodo
    }

    async deleteTodo(userId: string, todoId: string): Promise<string>{
        
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        }).promise()
        logger.info(`Deleted todoItem with ID: ${todoId}`)

        return todoId as string
    }

    async updateAttachmentUrl(userId: string, todoId: string): Promise<string> {

        const attachmentUrl = await fileStorage.generateSignedUrl(todoId)
        
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                'userId': userId,
                'todoId': todoId
            },
            UpdateExpression: 'set attachmentUrl=:URL',
            ExpressionAttributeValues: {
                ':URL': `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise()

        logger.info(`attachmentsUrl field updated with URL: ${attachmentUrl.split("?")[0]}`)

        return attachmentUrl

    }

    async sendReminderEmail(params): Promise<void> {

        await this.simpleEmailService.sendEmail(params).promise()
    }
         
}

