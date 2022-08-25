import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import 'source-map-support/register'
import { websocketConnect } from "../../businessLogic/websockets"
import { createLogger } from '../../utils/logger'


const logger = createLogger('connect')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
    logger.info('Websocket connect', event)

    
    const connectionId = event.requestContext.connectionId
    
    logger.info(`Adding new connection ${connectionId}`)
    
    await websocketConnect(connectionId)


    return {
        statusCode: 200,
        body: ''
    }
}