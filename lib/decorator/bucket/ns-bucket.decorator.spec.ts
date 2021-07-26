import { Test } from "@nestjs/testing";

import { NSBucketConfigOptions, NSConfigOptions } from "../../interface";
import { Injectable } from "@nestjs/common";
import { NSStorageModule } from "../../ns-storage.module";
import { NSGSBucketService, NSS3BucketService } from "../../provider";
import { NSBucketInject } from "./ns-bucket.decorator";
import { ProviderEnum } from "../../common";

describe('NSBucketInject', () => {

  it('should inject default NSGSBucket client', async (done) => {
    // default NSConfig
    const BUCKET_A: NSBucketConfigOptions = { id: 'test-nest-storage-a' };
    const BUCKET_B: NSBucketConfigOptions = { id: 'test-nest-storage-b' };
    const BUCKETS: NSBucketConfigOptions[] = [BUCKET_A, BUCKET_B];
    const nsConfig: NSConfigOptions = {
      gs: {
        projectId: process.env.GS_PROJECT_ID || '--- PROJECT_ID ---',
        keyFilename: process.env.GS_PATH_KEY || '--- PATH_KEY ---',
        buckets: BUCKETS
      },
    };

    // Create default Injection Sample
    @Injectable()
    class InjectableService {
      public constructor(@NSBucketInject({ provider: ProviderEnum.GOOGLE, bucketId: 'test-nest-storage-a' }) public readonly bucket: NSGSBucketService) {}
    }

    // Creating module
    const module = await Test.createTestingModule({
      imports: [NSStorageModule.forRoot(nsConfig)],
      providers: [InjectableService],
    }).compile();

    const testService = module.get(InjectableService);
    expect(testService).toHaveProperty('bucket');
    expect(testService.bucket).toBeInstanceOf(NSGSBucketService);

    done();
  });

  it('should inject custom ID NSS3Bucket client', async (done) => {
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
      public constructor(@NSBucketInject({ provider: ProviderEnum.AWS, bucketId: 'test-nest-storage-a' }) public readonly bucket: NSS3BucketService) {}
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
