import { Inject } from "@nestjs/common";
import { createBucketToken, NSBucketInjectParams, ProviderEnum } from "../../common";

export function NSS3BucketInject(config: NSBucketInjectParams | string) {
  const params: NSBucketInjectParams = typeof config === 'string' ? { bucketId: config } : config;
  return Inject(createBucketToken(ProviderEnum.AWS, params.storageId, params.bucketId));
}
