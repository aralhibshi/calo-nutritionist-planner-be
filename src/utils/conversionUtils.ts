// Convert JSON to CSV
export function jsonToCsv(jsonData) {
  if (!Array.isArray(jsonData)) {
    throw new Error('Input data must be an array of objects.');
  }

  const header = Object.keys(jsonData[0]);
  const csvData = jsonData.map(row => header.map(fieldName => JSON.stringify(row[fieldName])).join(','));

  return [header.join(','), ...csvData].join('\n');
}

// Date - ISO String (without Milliseconds)
export function getISOString() {
  const date = new Date();
  const isoString = date.toISOString().slice(0, 16) + 'Z';
  return isoString;
}