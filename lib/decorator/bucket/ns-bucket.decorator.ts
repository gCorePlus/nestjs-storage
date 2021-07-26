import { Inject } from "@nestjs/common";
import { createBucketToken, ProviderEnum } from "../../common";

export interface NSBucketInjectParams {
  storageId?: string;
  bucketId: string;
}

export interface NSBucketInjectFullParams extends NSBucketInjectParams {
  provider: ProviderEnum;
}

export function NSBucketInject(config: NSBucketInjectFullParams) {
  return Inject(createBucketToken(config.provider, config.storageId, config.bucketId));
}
