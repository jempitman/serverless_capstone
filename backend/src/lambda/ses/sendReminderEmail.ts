import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as AWS from 'aws-sdk'
import { getAllTodosForAllUsers } from '../../businessLogic/todos'


/**
 * Lambda function to find all overdue and incomplete todos for all users and send
 * email reminders once a day at 04h30 UTC. The schedule time may be adjusted in the
 * sendReminderEmail function definition in the serverless.yml file 
 * 
 * The email address used for reminders
 * is taken from the JWT login token and must be registered with AWS SES in order to
 * received reminders
 */

const sesClient = new AWS.SES()

const logger = createLogger('sendReminder')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {

        logger.info('Processing event: ', event)

        try{

        logger.info('Fetching all Todos for all users')

        const allTodos = await getAllTodosForAllUsers()

        console.log(`Returned Todos: ${allTodos.length}`)

        const today = new Date()
        
        logger.info('Extracting all incomplete and overdue todos')
        const overdueTodos = allTodos.filter(allTodos =>
            ((new Date(allTodos.dueDate)) < today) && (!allTodos.done))
  
        
        logger.info('Incomplete and overdue Todos fetched, preparing reminder email run')

        for (let i=0; i<overdueTodos.length; i++){

            const params = {
                Destination: {
                    ToAddresses: [overdueTodos[i].userEmail]
                },
                Message: {
                    Body: {
                        Text: { Data: 
                            `Todo "${overdueTodos[i].name}" was due to be completed on ${overdueTodos[i].dueDate} and is now overdue. Either mark as complete or delete from list to avoid receiving further reminder emails`}
                            },
                            Subject: { Data: 
                                `Reminder: Todo "${overdueTodos[i].name}" is overdue!`}
                            
                        },
                Source: overdueTodos[i].userEmail
    
            }

            await sesClient.sendEmail(params).promise()
        }
           

            return {
                            statusCode: 200,
                            body: JSON.stringify({
                                message: 'Reminder email was sent successfully'
                            })
                    } 

        } catch(error){
            logger.error('error sending reminder email ', error)
                console.log(`Reminder email failed to send: ${error}`)
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                            message: `Reminder email failed to send: ${error}`
                    })
                }
        }

        




        // try {

        //     const result = await docClient.scan({
        //         TableName: todosTable
        //     }).promise()

        
        //     const todos = result.Items
        //     console.log(`Todos returned = ${todos.length}`)

        //     const today = new Date()

        //     const overdueTodos = todos.filter(todos => 
        //         ((new Date(todos.dueDate)) < today) && (!todos.done))


        //     console.log(`overdueTodos = ${overdueTodos.length}`)

        //     // const 
        
        //     const nextReminderDate = new Date(today.getDate() + 1)
                

        //     overdueTodos.forEach(async overdueTodos => {

                

        //             const params = {
        //                 Destination: {
        //                     ToAddresses: [ overdueTodos.userEmail ]
                
        //                 },
        //                 Message: {
        //                     Body: {
        //                         Text: { Data: 
        //                             `Todo "${overdueTodos.name}" was due to be completed on ${overdueTodos.dueDate} and is now overdue. Either mark as complete or delete from list to avoid receiving further reminder emails
                                    
        //                             The next reminder will be sent on ${nextReminderDate}`}
        //                     },
        //                     Subject: { Data: 
        //                         `Reminder: Todo "${overdueTodos.name}" is overdue!`}
                
        //                 },
        //                 Source: overdueTodos.userEmail 
        //             }
            
    
        //             console.log(`Sending reminder email ${JSON.stringify(params)} to ${overdueTodos.userEmail}`)
        //             await sesClient.sendEmail(params).promise()
    
        //             console.log('Reminder emails sent successfully')
                                 
        //     })
                
                
            
        //     return {
        //             statusCode: 200,
        //             body: JSON.stringify({
        //                 message: 'Reminder email was sent successfully'
        //             })
        //     }      
            
        // }catch (error) {
        //     logger.error('error sending reminder email ', error)
        //     console.log(`Reminder email failed to send: ${error}`)
        //     return {
        //         statusCode: 400,
        //         body: JSON.stringify({
        //                 message: `Reminder email failed to send: ${error}`
        //         })
        //     }

             
        // }


}

    // function createReminderEmail(overdueTodos:TodoItem[], today: Date) {


    //     const nextReminderDate = new Date(today.getDate() + 1)

    //     for (let i=0; i< overdueTodos.length(); i++){

    //     }
    //     const params = {
    //         Destination: {
    //             ToAddresses: [ overdueTodos.userEmail ]
    
    //         },
    //         Message: {
    //             Body: {
    //                 Text: { Data: 
    //                     `Todo "${overdueTodo.name}" was due to be completed on ${overdueTodo.dueDate} and is now overdue. Either mark as complete or delete from list to avoid receiving further reminder emails
                        
    //                     The next reminder will be sent on ${nextReminderDate}`}
    //             },
    //             Subject: { Data: 
    //                 `Reminder: Todo "${overdueTodo.name}" is overdue!`}
    
    //         },
    //         Source: overdueTodo.userEmail 
    //     }

    //     return params


    // }
