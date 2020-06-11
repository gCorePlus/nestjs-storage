import { Readable } from 'stream';

export type NSBody = Buffer | Uint8Array | Blob | string | Readable;

export interface NSPutObjectRequest {
  Key: string;
  Body: NSBody;
  ACL?: string;
  Metadata?: { [key: string]: string };
}

export interface NSCopyObjectRequest {
  KeySource: string;
  KeyDestination: string;
  BucketDestination?: string;
}

export interface NSBucket {
  getObject(file: string): Promise<NSBody>;
  putObject(data: NSPutObjectRequest): Promise<void>;
  deleteObject(file: string): Promise<void>;
  copyObject(copyObjectRequest: NSCopyObjectRequest): Promise<void>;
}
