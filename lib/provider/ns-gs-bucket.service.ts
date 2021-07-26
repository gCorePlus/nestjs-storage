import { NSBody, NSBucket, NSBucketConfigOptions, NSCopyObjectRequest, NSPutObjectRequest } from "../interface";
import { Bucket } from "@google-cloud/storage";
import { File } from "@google-cloud/storage/build/src/file";
import { NSGSStorageService } from "./ns-gs-storage.service";

export class NSGSBucketService implements NSBucket {

  private readonly bucket: Bucket;

  constructor(
    private readonly storage: NSGSStorageService,
    private readonly config: NSBucketConfigOptions,
  ) {
    this.bucket = this.storage.getStorage().bucket(this.config.id);
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
      const file: File = this.bucket.file(data.file);
      const stream = file.createWriteStream();

      stream.on('error', reject);

      stream.on('finish', () => {
        resolve();
      });

      stream.end(data.body);
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
    const bucketDestination: Bucket = request.bucketDestination
      ? this.storage.getStorage().bucket(request.bucketDestination)
      : this.bucket;
    const fileDestination: File = bucketDestination.file(
      request.keyDestination,
    );

    return new Promise((resolve, reject) => {
      this.bucket
        .file(request.keySource)
        .copy(fileDestination)
        .then(() => resolve())
        .catch(reject);
    });
  }

  getConfig(): NSBucketConfigOptions {
    return this.config;
  }
}
