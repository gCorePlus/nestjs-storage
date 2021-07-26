import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";
import { NSConfigAsyncOptions, NSConfigOptions, NSConfigOptionsFactory } from "./interface";
import {
  createGSBucketToken,
  createGSStorageToken, createNSServiceToken,
  createS3BucketToken,
  createS3StorageToken, DEFAULT,
  isNSBucket,
  isNSStorage,
  NS_CONFIG_OPTIONS
} from "./common";

import { NSService } from "./service/";
import { NSS3StorageService } from "./provider/ns-s3-storage.service";
import { NSGSStorageService } from "./provider/ns-gs-storage.service";
import { ValueProvider } from "@nestjs/common/interfaces/modules/provider.interface";

@Global()
@Module({})
export class NSStorageCoreModule {

  public static forRoot(options: NSConfigOptions): DynamicModule {
    const providers: Provider[] = [
      { provide: NS_CONFIG_OPTIONS, useValue: options },
      ...this.createProviders(options),
    ];

    return {
      module: NSStorageCoreModule,
      exports: [...providers],
      providers: [...providers],
    };
  }

  public static forRootAsync(options: NSConfigAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      ...this.createAsyncProviders(options),
      ...this.createProviders()
    ];

    return {
      imports: options.imports,
      module: NSStorageCoreModule,
      exports: [...providers],
      providers: [...providers],
    };
  }

  static createProviders(options?: NSConfigOptions): Provider[] {
    let providers: Provider[] = [];

    // Creating custom providers
    if (options) {

      if (options.s3) {
        options.s3.id = options.id || DEFAULT;
        const storage = new NSS3StorageService(options.s3);
        providers.push({
          provide: createS3StorageToken(options),
          useValue: storage
        });

        if (storage.getNSBuckets()) {
          providers.push(
            ...storage.getNSBuckets().map<Provider>( nsbucket => ({
              provide: createS3BucketToken(storage.getConfig(), nsbucket.getConfig()),
              useValue: nsbucket
            }))
          );
        }
      }

      if (options.gs) {
        options.gs.id = options.id || DEFAULT;
        const storage = new NSGSStorageService(options.gs);
        providers.push({
          provide: createGSStorageToken(options),
          useValue: storage
        });

        if (storage.getNSBuckets()) {
          providers.push(
            ...storage.getNSBuckets().map<Provider>( nsbucket => ({
              provide: createGSBucketToken(storage.getConfig(), nsbucket.getConfig()),
              useValue: nsbucket
            }))
          );
        }
      }
    }

    const storages = providers
      .filter(provider => isNSStorage((provider as ValueProvider).provide as string))
      .map(provider => (provider as ValueProvider).useValue)
    ;
    const buckets = providers
      .filter(provider => isNSBucket((provider as ValueProvider).provide as string))
      .map(provider => (provider as ValueProvider).useValue)
    ;
    providers.push({
      provide: createNSServiceToken(options?.id),
      useValue: new NSService(storages, buckets)
    });

    return providers;
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
