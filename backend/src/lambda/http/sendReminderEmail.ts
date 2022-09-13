import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { sendReminder } from '../../businessLogic/todos'



const logger = createLogger('sendReminder')

export const handler = middy( async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {

        logger.info('Processing event: ', event)


        try {

        const userId = getUserId(event)

        const overdueTodos = await sendReminder(userId)

        console.log(`Reminder Emails to be sent for the following Todos ${overdueTodos}`)

            logger.info('Reminder emails were sent successfully')
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Reminder email was sent successfully'
                })
              }
        } catch (error) {
            logger.error('error sending reminder email ', error)
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: `Reminder email failed to send: ${error}`
                })
            }
        }
       
})


handler.use(
    cors({
      credentials: true
    })
  )