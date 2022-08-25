import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import 'source-map-support/register'
import { createLogger } from "../../utils/logger"
import { websocketDisconnect } from "../../businessLogic/websockets"

const logger = createLogger('disconnect')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Websocket disconnect', event)

    
    const connectionId = event.requestContext.connectionId

    logger.info(`Removing connection ${connectionId}`)

    
    await websocketDisconnect(connectionId)


    return {
        statusCode: 200,
        body: ''
    }
}