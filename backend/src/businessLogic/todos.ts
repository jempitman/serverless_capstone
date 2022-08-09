// import { APIGatewayProxyEvent } from 'aws-lambda'
import { TodosAccess } from '../dataLayer/todosAccess'
// import { getUserId } from '../lambda/utils'
// import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
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
    // console.log('In getAllTodos() function')
    logger.info('In getAllTodos() function')
    const userId = parseUserId(jwtToken)
    return await todosAccess.getAllTodos(userId)
}

export async function getTodo(userId: string, todoId: string): Promise<TodoItem[]>{
    // console.log('In getTodo() function')
    logger.info('In getTodo() function')
    return await todosAccess.getTodo(userId, todoId)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
    ): Promise<TodoItem> {

        logger.info('In createTodo() function')

        const todoId = uuid.v4()
        const userId = parseUserId(jwtToken)

        logger.info(todoId, userId)
    
    

        return await todosAccess.newTodo({
            userId: userId,
            todoId: todoId,
            createdAt: new Date().toISOString(),
            name: createTodoRequest.name,
            dueDate: createTodoRequest.dueDate,
            done: false
        })    
}

export async function updateTodo(
    updateTodoRequest: UpdateTodoRequest,
    userId: string, todoId: string): Promise<TodoItem> {

        logger.info('In updateTodo() function')

        const updatedTodo = {
            userId,
            todoId,
            name: updateTodoRequest.name,
            dueDate: updateTodoRequest.dueDate,
            done: updateTodoRequest.done
        }

    return await todosAccess.updateTodo(updatedTodo)
}

export async function deleteTodo(
    userId: string, todoId: string): Promise<String> {

        logger.info('In deleteTodo() function')

    const result = await todosAccess.deleteTodo(userId, todoId)

    // logger.info(`Successfully deleted Todo ${todoId}`)

    return result
}


export async function updateAttachmentUrl(
    userId: string, todoId: string, attachmentUrl: string): Promise<String> {

        logger.info('In updateAttachmentUrl() function')

        return await  todosAccess.updateAttachmentUrl(userId, todoId, attachmentUrl)

}



    






