import { NSS3ConfigOptions } from "./config/ns-s3-config-options.interface";
import { NSGSConfigOptions } from "./config/ns-gs-config-options.interface";
import { NSBucket } from "./ns-bucket.interface";

export type NSListBucketsOutput = NSListBucketOutput[];
export interface NSListBucketOutput {
  name: string;
}

export interface NSCreateBucketRequest {
  bucket: string;
  location?: string;
}

export interface NSStorage {
  getBuckets(): Promise<NSListBucketsOutput>;
  createBucket(data: NSCreateBucketRequest): Promise<void>;
  deleteBucket(bucket: string): Promise<any>;

  getConfig(): NSS3ConfigOptions | NSGSConfigOptions;
  getNSBuckets(): NSBucket[];
}
