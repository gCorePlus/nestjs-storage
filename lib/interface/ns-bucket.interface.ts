import { Readable } from 'stream';
import { NSBucketConfigOptions } from "./config/ns-bucket-config-options.interface";

export type NSBody = Buffer | Uint8Array | Blob | string | Readable;

export interface NSPutObjectRequest {
  file: string;
  body: NSBody;
  acl?: string;
  metadata?: { [key: string]: string };
}

export interface NSCopyObjectRequest {
  keySource: string;
  keyDestination: string;
  bucketDestination?: string;
}

export interface NSBucket {
  getObject(file: string): Promise<NSBody>;
  putObject(data: NSPutObjectRequest): Promise<void>;
  deleteObject(file: string): Promise<void>;
  copyObject(copyObjectRequest: NSCopyObjectRequest): Promise<void>;

  getConfig(): NSBucketConfigOptions;
}
