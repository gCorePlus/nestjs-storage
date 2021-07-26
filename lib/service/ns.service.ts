import { Injectable } from "@nestjs/common";

import { NSBucket, NSStorage } from "../interface";

@Injectable()
export class NSService {

  private storagesMap: Map<string, NSStorage> = new Map<string, NSStorage>();
  private bucketsMap: Map<string, NSBucket> = new Map<string, NSBucket>();

  constructor(private storages: NSStorage[], private buckets: NSBucket[]) {
    if (storages) {
      storages.forEach(storage => {
        if (storage.getConfig()?.id) {
          this.storagesMap.set(<string>storage.getConfig().id, storage);
        }
      });
    }

    if (buckets) {
      buckets.forEach(bucket => {
        if (bucket.getConfig()?.id) {
          this.bucketsMap.set(<string>bucket.getConfig().id, bucket);
        }
      });
    }
  }

  public getNSStorages(): NSStorage[] {
    return Array.from(this.storagesMap.values());
  }

  public getNSStorageByKey(key: string): NSStorage | undefined {
    return this.storagesMap.get(key);
  }

  public getNSBuckets(): NSBucket[] {
    return Array.from(this.bucketsMap.values());
  }
  public getNSBucketByKey(key: string): NSBucket | undefined {
    return this.bucketsMap.get(key);
  }
}
