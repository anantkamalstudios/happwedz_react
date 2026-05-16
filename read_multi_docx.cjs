const fs = require('fs');
const execSync = require('child_process').execSync;

const files = [
  "docs/Happy Wedz Vendor Questions/WEDDING SUITS.docx",
  "docs/Happy Wedz Vendor Questions/SHERWANI.docx"
];

files.forEach((file, index) => {
  const name = `groom_docx_${index}`;
  console.log(`Processing ${file}...`);
  try {
    execSync(`Copy-Item "${file}" "${name}.zip"`, { shell: 'powershell.exe' });
    execSync(`Expand-Archive -Path "${name}.zip" -DestinationPath "${name}_unzipped" -Force`, { shell: 'powershell.exe' });
    const xml = fs.readFileSync(`${name}_unzipped/word/document.xml`, 'utf8');
    const text = xml.replace(/<w:p[^>]*>/g, '\n').replace(/<[^>]+>/g, '').trim();
    fs.writeFileSync(`${name}_output.txt`, text);
    console.log(`Finished ${file}`);
  } catch(e) {
    console.error(`Error processing ${file}: ${e}`);
  }
});
