import { TodosAccess } from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'



/**
 * Business logic layer for todos
 * 
 */


const logger = createLogger('todos')
const todosAccess = new TodosAccess();

/**
 * @func getAllTodos
 * 
 * @param userId 
 * @returns all Todos for a user
 */
export async function getAllTodos(userId: string): Promise<TodoItem[]> {

    logger.info('In getAllTodos() function')

    return await todosAccess.getAllTodos(userId)
}


/**
 * @func getTodo
 * 
 * @param userId 
 * @param todoId 
 * @returns single todo for a user
 */

export async function getTodo(userId: string, todoId: string): Promise<TodoItem[]>{

    logger.info('In getTodo() function')

    return await todosAccess.getTodo(userId, todoId)
}

/**
 * @function createTodo
 * 
 * @param createTodoRequest 
 * @param userId 
 * @returns newly created Todo item
 */

export async function createTodo(
    createTodoRequest: CreateTodoRequest, userId: string, 
    userEmail: string): Promise<TodoItem> {

        logger.info('In createTodo() function')

        const todoId = uuid.v4()

        logger.info(todoId, userId)
    
    

        return await todosAccess.newTodo({
            userId: userId,
            todoId: todoId,
            createdAt: new Date().toISOString(),
            name: createTodoRequest.name,
            dueDate: createTodoRequest.dueDate,
            done: false,
            userEmail: userEmail
        })    
}

/**
 * @function updateTodo
 * 
 * @param updateTodoRequest 
 * @param userId 
 * @param todoId 
 * @returns updated Todo with 
 */

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

/**
 * @function deleteTodo
 * 
 * @param userId 
 * @param todoId 
 * @returns message confirming Todo has been deleted
 */
export async function deleteTodo(
    userId: string, todoId: string): Promise<String> {

        logger.info('In deleteTodo() function')


    return await todosAccess.deleteTodo(userId, todoId)
}


/**
 * @function updateAttachmentUrl
 * 
 * @param userId 
 * @param todoId 
 * @returns signedUrl to upload an image to S3
 */
export async function updateAttachmentUrl(
    userId: string, todoId: string): Promise<any> {

        logger.info('In updateAttachmentUrl() function')

        return await  todosAccess.updateAttachmentUrl(userId, todoId)

}

export async function getAllTodosForAllUsers(): Promise<TodoItem[]>{
    return todosAccess.getAllTodosForAllUsers()
}











