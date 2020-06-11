import { Test, TestingModule } from '@nestjs/testing';

import { NSConfigOptions } from '../interface';
import { Injectable } from '@nestjs/common';
import { NSProvider } from './ns-provider.decorator';
import { NSStorageModule } from '../ns-storage.module';

import { NSService } from '../service/ns.service';

describe('InjectS3', () => {
  const config: NSConfigOptions = {
    s3: {
      accessKeyId: '---your access key---',
      secretAccessKey: '---your secret access key---',
    },
  };
  let module: TestingModule;

  @Injectable()
  class InjectableService {
    public constructor(@NSProvider() public readonly client: NSService) {}
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [NSStorageModule.forRoot(config)],
      providers: [InjectableService],
    }).compile();
  });

  describe('when decorating a class constructor parameter', () => {
    it('should inject the s3 client', () => {
      const testService = module.get(InjectableService);
      expect(testService).toHaveProperty('client');
      expect(testService.client).toBeInstanceOf(NSService);
    });
  });
});
