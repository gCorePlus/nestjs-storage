import { NSBucket, NSBucketConfigOptions, NSConfigOptions, NSCreateBucketRequest } from "../interface";
import { Test } from "@nestjs/testing";

import { createS3BucketToken, createS3StorageToken } from "../common";
import { NSStorageModule } from "../ns-storage.module";
import { NSService } from "./ns.service";
import { NSS3BucketService } from "../provider";

describe('NSService - S3', () => {
  const BUCKET_A: NSBucketConfigOptions = { id: 'test-nest-storage-a' };
  const BUCKET_B: NSBucketConfigOptions = { id: 'test-nest-storage-b' };
  const BUCKETS: NSBucketConfigOptions[] = [BUCKET_A, BUCKET_B];

  const testFile = {
    name: 'test.txt',
    copy_name: 'test-copy.txt',
    content: 'file contains data to be read after',
  };

  const nsConfig: NSConfigOptions = {
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '--- AWS_ACCESS_KEY_ID ---',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '--- AWS_SECRET_ACCESS_KEY ---',
      buckets: [BUCKET_A, BUCKET_B],
    },
  };

  beforeAll(async (done) => {
    const createBucketByConfig = async (config: NSConfigOptions) => {
      const module = await Test.createTestingModule({
        imports: [NSStorageModule.forRoot(config)],
      }).compile();

      const service = module.get<NSService>(NSService);
      expect(service).toBeDefined();

      const storage = service.getNSStorageByKey(createS3StorageToken());
      expect(storage).toBeDefined();

      if (!storage) return done(`storage undefined`);

      const promises =
        BUCKETS
          ?.map<NSCreateBucketRequest>((bucket) => ({ bucket: bucket.id }))
          .map((params) => storage.createBucket(params)) || [];

      await Promise.all(promises);
    };

    try {
      // s3 - create buckets
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

      const storage = service.getNSStorageByKey(createS3StorageToken());
      expect(storage).toBeDefined();

      if (!storage) return done(`storage undefined`);

      const promises =
        BUCKETS?.map((bucket) =>
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

    const storage = service.getNSStorageByKey(createS3StorageToken());
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
      createS3BucketToken(),
    );
    expect(bucket).toBeDefined();
    expect(bucket).toBeInstanceOf(NSS3BucketService);

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
      createS3BucketToken(),
    );
    expect(bucket).toBeDefined();
    expect(bucket).toBeInstanceOf(NSS3BucketService);

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
      createS3BucketToken(),
    );
    expect(bucket).toBeDefined();
    expect(bucket).toBeInstanceOf(NSS3BucketService);

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
      createS3BucketToken(),
    );
    expect(bucket).toBeDefined();
    expect(bucket).toBeInstanceOf(NSS3BucketService);

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
      createS3BucketToken(),
    );
    expect(bucket).toBeDefined();
    expect(bucket).toBeInstanceOf(NSS3BucketService);

    await expect(bucket?.deleteObject(testFile.name)).resolves.not.toThrow();

    done();
  });
});
