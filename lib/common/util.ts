import { BUCKET, NS_PROVIDER_TOKEN_DEFAULT, PROVIDER } from './constants';
import { NSBucketConfigOptions, NSConfigOptions } from '../interface';

export const createProviderToken = (options?: NSConfigOptions): string => {
  return createProviderTokenById(options?.id);
};

export const createProviderTokenById = (value?: string): string => {
  return `${value || NS_PROVIDER_TOKEN_DEFAULT}.${PROVIDER}`;
};

export const createBucketTokenById = (
  options?: NSConfigOptions,
  bucket?: NSBucketConfigOptions,
): string => {
  return createBucketToken(options?.id, bucket?.id);
};
export const createBucketTokenByName = (
  options?: NSConfigOptions,
  bucket?: NSBucketConfigOptions,
): string => {
  return createBucketToken(options?.id, bucket?.name);
};

export const createBucketToken = (
  providerId?: string,
  bucketName?: string,
): string => {
  return `${providerId || NS_PROVIDER_TOKEN_DEFAULT}.${bucketName}.${BUCKET}`;
};

export const createStorageToken = (storage?: string): string => {
  return `${storage || NS_PROVIDER_TOKEN_DEFAULT}.storage`;
};

export const createStorageTokenById = (options?: NSConfigOptions): string => {
  return createStorageToken(options?.id);
};

export const appendRemoveBackslash = (
  str: string | undefined,
  append: boolean = true,
): string | undefined => {
  if (!str) return;

  if (append) {
    return str.charAt(0) == '/' ? str : `/${str}`;
  } else {
    return str.charAt(0) == '/' ? str.substr(1) : str;
  }
};
