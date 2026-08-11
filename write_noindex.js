const fs = require('fs');
const path = require('path');

const content = [
  "import React from 'react';",
  "import { Helmet } from 'react-helmet-async';",
  "",
  "/**",
  " * Drop this into any page that must never be indexed.",
  " * Auth-gating alone does not stop crawlers following leaked URLs.",
  " */",
  "export default function NoIndex() {",
  "  return (",
  "    <Helmet>",
  '      <meta name="robots" content="noindex, nofollow" />',
  "    </Helmet>",
  "  );",
  "}",
  ""
].join('\n');

const dest = path.join('src', 'components', 'common', 'NoIndex.jsx');
fs.writeFileSync(dest, content, 'utf8');
console.log('Written:', dest);
