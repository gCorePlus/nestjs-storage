export type NSListBucketsOutput = NSListBucketOutput[];
export interface NSListBucketOutput {
  Name?: string;
}

export interface NSCreateBucketRequest {
  Bucket: string;
  Location?: string;
}

export interface NSStorage {
  getBuckets(): Promise<NSListBucketsOutput>;
  createBucket(data: NSCreateBucketRequest): Promise<void>;
  deleteBucket(bucket: string): Promise<any>;
}
