// import { APIGatewayProxyEvent } from 'aws-lambda'
// import { userInfo } from 'os'
import { TodosAccess } from '../dataLayer/todosAccess'
// import { getUserId } from '../lambda/utils'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import { APIGatewayEvent } from 'aws-lambda'
// import { stringify } from 'querystring'
// import * as createError from 'http-errors'
// import * as AWS from 'aws-sdk'

// TODO: Implement businessLogic

const logger = createLogger('todos')
const todosAccess = new TodosAccess();

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
    logger.info('In getAllTodos() function')
    const userId = parseUserId(jwtToken)
    return await todosAccess.getAllTodos(userId)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
    ): Promise<TodoItem> {

        logger.info('In createTodo() function')

        const todoId = uuid.v4()
        const userId = parseUserId(jwtToken)

        logger.info(todoId, userId)
    
    

        return await todosAccess.createTodo({
            userId: userId,
            todoId: todoId,
            createdAt: new Date().toISOString(),
            name: createTodoRequest.name,
            dueDate: createTodoRequest.dueDate,
            done: false
        })
    
}


// export class todos {
//     static async getTodo(
//       event: APIGatewayProxyEvent,
//     //   logger: Logger
//     ): Promise<{ Items: TodoItem[] }> {
//       const userId = getUserId(event)
//     //   logger.info(`get item with userId ${userId}`)
  
//       const items = await TodosAccess.getTodo(userId)
//       return { Items: items }
//     }

// }


// const ddbDocumentClient = new AWS.DynamoDB.DocumentClient()

// const todosAccess = new TodosAccess()

// export async function getTodosByUserId(userId): Promise<TodoItem[]> {
//         const params = {
//             TableName: process.env.TODOS_TABLE,
//             KeyConditionExpression: 'userId = :userId',
//             ExpressionAttributeValues: {
//                 'userId': userId
//             }
//         }

//         const await ddbDocumentClient: any.query(params).promise()

//         return result.Items as TodoItem[]
// }
    
//     // event: APIGatewayProxyEvent): Promise<Items: TodoItem[]>{
//     //     const userId = getUserId(event)
    
//     //     const items = await TodosAccess.getTodoByUserId(userId)
//     //     return { Items: items}
//     // }




