import { Test } from "@nestjs/testing";

import { NSStorageModule } from "./ns-storage.module";
import { NSBucketConfigOptions, NSConfigOptions, NSConfigOptionsFactory } from "./interface";
import { NSService } from "./service/";
import { NS_PROVIDER } from "./common";

describe('NSModule - GS', () => {
  const BUCKET_01: NSBucketConfigOptions = { id: 'bucket01' };
  const BUCKET_02: NSBucketConfigOptions = {
    id: 'bucket02'
  };

  const nsConfig: NSConfigOptions = {
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '--- AWS_ACCESS_KEY_ID ---',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '--- AWS_SECRET_ACCESS_KEY ---',
      apiVersion: '2006-03-01',
      sessionToken: undefined,
      buckets: [BUCKET_01, BUCKET_02],
    },
  };


  class S3TestService implements NSConfigOptionsFactory {
    createConfigOptions(): NSConfigOptions {
      return nsConfig;
    }
  }

  describe('forRoot', () => {
    it('should provide the entry provider client', async () => {
      const mod = await Test.createTestingModule({
        imports: [NSStorageModule.forRoot(nsConfig)],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(NSService);
      expect(service.getNSBuckets().length).toEqual(3);
    });

    it('should with 3 buckets', async () => {
      const mod = await Test.createTestingModule({
        imports: [NSStorageModule.forRoot(nsConfig)],
      }).compile();

      const service = mod.get<NSService>(NS_PROVIDER);
      expect(service.getNSBuckets().length).toEqual(3);
    });
  });

  describe('forRootAsync', () => {
    describe('when the `useFactory` option is used', () => {
      it('should provide provider client', async () => {
        const mod = await Test.createTestingModule({
          imports: [
            NSStorageModule.forRootAsync({
              useFactory: () => nsConfig,
            }),
          ],
        }).compile();

        const service = await mod.resolve<NSService>(NS_PROVIDER);
        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(NSService);
        // expect(service.getNSBuckets().length).toEqual(3);


        // const bla = await mod.resolve('BLA_TOKEN');
        // console.log(bla);
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
});
