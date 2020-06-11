import { StorageOptions } from '@google-cloud/storage';
import { NSBucketConfigOptions } from './ns-bucket-config-options.interface';

export interface NSGSConfigOptions extends StorageOptions {
  buckets?: NSBucketConfigOptions[];
}
