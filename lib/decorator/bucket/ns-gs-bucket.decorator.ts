import { Inject } from "@nestjs/common";
import { createBucketToken, NSBucketInjectParams, ProviderEnum } from "../../common";

export function NSGSBucketInject(config: NSBucketInjectParams | string) {
  const params: NSBucketInjectParams = typeof config === 'string' ? { bucketId: config } : config;
  return Inject(createBucketToken(ProviderEnum.GOOGLE, params.storageId, params.bucketId));
}
