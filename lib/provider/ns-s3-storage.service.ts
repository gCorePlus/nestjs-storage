import {
  NSBucketConfigOptions,
  NSConfigOptions,
  NSCreateBucketRequest,
  NSListBucketOutput,
  NSListBucketsOutput,
  NSStorage,
} from '../interface';
import * as S3 from 'aws-sdk/clients/s3';
import {
  CreateBucketRequest,
  DeleteBucketRequest,
  ListBucketsOutput,
} from 'aws-sdk/clients/s3';
import { setupS3GlobalConfig } from '../common';

export class NSS3Storage implements NSStorage {
  private storage: S3;

  constructor(private readonly config: NSConfigOptions) {
    this.storage = new S3(this.config.s3);
  }

  private setConfig() {
    if (this.config?.s3) {
      setupS3GlobalConfig(this.config.s3);
    }
  }

  createBucket(request: NSCreateBucketRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      this.setConfig();

      const params: CreateBucketRequest = {
        Bucket: request.Bucket,
      };

      if (request.Location) {
        params.CreateBucketConfiguration = {
          LocationConstraint: request.Location,
        };
      }

      this.storage.createBucket(params, (err, data) => {
        if (err) return reject(err);

        resolve();
      });
    });
  }

  deleteBucket(bucket: string): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      this.setConfig();

      const params: DeleteBucketRequest = {
        Bucket: bucket,
      };
      this.storage.deleteBucket(params, (err, data) => {
        if (err) return reject(err);

        resolve();
      });
    });
  }

  getBuckets(): Promise<NSListBucketsOutput> {
    return new Promise<NSListBucketsOutput>((resolve, reject) => {
      this.setConfig();

      this.storage
        .listBuckets()
        .promise()
        .then((values: ListBucketsOutput) => {
          if (!values) resolve();

          const items = values?.Buckets?.map<NSListBucketOutput>((item) => ({
            Name: item.Name,
          }));

          resolve(items);
        })
        .catch(reject);
    });
  }
}
