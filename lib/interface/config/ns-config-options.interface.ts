import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { NSS3ConfigOptions } from './ns-s3-config-options.interface';
import { NSGSConfigOptions } from './ns-gs-config-options.interface';

export interface NSConfigOptions {
  id?: string;
  s3?: NSS3ConfigOptions;
  gs?: NSGSConfigOptions;
}

export interface NSConfigOptionsFactory {
  createConfigOptions(): Promise<NSConfigOptions> | NSConfigOptions;
}

export interface NSConfigAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<NSConfigOptionsFactory>;
  useExisting?: Type<NSConfigOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<NSConfigOptions> | NSConfigOptions;
}
