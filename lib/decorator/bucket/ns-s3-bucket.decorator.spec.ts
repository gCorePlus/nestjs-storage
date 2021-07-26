import { Test } from "@nestjs/testing";

import { NSBucketConfigOptions, NSConfigOptions } from "../../interface";
import { Injectable } from "@nestjs/common";
import { NSStorageModule } from "../../ns-storage.module";
import { NSS3BucketInject } from "./ns-s3-bucket.decorator";
import { NSS3BucketService } from "../../provider";

describe('NSS3BucketInject', () => {

  it('should inject default NSBucket client', async (done) => {
    // default NSConfig
    const BUCKET_A: NSBucketConfigOptions = { id: 'test-nest-storage-a' };
    const BUCKET_B: NSBucketConfigOptions = { id: 'test-nest-storage-b' };
    const BUCKETS: NSBucketConfigOptions[] = [BUCKET_A, BUCKET_B];
    const nsConfig: NSConfigOptions = {
      s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '--- AWS_ACCESS_KEY_ID ---',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '--- AWS_SECRET_ACCESS_KEY ---',
        buckets: BUCKETS
      },
    };

    // Create default Injection Sample
    @Injectable()
    class InjectableService {
      public constructor(@NSS3BucketInject('test-nest-storage-a') public readonly bucket: NSS3BucketService) {}
    }

    // Creating module
    const module = await Test.createTestingModule({
      imports: [NSStorageModule.forRoot(nsConfig)],
      providers: [InjectableService],
    }).compile();

    const testService = module.get(InjectableService);
    expect(testService).toHaveProperty('bucket');
    expect(testService.bucket).toBeInstanceOf(NSS3BucketService);

    done();
  });

  it('should inject custom ID NSBucket client', async (done) => {
    // default NSConfig
    const BUCKET_A: NSBucketConfigOptions = { id: 'test-nest-storage-a' };
    const BUCKET_B: NSBucketConfigOptions = { id: 'test-nest-storage-b' };
    const BUCKETS: NSBucketConfigOptions[] = [BUCKET_A, BUCKET_B];
    const nsConfig: NSConfigOptions = {
      id: 'gCorePlus',
      s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '--- AWS_ACCESS_KEY_ID ---',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '--- AWS_SECRET_ACCESS_KEY ---',
        buckets: BUCKETS
      },
    };

    // Create default Injection Sample
    @Injectable()
    class InjectableService {
      public constructor(@NSS3BucketInject({ storageId: 'gCorePlus', bucketId: 'test-nest-storage-a' }) public readonly bucket: NSS3BucketService) {}
    }

    // Creating module
    const module = await Test.createTestingModule({
      imports: [NSStorageModule.forRoot(nsConfig)],
      providers: [InjectableService],
    }).compile();

    const testService = module.get(InjectableService);
    expect(testService).toHaveProperty('bucket');
    expect(testService.bucket).toBeInstanceOf(NSS3BucketService);

    done();
  });
});
