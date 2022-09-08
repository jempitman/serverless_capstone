import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'

const SES = new AWS.SES()




const logger = createLogger('sendReminder')

export const handler = middy( async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {

        logger.info('Processing event: ', event)

        const { to, from, subject, text } = JSON.parse(event.body)

    
        const params = {
            Destination: {
                ToAddresses: [ to ]

            },
            Message: {
                Body: {
                    Text: { Data: text}
                },
                Subject: { Data: subject}

            },
            Source: from  
        };

        try {
            await SES.sendEmail(params).promise()
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
                    message: 'Reminder email failed to send'
                })
            }
        }
       


        
    

})


handler.use(
    cors({
      credentials: true
    })
  )