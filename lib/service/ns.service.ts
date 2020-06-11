import { Inject, Injectable } from '@nestjs/common';

import { NSBucket, NSConfigOptions, NSStorage } from '../interface';
import {
  createBucketTokenById,
  createBucketTokenByName,
  createStorageTokenById,
  NS_CONFIG_OPTIONS,
} from '../common';
import { NSGSBucket, NSS3Bucket } from '../provider';
import { NSS3Storage } from '../provider/ns-s3-storage.service';
import { NSGSStorage } from '../provider/ns-gs-storage.service';

@Injectable()
export class NSService {
  private readonly storages: Map<string, NSStorage> = new Map<
    string,
    NSStorage
  >();
  private readonly buckets: Map<string, NSBucket> = new Map<string, NSBucket>();

  constructor(
    @Inject(NS_CONFIG_OPTIONS) private readonly config: NSConfigOptions,
  ) {
    if (config) {
      if (config.s3) {
        this.storages.set(
          createStorageTokenById(config),
          new NSS3Storage(config),
        );

        config.s3.buckets?.forEach((bucket) => {
          if (bucket.id) {
            this.buckets.set(
              createBucketTokenById(config, bucket),
              new NSS3Bucket(config, bucket),
            );
          }

          if (bucket.name) {
            this.buckets.set(
              createBucketTokenByName(config, bucket),
              new NSS3Bucket(config, bucket),
            );
          }
        });
      }

      if (config.gs) {
        this.storages.set(
          createStorageTokenById(config),
          new NSGSStorage(config),
        );

        config.gs.buckets?.forEach((bucket) => {
          if (bucket.id) {
            this.buckets.set(
              createBucketTokenById(config, bucket),
              new NSGSBucket(config, bucket),
            );
          }

          if (bucket.name) {
            this.buckets.set(
              createBucketTokenByName(config, bucket),
              new NSGSBucket(config, bucket),
            );
          }
        });
      }
    }
  }

  public getNSStorages(): NSStorage[] {
    return Array.from(this.storages.values());
  }
  public getNSStorageByKey(key: string): NSStorage | undefined {
    return this.storages.get(key);
  }

  public getNSBuckets(): NSBucket[] {
    return Array.from(this.buckets.values());
  }
  public getNSBucketByKey(key: string): NSBucket | undefined {
    return this.buckets.get(key);
  }
}
