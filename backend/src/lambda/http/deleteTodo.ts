import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo, getTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

/**
 * Lambda function to remove items from Todos Table
 * 
 * DELETE endpoint: https://{{apiId}}.execute-api.{{region}}.amazonaws.com/dev/todos/{todoId}
 */


const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    
    logger.info('In src/lambda/http/deleteTodo.ts')
    
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)


    logger.info(`Fetched userId ${userId} from src/lambda/utils.ts,
    verifying TodoItem ${todoId} exists`)

    logger.info(`Verifying TodoItem with ID ${todoId} exists`)

    const item = await getTodo(userId, todoId)

    if(item.length === 0){
        logger.error(`TodoItem with ID ${todoId} does not exist`)
        return {
            statusCode: 404,
            body: 'Invalid todoId'
        }
    }
    
    const items = await deleteTodo(userId, todoId)
    
    return {
        statusCode: 200,
        body: JSON.stringify(`Successfully deleted Todo with ID: ${items}`)
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
