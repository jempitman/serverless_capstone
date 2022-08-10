import { TodosAccess } from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'


// TODO: Implement businessLogic

const logger = createLogger('todos')
const todosAccess = new TodosAccess();

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    // console.log('In getAllTodos() function')
    logger.info('In getAllTodos() function')
    return await todosAccess.getAllTodos(userId)
}

export async function getTodo(userId: string, todoId: string): Promise<TodoItem[]>{
    // console.log('In getTodo() function')
    logger.info('In getTodo() function')
    return await todosAccess.getTodo(userId, todoId)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {

        logger.info('In createTodo() function')

        const todoId = uuid.v4()

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

// export async function generateUploadUrl(todoId: string): Promise<String>{
//     logger.info('In generateUploadUrl() function')

//     return await todosAccess.generateUploadUrl(todoId)
// }


export async function updateAttachmentUrl(
    userId: string, todoId: string): Promise<String> {

        logger.info('In updateAttachmentUrl() function')

        return await  todosAccess.updateAttachmentUrl(userId, todoId)

}



    






