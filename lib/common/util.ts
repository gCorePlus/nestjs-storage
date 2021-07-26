import { BUCKET, DEFAULT, NS_SERVICE, STORAGE } from "./constants";
import { NSBucketConfigOptions, NSConfigOptions } from "../interface";

export enum ProviderEnum {
  AWS = 'AWS',
  GOOGLE = 'GOOGLE'
}

// export const createNSServiceToken = (options?: NSProviderConfigOptions): string => {
//   return createProviderTokenById(options?.id);
// };

export const createNSServiceToken = (value?: string): string => {
  return `${value || DEFAULT}.${NS_SERVICE}`;
};

export const createBucketToken = (provider: ProviderEnum = ProviderEnum.AWS, providerId?: string, bucketId?: string): string => {
  return `${provider.toLowerCase()}.${providerId || DEFAULT}.${bucketId}.${BUCKET}`;
};

export const createS3BucketToken = (storageOptions?: NSConfigOptions, bucketOptions?: NSBucketConfigOptions): string => {
  return createBucketToken(ProviderEnum.AWS, storageOptions?.id, bucketOptions?.id);
};

export const createGSBucketToken = (storageOptions?: NSConfigOptions, bucketOptions?: NSBucketConfigOptions): string => {
  return createBucketToken(ProviderEnum.GOOGLE, storageOptions?.id, bucketOptions?.id);
};

export const createStorageToken = (provider: ProviderEnum, storageId?: string): string => {
  return `${provider.toLowerCase()}.${storageId || DEFAULT}.storage`;
};

export const createS3StorageToken = (storageOptions?: NSConfigOptions): string => {
  return createStorageToken(ProviderEnum.AWS, storageOptions?.id);
};

export const createGSStorageToken = (storageOptions?: NSConfigOptions): string => {
  return createStorageToken(ProviderEnum.GOOGLE, storageOptions?.id);
};

export const appendRemoveBackslash = (str: string | undefined, append: boolean = true): string | undefined => {
  if (!str) return;

  if (append) {
    return str.charAt(0) == '/' ? str : `/${str}`;
  } else {
    return str.charAt(0) == '/' ? str.substr(1) : str;
  }
};

export const isNSStorage = (name: string): boolean => {
  return name?.endsWith(STORAGE);
}

export const isNSBucket = (name: string): boolean => {
  return name?.endsWith(BUCKET);
}
