import * as S3 from "aws-sdk/clients/s3";
import { CreateBucketRequest, DeleteBucketRequest, ListBucketsOutput } from "aws-sdk/clients/s3";
import {
  NSCreateBucketRequest,
  NSListBucketOutput,
  NSListBucketsOutput,
  NSS3ConfigOptions,
  NSStorage
} from "../interface";
import { setupS3GlobalConfig } from "../common";
import { NSS3BucketService } from "./ns-s3-bucket.service";

export class NSS3StorageService implements NSStorage {

  private readonly storage: S3;
  private readonly nsBuckets: NSS3BucketService[];

  constructor(private readonly config: NSS3ConfigOptions) {
    this.storage = new S3(this.config);
    this.nsBuckets = config.buckets?.map(bucket => new NSS3BucketService(this, bucket)) || [];
  }

  public setupS3Config() {
    if (this.config) {
      setupS3GlobalConfig(this.config);
    }
  }

  createBucket(request: NSCreateBucketRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      this.setupS3Config();

      const params: CreateBucketRequest = {
        Bucket: request.bucket
      };

      if (request.location) {
        params.CreateBucketConfiguration = {
          LocationConstraint: request.location
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
      this.setupS3Config();

      const params: DeleteBucketRequest = {
        Bucket: bucket
      };
      this.storage.deleteBucket(params, (err, data) => {
        if (err) return reject(err);

        resolve();
      });
    });
  }

  getBuckets(): Promise<NSListBucketsOutput> {
    return new Promise<NSListBucketsOutput>((resolve, reject) => {
      this.setupS3Config();

      this.storage
        .listBuckets()
        .promise()
        .then((values: ListBucketsOutput) => {
          if (!values) resolve();

          const items = values?.Buckets?.map<NSListBucketOutput>((item) => ({
            name: item.Name as string
          }));

          resolve(items);
        })
        .catch(reject);
    });
  }

  getStorage(): S3 {
    return this.storage;
  }

  getConfig(): NSS3ConfigOptions {
    return this.config;
  }

  getNSBuckets(): NSS3BucketService[] {
    return this.nsBuckets;
  }
}
