import 'source-map-support/register'

import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as AWS from 'aws-sdk'
// import { APIGateway } from 'aws-sdk'

// import * as middy from 'middy'
// import { cors } from 'middy/middlewares'

// import { getAllTodos as getAllTodos } from '../../businessLogic/todos'
// import { getUserId } from '../utils';
// import { TodoItem } from '../../models/TodoItem'

// TODO: Get all TODO items for a current user

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):
  Promise<APIGatewayProxyResult> => {

    console.log('Processing event: ', event)
    const result = await docClient.scan({
      TableName: todosTable
    }).promise()
  

    const items = result.Items

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items
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