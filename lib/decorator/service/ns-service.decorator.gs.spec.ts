import { Test } from '@nestjs/testing';

import { NSConfigOptions } from '../../interface';
import { Injectable } from '@nestjs/common';
import { NSServiceInject } from './ns-service.decorator';
import { NSStorageModule } from '../../ns-storage.module';

import { NSService } from '../../service';

describe('NSServiceInject - GS', () => {

  it('should inject default NSService client', async (done) => {
    // default NSConfig
    const nsConfig: NSConfigOptions = {
      gs: {
        projectId: process.env.GS_PROJECT_ID || '--- PROJECT_ID ---',
        keyFilename: process.env.GS_PATH_KEY || '--- PATH_KEY ---',
      },
    };

    // Create default Injection Sample
    @Injectable()
    class InjectableService {
      public constructor(@NSServiceInject() public readonly client: NSService) {}
    }

    // Creating module
    const module = await Test.createTestingModule({
      imports: [NSStorageModule.forRoot(nsConfig)],
      providers: [InjectableService],
    }).compile();

    const testService = module.get(InjectableService);
    expect(testService).toHaveProperty('client');
    expect(testService.client).toBeInstanceOf(NSService);

    done();
  });

  it('should inject custom ID NSService client', async (done) => {
    // custom NSConfig
    const nsConfig: NSConfigOptions = {
      id: 'gCorePlus',
      gs: {
        projectId: process.env.GS_PROJECT_ID || '--- PROJECT_ID ---',
        keyFilename: process.env.GS_PATH_KEY || '--- PATH_KEY ---',
      },
    };

    // Create default Injection Sample
    @Injectable()
    class InjectableService {
      public constructor(@NSServiceInject('gCorePlus') public readonly client: NSService) {}
    }

    // Creating module
    const module = await Test.createTestingModule({
      imports: [NSStorageModule.forRoot(nsConfig)],
      providers: [InjectableService],
    }).compile();

    const testService = module.get(InjectableService);
    expect(testService).toHaveProperty('client');
    expect(testService.client).toBeInstanceOf(NSService);

    done();
  });
});
