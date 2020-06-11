import { NSBucket, NSConfigOptions, NSCreateBucketRequest } from '../interface';
import { Test } from '@nestjs/testing';

import { createStorageToken, NS_PROVIDER } from '../common';
import { NSStorageModule } from '../ns-storage.module';
import { NSService } from './ns.service';
import { createBucketToken } from '../common';
import { NSGSBucket, NSS3Bucket } from '../provider';

describe('NSService', () => {
  const BUCKET_A = { id: 'test-nest-storage-a', name: 'Bucket_A' };
  const BUCKET_B = { id: 'test-nest-storage-b', name: 'Bucket_B' };

  const testFile = {
    name: 'test.txt',
    copy_name: 'test-copy.txt',
    content: 'file contains data to be read after',
  };

  const s3config: NSConfigOptions = {
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '--- KEY ---',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '--- KEY ---',
      buckets: [BUCKET_A, BUCKET_B],
    },
  };

  const gsconfig: NSConfigOptions = {
    gs: {
      projectId: process.env.GS_PROJECT_ID || '--- PROJECT_ID ---',
      keyFilename: process.env.GS_PATH_KEY || '--- PATH_KEY ---',
      buckets: [BUCKET_A, BUCKET_B],
    },
  };

  beforeAll(async (done) => {
    const createBucketByConfig = async (config: NSConfigOptions) => {
      const mod = await Test.createTestingModule({
        imports: [NSStorageModule.forRoot(config)],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();

      const storage = service.getNSStorageByKey(createStorageToken());
      expect(storage).toBeDefined();

      if (!storage) return done(`storage undefined`);

      const promises =
        s3config?.s3?.buckets
          ?.map<NSCreateBucketRequest>((bucket) => ({ Bucket: bucket.id }))
          .map((params) => storage.createBucket(params)) || [];

      await Promise.all(promises);
    };

    try {
      // s3 - create buckets
      await createBucketByConfig(s3config);

      // gs - create buckets
      await createBucketByConfig(gsconfig);

      done();
    } catch (err) {
      done(err);
    }
  });

  describe('general', () => {
    it('should provide the client', async () => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => s3config,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();
    });
  });

  describe('s3', () => {
    it('should list all buckets', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => s3config,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();

      const storage = service.getNSStorageByKey(createStorageToken());
      expect(storage).toBeDefined();

      if (!storage) return done(`storage undefined`);

      await expect(
        storage.getBuckets().then((values) => values.length),
      ).resolves.toBeGreaterThan(0);

      done();
    });

    it('should put file', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => s3config,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();
      expect(service.getNSBuckets().length).toBeGreaterThan(0);

      const bucket: NSBucket | undefined = service.getNSBucketByKey(
        createBucketToken(undefined, BUCKET_A.name),
      );
      expect(bucket).toBeDefined();
      expect(bucket).toBeInstanceOf(NSS3Bucket);

      await expect(
        bucket?.putObject({
          Key: testFile.name,
          Body: 'file contains data to be read after',
        }),
      ).resolves.not.toThrow();

      done();
    });

    it('should download file', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => s3config,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();
      expect(service.getNSBuckets().length).toBeGreaterThan(0);

      const bucket: NSBucket | undefined = service.getNSBucketByKey(
        createBucketToken(undefined, BUCKET_A.name),
      );
      expect(bucket).toBeDefined();
      expect(bucket).toBeInstanceOf(NSS3Bucket);

      const fileContent = await bucket?.getObject(testFile.name);
      expect(fileContent).toBeDefined();
      expect((fileContent as Buffer).toString()).toEqual(
        'file contains data to be read after',
      );

      done();
    });

    it('should copy file into same bucket', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => s3config,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();
      expect(service.getNSBuckets().length).toBeGreaterThan(0);

      const bucket: NSBucket | undefined = service.getNSBucketByKey(
        createBucketToken(undefined, BUCKET_A.name),
      );
      expect(bucket).toBeDefined();
      expect(bucket).toBeInstanceOf(NSS3Bucket);

      const params = {
        KeySource: testFile.name,
        KeyDestination: testFile.copy_name,
      };
      await bucket?.copyObject(params);

      done();
    });

    it('should copy file into another bucket', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => s3config,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();
      expect(service.getNSBuckets().length).toBeGreaterThan(0);

      const bucket: NSBucket | undefined = service.getNSBucketByKey(
        createBucketToken(undefined, BUCKET_A.name),
      );
      expect(bucket).toBeDefined();
      expect(bucket).toBeInstanceOf(NSS3Bucket);

      const params = {
        KeySource: testFile.name,
        KeyDestination: testFile.copy_name,
        BucketDestination: BUCKET_B.id,
      };
      await bucket?.copyObject(params);

      done();
    });

    it('should delete file', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => s3config,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();
      expect(service.getNSBuckets().length).toBeGreaterThan(0);

      const bucket: NSBucket | undefined = service.getNSBucketByKey(
        createBucketToken(undefined, BUCKET_A.name),
      );
      expect(bucket).toBeDefined();
      expect(bucket).toBeInstanceOf(NSS3Bucket);

      await expect(bucket?.deleteObject(testFile.name)).resolves.not.toThrow();

      done();
    });
  });

  describe('gs', () => {
    it('should list all buckets', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => gsconfig,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();

      const storage = service.getNSStorageByKey(createStorageToken());
      expect(storage).toBeDefined();

      if (!storage) return done(`storage undefined`);

      await expect(
        storage.getBuckets().then((values) => values.length),
      ).resolves.toBeGreaterThan(0);

      done();
    });

    it('should put file', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => gsconfig,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();
      expect(service.getNSBuckets().length).toBeGreaterThan(0);

      const bucket: NSBucket | undefined = service.getNSBucketByKey(
        createBucketToken(undefined, BUCKET_A.name),
      );
      expect(bucket).toBeDefined();
      expect(bucket).toBeInstanceOf(NSGSBucket);

      await expect(
        bucket?.putObject({
          Key: testFile.name,
          Body: 'file contains data to be read after',
        }),
      ).resolves.not.toThrow();

      done();
    });

    it('should download file', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => gsconfig,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();
      expect(service.getNSBuckets().length).toBeGreaterThan(0);

      const bucket: NSBucket | undefined = service.getNSBucketByKey(
        createBucketToken(undefined, BUCKET_A.name),
      );
      expect(bucket).toBeDefined();
      expect(bucket).toBeInstanceOf(NSGSBucket);

      const fileContent = await bucket?.getObject(testFile.name);
      expect(fileContent).toBeDefined();
      expect((fileContent as Buffer).toString()).toEqual(
        'file contains data to be read after',
      );

      done();
    });

    it('should copy file into same bucket', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => gsconfig,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();
      expect(service.getNSBuckets().length).toBeGreaterThan(0);

      const bucket: NSBucket | undefined = service.getNSBucketByKey(
        createBucketToken(undefined, BUCKET_A.name),
      );
      expect(bucket).toBeDefined();
      expect(bucket).toBeInstanceOf(NSGSBucket);

      const params = {
        KeySource: testFile.name,
        KeyDestination: testFile.copy_name,
      };
      await bucket?.copyObject(params);

      done();
    });

    it('should copy file into another bucket', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => gsconfig,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();
      expect(service.getNSBuckets().length).toBeGreaterThan(0);

      const bucket: NSBucket | undefined = service.getNSBucketByKey(
        createBucketToken(undefined, BUCKET_A.name),
      );
      expect(bucket).toBeDefined();
      expect(bucket).toBeInstanceOf(NSGSBucket);

      const params = {
        KeySource: testFile.name,
        KeyDestination: testFile.copy_name,
        BucketDestination: BUCKET_B.id,
      };
      await bucket?.copyObject(params);

      done();
    });

    it('should delete file', async (done) => {
      const mod = await Test.createTestingModule({
        imports: [
          NSStorageModule.forRootAsync({
            useFactory: () => gsconfig,
          }),
        ],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();
      expect(service.getNSBuckets().length).toBeGreaterThan(0);

      const bucket: NSBucket | undefined = service.getNSBucketByKey(
        createBucketToken(undefined, BUCKET_A.name),
      );
      expect(bucket).toBeDefined();
      expect(bucket).toBeInstanceOf(NSGSBucket);

      await expect(bucket?.deleteObject(testFile.name)).resolves.not.toThrow();

      done();
    });
  });

  it('should do nothing', () => {});

  afterAll(async (done) => {
    const deleteBucketByConfig = async (config: NSConfigOptions) => {
      const mod = await Test.createTestingModule({
        imports: [NSStorageModule.forRoot(config)],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service).toBeDefined();

      const storage = service.getNSStorageByKey(createStorageToken());
      expect(storage).toBeDefined();

      if (!storage) return done(`storage undefined`);

      const promises =
        s3config?.s3?.buckets?.map((bucket) =>
          storage.deleteBucket(bucket.id),
        ) || [];

      await Promise.all(promises);
    };

    try {
      // s3 - delete buckets`
      await deleteBucketByConfig(s3config);

      // gs - delete buckets
      await deleteBucketByConfig(gsconfig);

      done();
    } catch (err) {
      done(err);
    }
  });
});
