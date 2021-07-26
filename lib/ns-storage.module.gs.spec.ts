import { Test } from "@nestjs/testing";

import { NSStorageModule } from "./ns-storage.module";
import { NSBucketConfigOptions, NSConfigOptions, NSConfigOptionsFactory } from "./interface";
import { NSService } from "./service/";
import { NS_PROVIDER } from "./common";

describe('NSModule', () => {
  const BUCKET_01: NSBucketConfigOptions = { id: 'bucket01' };
  const BUCKET_02: NSBucketConfigOptions = {
    id: 'bucket02'
  };

  const nsConfig: NSConfigOptions = {
    gs: {
      projectId: '<project_id>',
      keyFile: '',
      buckets: [BUCKET_01, BUCKET_02],
    },
  };

  class GSTestService implements NSConfigOptionsFactory {
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

    it('provide with 3 buckets', async () => {
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
