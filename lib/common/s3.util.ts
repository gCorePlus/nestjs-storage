import { NSS3ConfigOptions } from '../interface/config/ns-s3-config-options.interface';

import * as AWS from 'aws-sdk/global';
import * as https from 'https';

export const setupS3GlobalConfig = (options: NSS3ConfigOptions) => {

  if (options.accessKeyId && options.secretAccessKey) {
    AWS.config.update({
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
      sessionToken: options.sessionToken,
      region: options.region,
    });

    if (options.maxSockets) {
      AWS.config.update({
        httpOptions: {
          agent: new https.Agent({
            maxSockets: options.maxSockets,
          }),
        },
      });
    }
  }
};
