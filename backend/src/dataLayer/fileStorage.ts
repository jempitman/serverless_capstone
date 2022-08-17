
import { createLogger } from '../utils/logger'

// const XAWS = AWSXRay.captureAWS(AWS)
const AWS = require('aws-sdk')

const logger = createLogger('File-Storage')

export class FileStorage {
    constructor(
        private readonly s3 = new AWS.S3({signatureVersion:'v4'}),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ){}

    async generateSignedUrl(todoId: string): Promise<any> {

        logger.info('In generateSignedUrl() function')

        const signedUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            // Key: `${todoId}.png`,
            Key: todoId,
            Expires: parseInt(this.urlExpiration)
        })

        logger.info(`Signed URL ${signedUrl} created by S3`)

        return signedUrl

    }

}