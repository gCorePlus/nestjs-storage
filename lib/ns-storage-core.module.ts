import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import {
  NSConfigAsyncOptions,
  NSConfigOptions,
  NSConfigOptionsFactory,
} from './interface';
import { NS_CONFIG_OPTIONS } from './common';
import { NSService } from './service/ns.service';

@Global()
@Module({})
export class NSStorageCoreModule {
  public static forRoot(options: NSConfigOptions): DynamicModule {
    const providers: Provider[] = [
      { provide: NS_CONFIG_OPTIONS, useValue: options },
      NSService,
    ];

    return {
      module: NSStorageCoreModule,
      exports: [...providers],
      providers: [...providers],
    };
  }

  public static forRootAsync(options: NSConfigAsyncOptions): DynamicModule {
    return {
      imports: options.imports,
      module: NSStorageCoreModule,
      providers: [...this.createAsyncProviders(options), NSService],
      exports: [NSService],
    };
  }

  private static createAsyncProviders(
    options: NSConfigAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<NSConfigOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: NSConfigAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: NS_CONFIG_OPTIONS,
        useFactory: options.useFactory,
      };
    }
    const inject = [
      (options.useClass || options.useExisting) as Type<NSConfigOptionsFactory>,
    ];
    return {
      provide: NS_CONFIG_OPTIONS,
      useFactory: async (optionsFactory: NSConfigOptionsFactory) =>
        await optionsFactory.createConfigOptions(),
      inject,
    };
  }
}
