import { NSBucketConfigOptions } from './ns-bucket-config-options.interface';
import { NSProviderConfigOptions } from "./ns-config-options.interface";

export interface NSS3ConfigOptions extends NSProviderConfigOptions {
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;

  sessionToken?: string;
  apiVersion?: string;
  maxSockets?: number;

  buckets?: NSBucketConfigOptions[];
}
