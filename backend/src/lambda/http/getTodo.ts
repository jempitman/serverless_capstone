import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// import * as AWS from 'aws-sdk'
import { getTodo } from '../../businessLogic/todos'
// import { APIGateway } from 'aws-sdk'
// import { getToken } from  '../../auth/utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';


// TODO: Get all TODO items for a current user

import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodo');

export const handler = middy( async (event: APIGatewayProxyEvent):
  Promise<APIGatewayProxyResult> => {
    console.log('Entering getTodo function')

    logger.info('Processing event: ', event)

    const todoId = event.pathParameters.todoId
    console.log('Fetching todoId from Path')
    const userId = getUserId(event)
    console.log(`Fetched userId ${userId}`)

    const item = await getTodo(todoId, userId)

    //add id check function

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