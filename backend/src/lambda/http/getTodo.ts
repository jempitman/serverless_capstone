import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTodo } from '../../businessLogic/todos'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';

/**
 * Lambda function to return a single Todo for a user
 * 
 * GET endpoint: https://{{apiId}}.execute-api.{{region}}.amazonaws.com/dev/todos/{todoId}
 */
import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodo');

export const handler = middy( async (event: APIGatewayProxyEvent):
  Promise<APIGatewayProxyResult> => {
    // console.log('Entering getTodo function')

    logger.info('Processing event: ', event)

    const todoId = event.pathParameters.todoId
    // console.log('Fetching todoId from Path')
    const userId = getUserId(event)
    // console.log(`Fetched userId ${userId}`)

    const item = await getTodo(userId, todoId)



    return {
      statusCode: 200,
      body: JSON.stringify(item)
    }

  })


handler.use(
  cors({
    credentials: true
  })
)