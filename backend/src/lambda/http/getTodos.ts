import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllTodos } from '../../businessLogic/todos'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils';

/**
 * Lambda function to fetch all Todos for a user and return according to due date
 * 
 * GET endpoint: https://{{apiId}}.execute-api.{{region}}.amazonaws.com/dev/todos
 */

import { createLogger } from '../../utils/logger';

const logger = createLogger('getAlltodos');

export const handler = middy( async (event: APIGatewayProxyEvent):
  Promise<APIGatewayProxyResult> => {

    logger.info('Processing event: ', event)

    const userId = getUserId(event)


    const todos = await getAllTodos(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }

  })


handler.use(
  cors({
    credentials: true
  })
)