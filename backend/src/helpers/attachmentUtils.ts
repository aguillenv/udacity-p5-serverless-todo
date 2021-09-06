import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class AttachmentUtils {

  constructor(
    private readonly s3Client = createS3Client(),
  ) { }

  async getGetSignedUrl(key: string): Promise<string> {
    const url = this.s3Client.getSignedUrl('getObject', {
      Bucket: process.env.ATTACHMENT_S3_BUCKET,
      Key: key,
      Expires: process.env.SIGNED_URL_EXPIRATION
    });
    return url;
  }
}

function createS3Client() {
  return new XAWS.S3({
    signatureVersion: 'v4',
    region: process.env.S3_REGION,
    params: { Bucket: process.env.ATTACHMENT_S3_BUCKET }
  });
}
