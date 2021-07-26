import { Test } from "@nestjs/testing";

import { NSBucketConfigOptions, NSConfigOptions } from "../../interface";
import { Injectable } from "@nestjs/common";
import { NSStorageModule } from "../../ns-storage.module";
import { NSStorageInject, ProviderEnum } from "../../common";
import { NSGSStorageService } from "../../provider/ns-gs-storage.service";
import { NSS3StorageService } from "../../provider/ns-s3-storage.service";

describe('NSStorageInject', () => {

  it('should inject default NSGSStorage client', async (done) => {
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
      public constructor(@NSStorageInject({ provider: ProviderEnum.GOOGLE }) public readonly storage: NSGSStorageService) {}
    }

    // Creating module
    const module = await Test.createTestingModule({
      imports: [NSStorageModule.forRoot(nsConfig)],
      providers: [InjectableService],
    }).compile();

    const testService = module.get(InjectableService);
    expect(testService).toHaveProperty('storage');
    expect(testService.storage).toBeInstanceOf(NSGSStorageService);

    done();
  });

  it('should inject default NSS3Storage client', async (done) => {
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
      public constructor(@NSStorageInject({ provider: ProviderEnum.AWS }) public readonly storage: NSS3StorageService) {}
    }

    // Creating module
    const module = await Test.createTestingModule({
      imports: [NSStorageModule.forRoot(nsConfig)],
      providers: [InjectableService],
    }).compile();

    const testService = module.get(InjectableService);
    expect(testService).toHaveProperty('storage');
    expect(testService.storage).toBeInstanceOf(NSS3StorageService);

    done();
  });
});
