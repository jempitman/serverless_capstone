import { createLogger } from '../utils/logger'
import { WebsocketAccess } from '../dataLayer/websocketAccess'


const logger = createLogger('websockets')

const websocketAccess = new WebsocketAccess()

export async function websocketConnect(connectionId: string): Promise<void>{

    logger.info('In websocketConnect() function')

    const item = {
        id: connectionId,
        timestamp: new Date().toISOString()
    }

    return await websocketAccess.websocketConnect(item)

}

export async function websocketDisconnect(connectionId: string): Promise<void>{

    logger.info('In websocketDisconnect() function')

    const key = {
        id: connectionId
    }

    return await websocketAccess.websocketDisconnect(key)
}