import {
  NSBucket,
  NSBucketConfigOptions,
  NSConfigOptions,
  NSBody,
  NSPutObjectRequest,
  NSCopyObjectRequest,
} from '../interface';
import { Bucket, Storage } from '@google-cloud/storage';
import { File } from '@google-cloud/storage/build/src/file';

export class NSGSBucket implements NSBucket {
  private storage: Storage;
  private bucket: Bucket;

  constructor(
    private readonly config: NSConfigOptions,
    private readonly bucketOpts: NSBucketConfigOptions,
  ) {
    this.storage = new Storage(config.gs);
    this.bucket = this.storage.bucket(this.bucketOpts.id);
  }

  public getObject(file: string): Promise<NSBody> {
    return new Promise<NSBody>((resolve, reject) => {
      this.bucket
        .file(file)
        .download()
        .then((buffers) => resolve(buffers[0]))
        .catch(reject);
    });
  }

  putObject(data: NSPutObjectRequest): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const file: File = this.bucket.file(data.Key);
      const stream = file.createWriteStream();

      stream.on('error', reject);

      stream.on('finish', () => {
        resolve();
      });

      stream.end(data.Body);
    });
  }

  deleteObject(file: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.bucket
        .file(file)
        .delete()
        .then(() => resolve())
        .catch(reject);
    });
  }

  copyObject(request: NSCopyObjectRequest): Promise<void> {
    const bucketDestination: Bucket = request.BucketDestination
      ? this.storage.bucket(request.BucketDestination)
      : this.bucket;
    const fileDestination: File = bucketDestination.file(
      request.KeyDestination,
    );

    return new Promise((resolve, reject) => {
      this.bucket
        .file(request.KeySource)
        .copy(fileDestination)
        .then(() => resolve())
        .catch(reject);
    });
  }
}
