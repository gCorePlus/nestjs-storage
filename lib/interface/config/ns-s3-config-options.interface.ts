import { NSBucketConfigOptions } from './ns-bucket-config-options.interface';

export interface NSS3ConfigOptions {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
  buckets?: NSBucketConfigOptions[];

  sessionToken?: string;
  apiVersion?: string;
  maxSockets?: number;
}
