import { readFileSync } from 'fs';

import yml from 'js-yaml';

const files = [
  readFileSync('./src/resources/cognito.yml'),
  readFileSync('./src/resources/s3.yml'),
  readFileSync('./src/resources/sqs.yml'),
  readFileSync('./src/resources/ddb.yml'),
  readFileSync('./src/resources/ses.yml'),
  readFileSync('./src/resources/lambda.yml'),
  readFileSync('./src/resources/custom.yml')
];

export default files.reduce((res, row) => {
  const data = yml.load(row);

  for (const [key, val] of Object.entries<any>(data)) {
    res[key] = { ...res[key], ...val }
  }

  return res;
}, {});