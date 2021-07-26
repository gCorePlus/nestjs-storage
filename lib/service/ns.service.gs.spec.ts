import { NSBucket, NSBucketConfigOptions, NSConfigOptions, NSCreateBucketRequest } from "../interface";
import { Test } from "@nestjs/testing";

import { createGSBucketToken, createGSStorageToken } from "../common";
import { NSStorageModule } from "../ns-storage.module";
import { NSService } from "./ns.service";
import { NSGSBucketService } from "../provider";

describe('NSService - GS', () => {
  const BUCKET_A: NSBucketConfigOptions = { id: 'test-nest-storage-a' };
  const BUCKET_B: NSBucketConfigOptions = { id: 'test-nest-storage-b' };
  const BUCKETS: NSBucketConfigOptions[] = [BUCKET_A, BUCKET_B];

  const testFile = {
    name: 'test.txt',
    copy_name: 'test-copy.txt',
    content: 'file contains data to be read after',
  };

  const nsConfig: NSConfigOptions = {
    gs: {
      projectId: process.env.GS_PROJECT_ID || '--- PROJECT_ID ---',
      keyFilename: process.env.GS_PATH_KEY || '--- PATH_KEY ---',
      buckets: BUCKETS,
    },
  };

  beforeAll(async (done) => {
    const createBucketByConfig = async (config: NSConfigOptions) => {
      const module = await Test.createTestingModule({
        imports: [NSStorageModule.forRoot(config)],
      }).compile();

      const service = module.get<NSService>(NSService);
      expect(service).toBeDefined();

      const storage = service.getNSStorageByKey(createGSStorageToken());
      expect(storage).toBeDefined();

      if (!storage) return done(`storage undefined`);

      const promises =
        BUCKETS
          ?.map<NSCreateBucketRequest>((bucket) => ({ bucket: bucket.id }))
          .map((params) => storage.createBucket(params)) || [];

      await Promise.all(promises);
    };

    try {
      // gs - create buckets
      await createBucketByConfig(nsConfig);

      done();
    } catch (err) {
      done(err);
    }
  });

  afterAll(async (done) => {
    const deleteBucketByConfig = async (config: NSConfigOptions) => {
      const module = await Test.createTestingModule({
        imports: [NSStorageModule.forRoot(config)],
      }).compile();

      const service = module.get<NSService>(NSService);
      expect(service).toBeDefined();

      const storage = service.getNSStorageByKey(createGSStorageToken());
      expect(storage).toBeDefined();

      if (!storage) return done(`storage undefined`);

      const promises =
        BUCKETS.map((bucket) =>
          storage.deleteBucket(bucket.id),
        ) || [];

      await Promise.all(promises);
    };

    try {
      // gs - delete buckets
      await deleteBucketByConfig(nsConfig);

      done();
    } catch (err) {
      done(err);
    }
  });

  it('should list all buckets', async (done) => {
    const module = await Test.createTestingModule({
      imports: [
        NSStorageModule.forRootAsync({
          useFactory: () => nsConfig,
        }),
      ],
    }).compile();

    const service = module.get<NSService>(NSService);
    expect(service).toBeDefined();

    const storage = service.getNSStorageByKey(createGSStorageToken());
    expect(storage).toBeDefined();

    if (!storage) return done(`storage undefined`);

    await expect(
      storage.getBuckets().then((values) => values.length),
    ).resolves.toBeGreaterThan(0);

    done();
  });

  it('should put file', async (done) => {
    const module = await Test.createTestingModule({
      imports: [
        NSStorageModule.forRootAsync({
          useFactory: () => nsConfig,
        }),
      ],
    }).compile();

    const service = module.get<NSService>(NSService);
    expect(service).toBeDefined();
    expect(service.getNSBuckets().length).toBeGreaterThan(0);

    const bucket: NSBucket | undefined = service.getNSBucketByKey(
      createGSBucketToken(),
    );
    expect(bucket).toBeDefined();
    expect(bucket).toBeInstanceOf(NSGSBucketService);

    await expect(
      bucket?.putObject({
        file: testFile.name,
        body: 'file contains data to be read after',
      }),
    ).resolves.not.toThrow();

    done();
  });

  it('should download file', async (done) => {
    const module = await Test.createTestingModule({
      imports: [
        NSStorageModule.forRootAsync({
          useFactory: () => nsConfig,
        }),
      ],
    }).compile();

    const service = module.get<NSService>(NSService);
    expect(service).toBeDefined();
    expect(service.getNSBuckets().length).toBeGreaterThan(0);

    const bucket: NSBucket | undefined = service.getNSBucketByKey(
      createGSBucketToken(),
    );
    expect(bucket).toBeDefined();
    expect(bucket).toBeInstanceOf(NSGSBucketService);

    const fileContent = await bucket?.getObject(testFile.name);
    expect(fileContent).toBeDefined();
    expect((fileContent as Buffer).toString()).toEqual(
      'file contains data to be read after',
    );

    done();
  });

  it('should copy file into same bucket', async (done) => {
    const module = await Test.createTestingModule({
      imports: [
        NSStorageModule.forRootAsync({
          useFactory: () => nsConfig,
        }),
      ],
    }).compile();

    const service = module.get<NSService>(NSService);
    expect(service).toBeDefined();
    expect(service.getNSBuckets().length).toBeGreaterThan(0);

    const bucket: NSBucket | undefined = service.getNSBucketByKey(
      createGSBucketToken(),
    );
    expect(bucket).toBeDefined();
    expect(bucket).toBeInstanceOf(NSGSBucketService);

    const params = {
      keySource: testFile.name,
      keyDestination: testFile.copy_name,
    };
    await bucket?.copyObject(params);

    done();
  });

  it('should copy file into another bucket', async (done) => {
    const module = await Test.createTestingModule({
      imports: [
        NSStorageModule.forRootAsync({
          useFactory: () => nsConfig,
        }),
      ],
    }).compile();

    const service = module.get<NSService>(NSService);
    expect(service).toBeDefined();
    expect(service.getNSBuckets().length).toBeGreaterThan(0);

    const bucket: NSBucket | undefined = service.getNSBucketByKey(
      createGSBucketToken(),
    );
    expect(bucket).toBeDefined();
    expect(bucket).toBeInstanceOf(NSGSBucketService);

    const params = {
      keySource: testFile.name,
      keyDestination: testFile.copy_name,
      BucketDestination: BUCKET_B.id,
    };
    await bucket?.copyObject(params);

    done();
  });

  it('should delete file', async (done) => {
    const module = await Test.createTestingModule({
      imports: [
        NSStorageModule.forRootAsync({
          useFactory: () => nsConfig,
        }),
      ],
    }).compile();

    const service = module.get<NSService>(NSService);
    expect(service).toBeDefined();
    expect(service.getNSBuckets().length).toBeGreaterThan(0);

    const bucket: NSBucket | undefined = service.getNSBucketByKey(
      createGSBucketToken(),
    );
    expect(bucket).toBeDefined();
    expect(bucket).toBeInstanceOf(NSGSBucketService);

    await expect(bucket?.deleteObject(testFile.name)).resolves.not.toThrow();

    done();
  });
});
