import { Storage } from "@google-cloud/storage";
import { CreateBucketRequest, GetBucketsResponse } from "@google-cloud/storage/build/src/storage";
import {
  NSBucket,
  NSCreateBucketRequest,
  NSGSConfigOptions,
  NSListBucketOutput,
  NSListBucketsOutput,
  NSStorage
} from "../interface";
import { Bucket } from "@google-cloud/storage/build/src/bucket";
import { NSGSBucketService } from "./ns-gs-bucket.service";

export class NSGSStorageService implements NSStorage {

  private readonly storage: Storage;
  private readonly nsBuckets: NSGSBucketService[];

  constructor(private readonly config: NSGSConfigOptions) {
    this.storage = new Storage(config);
    this.nsBuckets = config.buckets?.map(bucket => new NSGSBucketService(this, bucket)) || [];
  }

  createBucket(request: NSCreateBucketRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const name = request.bucket;

      let metadata: CreateBucketRequest | undefined;
      if (request.location) {
        metadata = {
          location: request.location
        };
      }

      this.storage
        .createBucket(name, metadata)
        .then(() => resolve())
        .catch((err) => {
          if (err?.code === 409) return resolve();

          reject(err);
        });
    });
  }

  deleteBucket(bucket: string): Promise<any> {
    return this.storage
      .bucket(bucket)
      .delete()
      .catch((err) => console.log(err));
  }

  getBuckets(): Promise<NSListBucketsOutput> {
    return new Promise<NSListBucketsOutput>((resolve, reject) => {
      this.storage
        .getBuckets()
        .then((data: GetBucketsResponse) => {
          if (!data) resolve();

          const values: Bucket[] = [].concat.apply([], data);

          const items = values.map<NSListBucketOutput>((item) => ({
            name: item.name
          }));

          resolve(items);
        })
        .catch(reject);
    });
  }

  getStorage(): Storage {
    return this.storage;
  }

  getConfig(): NSGSConfigOptions {
    return this.config;
  }

  getNSBuckets(): NSBucket[] {
    return this.nsBuckets;
  }
}
