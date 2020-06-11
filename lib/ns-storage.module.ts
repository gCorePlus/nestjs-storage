import { DynamicModule } from '@nestjs/common';
import { NSConfigAsyncOptions, NSConfigOptions } from './interface';
import { NSStorageCoreModule } from './ns-storage-core.module';

export class NSStorageModule {
  public static forRoot(options: NSConfigOptions): DynamicModule {
    return {
      module: NSStorageModule,
      imports: [NSStorageCoreModule.forRoot(options)],
    };
  }

  public static forRootAsync(options: NSConfigAsyncOptions): DynamicModule {
    return {
      module: NSStorageModule,
      imports: [NSStorageCoreModule.forRootAsync(options)],
    };
  }
}
