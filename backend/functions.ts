import { readFileSync } from 'fs';

import yml from 'js-yaml';

const files = [
  readFileSync('./src/services/ingredients/serverless.yml'),
  readFileSync('./src/services/components/serverless.yml'),
  readFileSync('./src/services/meals/serverless.yml')
];

export default files.reduce((res, row) => {
  const data = yml.load(row);

  for (const [key, val] of Object.entries<any>(data)) {
    res[key] = { ...res[key], ...val }
  }

  return res;
}, {});