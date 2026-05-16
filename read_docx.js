const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function readZipFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  // Zip files have a central directory at the end, but we can do a simple search for the "word/document.xml" entry.
  // Actually, extracting zip in pure node without a library is a bit complex.
  // Let's use powershell to unzip it instead, or child_process.
}
