import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'


const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('websocketAccess')

export class WebsocketAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly connectionsTable = process.env.CONNECTIONS_TABLE
    ){}

    async websocketConnect(item: any): Promise<void>{
       
        logger.info(`Adding websocket connection to ${this.connectionsTable}`)
  
        await this.docClient.put({
            TableName: this.connectionsTable,
            Item: item

        }).promise()
    }

    async websocketDisconnect(key: any): Promise<void>{
        logger.info(`Removing websocket connection from ${this.connectionsTable}`)

        await this.docClient.delete({
            TableName: this.connectionsTable,
            Key: key
        }).promise()
    }
}
