import { createSchema } from "morphism";
import { PutObjectRequest } from "aws-sdk/clients/s3";

import { NSPutObjectRequest } from "../interface";

export const PutObjectMapper = createSchema<PutObjectRequest, NSPutObjectRequest>({
  Bucket: '',
  Key: 'file',
  Body: 'body',
  ACL: 'acl',
  Metadata: 'metadata'
});
