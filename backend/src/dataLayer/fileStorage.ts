import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

/**
 * Datalayer to interact with the s3 bucket to generate signed Urls for
 * uploading image files for todos
 */

const logger = createLogger('File-Storage')

export class FileStorage {
    constructor(
        private readonly s3 = new XAWS.S3({signatureVersion:'v4'}),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ){}

    /**
     * @function generateSignedUrl makes signedUrl request to s3 bucket
     * 
     * @param todoId key to link signed url to Todo
     * 
     * @returns signedUrl string to upload image to AttachmentsBucket
     */

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