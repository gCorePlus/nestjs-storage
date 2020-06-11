import {
  NSConfigOptions,
  NSCreateBucketRequest,
  NSListBucketOutput,
  NSListBucketsOutput,
  NSStorage,
} from '../interface';
import { Storage } from '@google-cloud/storage';
import {
  CreateBucketRequest,
  GetBucketsResponse,
} from '@google-cloud/storage/build/src/storage';
import { Bucket } from '@google-cloud/storage/build/src/bucket';

export class NSGSStorage implements NSStorage {
  private storage: Storage;

  constructor(private readonly config: NSConfigOptions) {
    this.storage = new Storage(config.gs);
  }

  createBucket(request: NSCreateBucketRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const name = request.Bucket;

      let metadata: CreateBucketRequest | undefined;
      if (request.Location) {
        metadata = {
          location: request.Location,
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
            Name: item.name,
          }));

          resolve(items);
        })
        .catch(reject);
    });
  }
}
