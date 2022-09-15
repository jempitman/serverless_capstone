import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
// import * as middy from 'middy'
// import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
// import { getUserId } from '../utils'
// import { sendReminder } from '../../businessLogic/todos'
import * as AWS from 'aws-sdk'
// import { TodoItem } from '../../models/TodoItem'


const docClient = new AWS.DynamoDB.DocumentClient()
const sesClient = new AWS.SES()

const todosTable = process.env.TODOS_TABLE

const logger = createLogger('sendReminder')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {

        logger.info('Processing event: ', event)


        try {

            const result = await docClient.scan({
                TableName: todosTable
            }).promise()

        
            const todos = result.Items
            console.log(`Todos returned = ${todos.length}`)

            const today = new Date()

            const nextReminderDate = new Date(today.getDate() + 1)

            const overdueTodos = todos.filter(todos => 
                ((new Date(todos.dueDate)) < today) && (!todos.done))


                console.log(`overdueTodos = ${overdueTodos.length}`)
            overdueTodos.forEach(async overdueTodos => {

                console.log(`Processing todo ${overdueTodos.name}, with dueDate ${overdueTodos.dueDate}`)
                const params = {
                    Destination: {
                        ToAddresses: [ overdueTodos.userEmail ]
            
                    },
                    Message: {
                        Body: {
                            Text: { Data: 
                                `Todo "${overdueTodos.name}" was due to be completed on ${overdueTodos.dueDate} and is now overdue. Either mark as complete or delete from list to avoid receiving further reminder emails
                                
                                The next reminder will be sent on ${nextReminderDate}`}
                        },
                        Subject: { Data: 
                            `Reminder: Todo "${overdueTodos.name}" is overdue!`}
            
                    },
                    Source: overdueTodos.userEmail 
                };

                console.log(`Sending reminder email to ${overdueTodos.userEmail}`)
                await sesClient.sendEmail(params).promise()

            })

            console.log('Reminder emails sent successfully')
            return {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: 'Reminder email was sent successfully'
                        })
                    }              
                
        }catch (error) {
             logger.error('error sending reminder email ', error)
             console.log(`Reminder email failed to send: ${error}`)
                return {
                        statusCode: 400,
                        body: JSON.stringify({
                                message: `Reminder email failed to send: ${error}`
                        })
                }
        }


    }




//         const overdueTodos = await sendReminder(userId)

//         console.log(`Reminder Emails to be sent for the following Todos ${overdueTodos}`)

//             logger.info('Reminder emails were sent successfully')
//             return {
//                 statusCode: 200,
//                 body: JSON.stringify({
//                     message: 'Reminder email was sent successfully'
//                 })
//               }
//         } catch (error) {
//             logger.error('error sending reminder email ', error)
//             return {
//                 statusCode: 400,
//                 body: JSON.stringify({
//                     message: `Reminder email failed to send: ${error}`
//                 })
//             }
//         }
       
// })


// handler.use(
//     cors({
//       credentials: true
//     })
//   )