import serverless from './src/libs/baseServerless';

import f from './functions';
import r from './resources';

module.exports = serverless({
  service: 'calo-nutritionist-planner',
  provider: {
    architecture: 'x86_64',
    timeout: 29,
    apiGateway: {
      metrics: true,
      shouldStartNameWithService: true
    },
    logRetentionInDays: 90,
    tracing: {
      lambda: true,
      apiGateway: true
    },
    logs: {
      restApi: true
    }
  },
  custom: {
    // package: {
    //   patterns: [
    //     '!node_modules/.prisma/client/libquery_engine-*',
    //     'node_modules/.prisma/client/libquery_engine-rhel-*',
    //     '!node_modules/prisma/libquery_engine-*',
    //     '!node_modules/@prisma/engines/**',
    //     'node_modules/.prisma/client/schema.prisma'
    //   ]
    // }
  },
  functions: f,
  resources: r,
});