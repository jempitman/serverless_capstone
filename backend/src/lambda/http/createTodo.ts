import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('create_todos')

export const handler = middy(async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    try{

      const newTodoItem = await createTodo(newTodo, userId)

      if (!newTodoItem.name) {
        logger.error('Empty Todo name field')
        
        return {
          statusCode: 404,
          body: "Empty TodoItem name"
        }
      }

      return {
          statusCode: 201,
          body: JSON.stringify({
              item: newTodoItem
          })
      }
    } catch(e: any){
      logger.error(e.message)
    }
    
})


handler.use(
  cors({
    credentials: true
  })
)
