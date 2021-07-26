import { Inject } from "@nestjs/common";
import { createNSServiceToken } from "../../common";

export function NSServiceInject(key?: string) {
  return Inject(createNSServiceToken(key));
}
