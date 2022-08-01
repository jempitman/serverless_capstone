import 'source-map-support/register'

import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// import * as AWS from 'aws-sdk'
import { getAllTodos } from '../../businessLogic/todos'
// import { APIGateway } from 'aws-sdk'
import { getToken } from  '../../auth/utils'
// import * as middy from 'middy'
// import { cors } from 'middy/middlewares'

// import { getAllTodos as getAllTodos } from '../../businessLogic/todos'
// import { getUserId } from '../utils';
// import { TodoItem } from '../../models/TodoItem'

// TODO: Get all TODO items for a current user

import { createLogger } from '../../utils/logger';

// const docClient = new AWS.DynamoDB.DocumentClient()

// const todosTable = process.env.TODOS_TABLE

const logger = createLogger('getAlltodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: todos
      })
    }

  }



// export const handler = middy(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     console.log('Caller event, ', event)
//     // Write your code here
    
//     // const userId = getUserId(event);
//     const todos = await getAllTodos(event)

    


//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         items: todos,
//       })
//     }
// })


// handler.use(
//   cors({
//     credentials: true
//   })
// )