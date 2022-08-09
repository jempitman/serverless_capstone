import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStorage logic

const logger = createLogger('AttachmentUtils')

export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ){}

    async generateUploadUrl(todoId: string): Promise<String>{
       logger.info(`Generating uploadUrl for TodoItem with ID ${todoId}`)

        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: `${todoId}.png`,
            Expires: parseInt(this.urlExpiration)
        })
    }
}



//     await this.docClient.update({
//         TableName: this.todosTable,
//         Key: { userId, todoId },
//         UpdateExpression: "set attachmentUrl=:URL",
//         ExpressionAttributeValues: {
//             ":URL": uploadUrl.split("?")[0]
//         },
//         ReturnValues: "UPDATED_NEW"
//     }).promise();

//     return uploadUrl
    

// }
// }





