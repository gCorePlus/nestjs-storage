import { Test } from "@nestjs/testing";

import { NSBucketConfigOptions, NSConfigOptions } from "../../interface";
import { Injectable } from "@nestjs/common";
import { NSStorageModule } from "../../ns-storage.module";

import { NSGSBucketInject } from "./ns-gs-bucket.decorator";
import { NSGSBucketService } from "../../provider";

describe('NSGSBucketInject', () => {

  it('should inject default NSBucket client', async (done) => {
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
      public constructor(@NSGSBucketInject('test-nest-storage-a' ) public readonly bucket: NSGSBucketService) {}
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

  it('should inject custom ID NSBucket client', async (done) => {
    // custom NSConfig
    const BUCKET_A: NSBucketConfigOptions = { id: 'test-nest-storage-a' };
    const BUCKET_B: NSBucketConfigOptions = { id: 'test-nest-storage-b' };
    const BUCKETS: NSBucketConfigOptions[] = [BUCKET_A, BUCKET_B];
    const nsConfig: NSConfigOptions = {
      id: 'gCorePlus',
      gs: {
        projectId: process.env.GS_PROJECT_ID || '--- PROJECT_ID ---',
        keyFilename: process.env.GS_PATH_KEY || '--- PATH_KEY ---',
        buckets: BUCKETS
      },
    };

    // Create default Injection Sample
    @Injectable()
    class InjectableService {
      public constructor(@NSGSBucketInject({ storageId: 'gCorePlus', bucketId: 'test-nest-storage-a' }) public readonly bucket: NSGSBucketService) {}
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
});
