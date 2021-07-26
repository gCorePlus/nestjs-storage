import { Inject } from "@nestjs/common";
import { createStorageToken, ProviderEnum } from "../../common";

export interface NSStorageInjectParams {
  storageId?: string;
}

export interface NSStorageInjectFullParams extends NSStorageInjectParams {
  provider: ProviderEnum;
}

export function NSStorageInject(config: NSStorageInjectFullParams) {
  return Inject(createStorageToken(config.provider, config.storageId));
}
