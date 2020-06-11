import {
  NSBody,
  NSBucket,
  NSBucketConfigOptions,
  NSConfigOptions,
  NSCopyObjectRequest,
  NSPutObjectRequest,
} from '../interface';
import * as AWS from 'aws-sdk/global';
import * as https from 'https';
import * as S3 from 'aws-sdk/clients/s3';
import {
  CopyObjectRequest,
  DeleteObjectRequest,
  GetObjectRequest,
  PutObjectOutput,
  PutObjectRequest,
} from 'aws-sdk/clients/s3';
import { appendRemoveBackslash, setupS3GlobalConfig } from '../common';

export class NSS3Bucket implements NSBucket {
  private storage: S3;

  constructor(
    private readonly config: NSConfigOptions,
    private readonly bucketOpts: NSBucketConfigOptions,
  ) {
    this.storage = new S3(this.config.s3);
  }

  private setConfig() {
    if (this.config?.s3) {
      setupS3GlobalConfig(this.config.s3);
    }
  }

  getObject(file: string): Promise<NSBody> {
    this.setConfig();

    const params: GetObjectRequest = {
      Bucket: this.bucketOpts.id,
      Key: file,
    };
    return new Promise<any>((resolve, reject) => {
      this.storage.getObject(params, (err, data) => {
        if (err) return reject(err);

        resolve(data.Body);
      });
    });
  }

  putObject(data: NSPutObjectRequest): Promise<void> {
    this.setConfig();

    const params: PutObjectRequest = Object.assign({}, data, {
      Bucket: this.bucketOpts.id,
    });
    return new Promise<void>((resolve, reject) => {
      this.storage.putObject(params, (err, data) => {
        if (err) return reject(err);

        resolve();
      });
    });
  }

  deleteObject(file: string): Promise<void> {
    this.setConfig();

    const params: DeleteObjectRequest = {
      Bucket: this.bucketOpts.id,
      Key: file,
    };
    return new Promise<void>((resolve, reject) => {
      this.storage.deleteObject(params, (err, data) => {
        if (err) return reject(err);

        resolve();
      });
    });
  }

  copyObject(request: NSCopyObjectRequest): Promise<void> {
    this.setConfig();

    return new Promise<void>((resolve, reject) => {
      const bucketSource: string = this.bucketOpts.id;
      const fileSource: string = appendRemoveBackslash(
        request.KeySource,
        false,
      )!;

      const bucketDestination: string = request.BucketDestination
        ? request.BucketDestination
        : this.bucketOpts.id;
      const fileDestination: string = appendRemoveBackslash(
        request.KeyDestination,
        false,
      )!;

      const params: CopyObjectRequest = {
        Bucket: bucketDestination,
        Key: fileDestination,
        CopySource: encodeURIComponent(`/${bucketSource}/${fileSource}`),
      };
      // this.storage.copyObject(params).promise()

      this.storage.copyObject(params, (err, data) => {
        if (err) reject(err);

        resolve();
      });
    });
  }
}
