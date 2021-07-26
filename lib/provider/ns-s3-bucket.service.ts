import { NSBody, NSBucket, NSBucketConfigOptions, NSCopyObjectRequest, NSPutObjectRequest } from "../interface";
import { CopyObjectRequest, DeleteObjectRequest, GetObjectRequest, PutObjectRequest } from "aws-sdk/clients/s3";
import { appendRemoveBackslash } from "../common";
import { PutObjectMapper } from "./ns-s3.mapper";
import { morphism } from "morphism";
import { NSS3StorageService } from "./ns-s3-storage.service";

export class NSS3BucketService implements NSBucket {

  constructor(
    private readonly storage: NSS3StorageService,
    private readonly config: NSBucketConfigOptions,
  ) {
  }

  private setConfig() {
    this.storage.setupS3Config();
  }

  getObject(file: string): Promise<NSBody> {
    this.setConfig();

    const params: GetObjectRequest = {
      Bucket: this.config.id,
      Key: file,
    };
    return new Promise<any>((resolve, reject) => {
      this.storage.getStorage().getObject(params, (err, data) => {
        if (err) return reject(err);

        resolve(data.Body);
      });
    });
  }

  putObject(data: NSPutObjectRequest): Promise<void> {
    this.setConfig();

    const params: PutObjectRequest = Object.assign(morphism(PutObjectMapper, data), {
      Bucket: this.config.id,
    });
    return new Promise<void>((resolve, reject) => {
      this.storage.getStorage().putObject(params, (err, data) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  deleteObject(file: string): Promise<void> {
    this.setConfig();

    const params: DeleteObjectRequest = {
      Bucket: this.config.id,
      Key: file,
    };
    return new Promise<void>((resolve, reject) => {
      this.storage.getStorage().deleteObject(params, (err, data) => {
        if (err) return reject(err);

        resolve();
      });
    });
  }

  copyObject(request: NSCopyObjectRequest): Promise<void> {
    this.setConfig();

    return new Promise<void>((resolve, reject) => {
      const bucketSource: string = this.config.id;
      const fileSource: string = appendRemoveBackslash(
        request.keySource,
        false,
      )!;

      const bucketDestination: string = request.bucketDestination
        ? request.bucketDestination
        : this.config.id;
      const fileDestination: string = appendRemoveBackslash(
        request.keyDestination,
        false,
      )!;

      const params: CopyObjectRequest = {
        Bucket: bucketDestination,
        Key: fileDestination,
        CopySource: encodeURIComponent(`/${bucketSource}/${fileSource}`),
      };
      // this.storage.copyObject(params).promise()

      this.storage.getStorage().copyObject(params, (err, data) => {
        if (err) reject(err);

        resolve();
      });
    });
  }

  getConfig(): NSBucketConfigOptions {
    return this.config;
  }
}
