import { Test } from "@nestjs/testing";

import { NSConfigOptions } from "../../interface";
import { Injectable } from "@nestjs/common";
import { NSServiceInject } from "./ns-service.decorator";
import { NSStorageModule } from "../../ns-storage.module";

import { NSService } from "../../service";

describe('NSServiceInject - S3', () => {

  it('should inject default NSService client', async (done) => {
    // default NSConfig
    const nsConfig: NSConfigOptions = {
      s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '--- AWS_ACCESS_KEY_ID ---',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '--- AWS_SECRET_ACCESS_KEY ---',
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
      s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '--- AWS_ACCESS_KEY_ID ---',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '--- AWS_SECRET_ACCESS_KEY ---',
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
