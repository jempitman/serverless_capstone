import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodo, updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'


const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('Processing event: ', event)
    
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object


    logger.info(`Verifying TodoItem with ID ${todoId} exists`)
    const item = await getTodo(todoId, userId)

    if(item.length === 0){
        logger.error(`TodoItem with ID ${todoId} does not exist`)
        return {
            statusCode: 404,
            body: 'Invalid todoId'
        }
    }

    const items = await updateTodo(updatedTodo, userId, todoId)


    return {
        statusCode: 200,
        body: JSON.stringify(items)
    }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
