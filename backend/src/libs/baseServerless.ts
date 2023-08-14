import type { AWS } from '@serverless/typescript';
import { default as merge } from 'lodash/merge.js';
import yml from 'js-yaml';
import { readFileSync } from 'fs';

type Params = Omit<AWS, 'package' | 'provider' | 'functions' | 'resources' | 'plugins'> & {
  provider: Omit<AWS['provider'], 'name'> & {
    name?: never;
    stage?: never;
    versionFunctions?: never;
    variableSyntax?: never;
    environment?: AWS['provider']['environment'] & {
      STAGE?: never;
      AWS_NODEJS_CONNECTION_REUSE_ENABLED?: never;
      NODE_OPTIONS?: never;
    }
  };
  functions?: AWS['functions'] | string[];
  resources?: AWS['resources'] | string[];
  plugins?: string[];
}

export default ({ functions, resources, plugins, ...rest }: Params): AWS => merge<Partial<AWS>, Params>({
  plugins: [
    ...new Set([
      'serverless-esbuild',
      'serverless-iam-roles-per-function',
      ...(plugins ||[])
    ])
  ],
  package: {
    individually: true
  },
  custom: {
    defaultStage: 'dev',
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      sourcesContent: false,
      exclude: [
        'aws-sdk'
      ],
      target: 'node16',
      platform: 'node',
      concurrency: 10
    }
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    stage: '${opt:stage, self:custom.defaultStage}',
    versionFunctions: false,
    environment: {
      STAGE: '${sls:stage}',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      IS_PROD: {
        'Fn::If': ['IS_PROD', 'true', 'false']
      },
      IS_DEV: {
        'Fn::If': ['IS_DEV', 'true', 'false']
      },

      POWERTOOLS_SERVICE_NAME: '${self:service}',
      LOG_LEVEL: {
        'Fn::If': ['IS_PROD', 'ERROR', 'INFO']
      },
      POWERTOOLS_LOGGER_LOG_EVENT: {
        'Fn::If': ['IS_PROD', 'false', 'true']
      },
      POWERTOOLS_LOGGER_SAMPLE_RATE: {
        'Fn::If': ['IS_PROD', '0.25', '1']
      },

      POWERTOOLS_TRACE_ENABLED: 'true',
      POWERTOOLS_TRACER_CAPTURE_HTTPS_REQUESTS: 'true',
      POWERTOOLS_TRACER_CAPTURE_RESPONSE: 'true',
      POWERTOOLS_TRACER_CAPTURE_ERROR: 'true',
      POWERTOOLS_METRICS_NAMESPACE: 'Calo'
    },
    tags: {
      'service-name': '${self:service}'
    },
    stackTags: {
      'service-name': '${self:service}'
    }
  },
  resources: {
    Conditions: {
      IS_PROD: {
        'Fn::Equals': [
          '${sls:stage}',
          'prod'
        ]
      },
      IS_DEV: {
        'Fn::Equals': [
          '${sls:stage}',
          'dev'
        ]
      }
    }
  }
}, {
  ...(functions && {
    functions: Array.isArray(functions) ? functions.reduce((res, row) => {
      const data = yml.load(readFileSync(row));
      for (let [key, val] of Object.entries<any>(data)) {
        res[key] = { ...res[key], ...val }
      }
      return res;
    }, {}) : functions
  }),

  ...(resources && {
    resources: Array.isArray(resources) ? resources.reduce((res, row) => {
      const data = yml.load(readFileSync(row));
      for (let [key, val] of Object.entries<any>(data)) {
        res[key] = { ...res[key], ...val }
      }
      return res;
    }, {}) : resources
  }),
  ...rest
});