import { Test } from '@nestjs/testing';

import { NSStorageModule } from './ns-storage.module';
import {
  NSBucketConfigOptions,
  NSConfigOptions,
  NSConfigOptionsFactory,
} from './interface';
import { NSService } from './service/ns.service';
import { NS_PROVIDER } from './common';

describe('NSModule', () => {
  const BUCKET_01: NSBucketConfigOptions = { id: 'bucket01' };
  const BUCKET_02: NSBucketConfigOptions = {
    id: 'bucket02',
    name: 'BucketName_01',
  };

  const s3config: NSConfigOptions = {
    s3: {
      accessKeyId: '---your access key---',
      secretAccessKey: '---your secret access key---',
      apiVersion: '2006-03-01',
      sessionToken: undefined,
      buckets: [BUCKET_01, BUCKET_02],
    },
  };

  const gsconfig: NSConfigOptions = {
    gs: {
      projectId: '<project_id>',
      keyFile: '',
      buckets: [BUCKET_01, BUCKET_02],
    },
  };

  class S3TestService implements NSConfigOptionsFactory {
    createConfigOptions(): NSConfigOptions {
      return s3config;
    }
  }

  class GSTestService implements NSConfigOptionsFactory {
    createConfigOptions(): NSConfigOptions {
      return gsconfig;
    }
  }

  describe('forRoot', () => {
    describe('S3', () => {
      it('should provide the entry provider client', async () => {
        const mod = await Test.createTestingModule({
          imports: [NSStorageModule.forRoot(s3config)],
        }).compile();

        const service = mod.get<NSService>(NS_PROVIDER);

        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(NSService);
        expect(service.getNSBuckets().length).toEqual(3);
      });

      it('should with 3 buckets', async () => {
        const mod = await Test.createTestingModule({
          imports: [NSStorageModule.forRoot(s3config)],
        }).compile();

        const service = mod.get<NSService>(NS_PROVIDER);
        expect(service.getNSBuckets().length).toEqual(3);
      });
    });

    describe('GS', () => {
      it('should provide the entry provider client', async () => {
        const mod = await Test.createTestingModule({
          imports: [NSStorageModule.forRoot(gsconfig)],
        }).compile();

        const service = mod.get<NSService>(NS_PROVIDER);

        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(NSService);
        expect(service.getNSBuckets().length).toEqual(3);
      });

      it('provide with 3 buckets', async () => {
        const mod = await Test.createTestingModule({
          imports: [NSStorageModule.forRoot(gsconfig)],
        }).compile();

        const service = mod.get<NSService>(NS_PROVIDER);
        expect(service.getNSBuckets().length).toEqual(3);
      });
    });
  });

  describe('forRootAsync', () => {
    describe('S3', () => {
      describe('when the `useFactory` option is used', () => {
        it('should provide provider client', async () => {
          const mod = await Test.createTestingModule({
            imports: [
              NSStorageModule.forRootAsync({
                useFactory: () => s3config,
              }),
            ],
          }).compile();

          const service = mod.get<NSService>(NS_PROVIDER);
          expect(service).toBeDefined();
          expect(service).toBeInstanceOf(NSService);
          expect(service.getNSBuckets().length).toEqual(3);
        });
      });

      describe('when the `useClass` option is used', () => {
        it('should provide the S3 client', async () => {
          const mod = await Test.createTestingModule({
            imports: [
              NSStorageModule.forRootAsync({
                useClass: S3TestService,
              }),
            ],
          }).compile();

          const service = mod.get<NSService>(NS_PROVIDER);
          expect(service).toBeDefined();
          expect(service).toBeInstanceOf(NSService);
          expect(service.getNSBuckets().length).toEqual(3);
        });
      });
    });

    describe('GS', () => {
      describe('when the `useFactory` option is used', () => {
        it('should provide provider client', async () => {
          const mod = await Test.createTestingModule({
            imports: [
              NSStorageModule.forRootAsync({
                useFactory: () => gsconfig,
              }),
            ],
          }).compile();

          const service = mod.get<NSService>(NS_PROVIDER);
          expect(service).toBeDefined();
          expect(service).toBeInstanceOf(NSService);
          expect(service.getNSBuckets().length).toEqual(3);
        });
      });

      describe('when the `useClass` option is used', () => {
        it('should provide the GS client', async () => {
          const mod = await Test.createTestingModule({
            imports: [
              NSStorageModule.forRootAsync({
                useClass: GSTestService,
              }),
            ],
          }).compile();

          const service = mod.get<NSService>(NS_PROVIDER);
          expect(service).toBeDefined();
          expect(service).toBeInstanceOf(NSService);
          expect(service.getNSBuckets().length).toEqual(3);
        });
      });
    });
  });
});
