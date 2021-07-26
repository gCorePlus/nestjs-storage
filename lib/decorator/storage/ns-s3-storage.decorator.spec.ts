import { Test } from "@nestjs/testing";

import { NSBucketConfigOptions, NSConfigOptions } from "../../interface";
import { Injectable } from "@nestjs/common";
import { NSStorageModule } from "../../ns-storage.module";
import { NSS3StorageInject } from "./ns-s3-storage.decorator";
import { NSS3StorageService } from "../../provider/ns-s3-storage.service";

describe('NSS3StorageInject', () => {

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
      public constructor(@NSS3StorageInject() public readonly storage: NSS3StorageService) {}
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

  it('should inject custom ID NSS3Storage client with string config', async (done) => {
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
      public constructor(@NSS3StorageInject('gCorePlus') public readonly storage: NSS3StorageService) {}
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

  it('should inject custom ID NSS3Storage client with object config', async (done) => {
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
      public constructor(@NSS3StorageInject({ storageId: 'gCorePlus' }) public readonly storage: NSS3StorageService) {}
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
