import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getTodo } from '../../businessLogic/todos'
import { updateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

   try{

    logger.info(`Verifying TodoItem with ID ${todoId} exists`)
    const item = await getTodo(todoId, userId)

      if(item.length === 0){
        logger.error(`TodoItem with ID ${todoId} does not exist`)
        return {
            statusCode: 404,
            body: 'Invalid todoId'
        }
      }

    const signedUrl = await updateAttachmentUrl(userId, todoId)
    console.log('update attachments url result ', signedUrl)

    return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: signedUrl
        })
  }
    } catch (e: any){
      logger.error(e.message)
    }
    
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )


