import { Inject } from '@nestjs/common';
import { NSService } from '../service/ns.service';

export function NSProvider(key?: string) {
  return Inject(NSService);
}
