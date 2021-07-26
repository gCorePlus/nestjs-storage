import { Inject } from "@nestjs/common";
import { createStorageToken, NSStorageInjectParams, ProviderEnum } from "../../common";

export function NSGSStorageInject(config?: NSStorageInjectParams | string | undefined) {
  config = config || 'default';
  const params: NSStorageInjectParams = typeof config === 'string' ? { storageId: config } : config;
  return Inject(createStorageToken(ProviderEnum.GOOGLE, params.storageId));
}
