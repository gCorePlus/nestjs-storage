import { StorageOptions } from '@google-cloud/storage';
import { NSBucketConfigOptions } from './ns-bucket-config-options.interface';
import { NSProviderConfigOptions } from "./ns-config-options.interface";

export interface NSGSConfigOptions extends NSProviderConfigOptions, StorageOptions {
  buckets?: NSBucketConfigOptions[];
}
