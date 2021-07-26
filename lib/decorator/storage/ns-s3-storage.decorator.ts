import { Inject } from "@nestjs/common";
import { createStorageToken, NSStorageInjectParams, ProviderEnum } from "../../common";

export function NSS3StorageInject(config?: NSStorageInjectParams | string | undefined) {
  config = config || 'default';
  const params: NSStorageInjectParams = typeof config === 'string' ? { storageId: config } : config;
  return Inject(createStorageToken(ProviderEnum.AWS, params.storageId));
}
