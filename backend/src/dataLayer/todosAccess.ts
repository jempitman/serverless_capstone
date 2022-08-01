import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('Todos-Access')

// TODO: Implement the dataLayer logic

// export class TodosAccess {
//     static async getTodo(
//         event: APIGatewayProxyEvent
//     ): Promise<{ Items:TodoItem[]}> {
//         const userId = getUserId(event)

//         const items = await TodosAccess.getTodo(userId)
//         return {Items: items}
//     }
// }




export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly indexName = process.env.TODOS_TABLE_INDEX
    ){}

    async getAllTodos(userId: string): Promise<TodoItem[]>{

        logger.info('Getting all Todos')

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem>{
        logger.info(`Creating a todo with ID ${todoItem.todoId}`)

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }
        
}

// function createDynamoDBClient(){
//     if (process.env.IS_OFFLINE){
//         console.log('Creating a local DynamoDB instance')
//         return new XAWS.DynamoDB.DocumentClient({
//             region: 'localhost',
//             endpoint: 'http://localhost:8000'
//         })
//     }

//     return new XAWS.DynamoDB.DocumentClient()
// }