import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda"
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import { createLogger } from '../../utils/logger'

/**
 * Function to duplicate new and updatedTodos from the DynamoDB stream to ElasticSearch 
 */

const logger = createLogger('elasticsearch')

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
    hosts: [esHost],
    connectionClass: httpAwsEs
})


export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    logger.info('Processing events batch from DynamoDB', JSON.stringify(event))

    for (const record of event.Records){
        logger.info('Processing record', JSON.stringify(record))

        if (record.eventName !== 'INSERT'){
            continue
        }

        const newTodoItem = record.dynamodb.NewImage
        
        const todoId = newTodoItem.todoId.S
        // const userId = newTodoItem.userId.S

        const body = {
            todoId: newTodoItem.todoId.S,
            userId: newTodoItem.userId.S,
            dueDate: newTodoItem.dueDate.S,
            createdAt: newTodoItem.createdAt.S,
            name: newTodoItem.name.S,
            done: newTodoItem.done.BOOL
       }

        await es.index({
            index: 'todos-index',
            type: 'todos',
            id: todoId,
            body
        })

    }

}