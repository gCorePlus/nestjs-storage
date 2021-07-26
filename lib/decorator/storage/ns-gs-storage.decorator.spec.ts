import { Test } from "@nestjs/testing";

import { NSBucketConfigOptions, NSConfigOptions } from "../../interface";
import { Injectable } from "@nestjs/common";
import { NSStorageModule } from "../../ns-storage.module";
import { NSGSStorageInject } from "./ns-gs-storage.decorator";
import { NSGSStorageService } from "../../provider/ns-gs-storage.service";

describe('NSGSStorageInject', () => {

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
      public constructor(@NSGSStorageInject() public readonly storage: NSGSStorageService) {}
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

  it('should inject custom ID NSGSStorage client with string config', async (done) => {
    // default NSConfig
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
      public constructor(@NSGSStorageInject('gCorePlus') public readonly storage: NSGSStorageService) {}
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

  it('should inject custom ID NSGSStorage client with object config', async (done) => {
    // default NSConfig
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
      public constructor(@NSGSStorageInject({ storageId: 'gCorePlus' }) public readonly storage: NSGSStorageService) {}
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
});
