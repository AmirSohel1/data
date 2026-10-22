const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('d:/aerobook/docs/AeroBook_8Min_Demo_Video_Script.html');
const pdfPath = path.resolve('d:/aerobook/docs/AeroBook_8Min_Demo_Video_Script.pdf');

console.log('HTML exists:', fs.existsSync(htmlPath));
console.log('HTML path:', htmlPath);
console.log('PDF path:', pdfPath);

const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${fileUrl}"`;

console.log('Executing:', cmd);
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Command executed.');
} catch (err) {
  console.error('Execution error:', err.message);
}

if (fs.existsSync(pdfPath)) {
  const stats = fs.statSync(pdfPath);
  console.log(`SUCCESS: PDF created (${(stats.size / 1024).toFixed(1)} KB)`);
} else {
  console.log('PDF was not found at:', pdfPath);
}

