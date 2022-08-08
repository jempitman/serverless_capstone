import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// import * as AWS from 'aws-sdk'
import { getAllTodos } from '../../businessLogic/todos'
// import { APIGateway } from 'aws-sdk'
import { getToken } from  '../../auth/utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

// import { getUserId } from '../utils';


// TODO: Get all TODO items for a current user

import { createLogger } from '../../utils/logger';

// const docClient = new AWS.DynamoDB.DocumentClient()

// const todosTable = process.env.TODOS_TABLE

const logger = createLogger('getAlltodos');

export const handler = middy( async (event: APIGatewayProxyEvent):
  Promise<APIGatewayProxyResult> => {

    logger.info('Processing event: ', event)
    const jwtToken: string = getToken(event.headers.Authorization)

    // const jwtToken: string = getToken(event.headers.Authorization)
    const todos = await getAllTodos(jwtToken)
    // const result = await docClient.scan({
    //   TableName: todosTable
    // }).promise()
  

    // const items = result.Items

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