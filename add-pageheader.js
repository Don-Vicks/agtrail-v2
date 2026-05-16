const fs = require('fs');
const path = require('path');
const glob = require('glob');

const files = glob.sync('app/routes/exporter/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Skip if it doesn't have the Add Farmer div and doesn't need PageHeader
  // Wait, some might already have PageHeader but still have Add Farmer div
  
  let modified = false;

  // 1. Remove the Add Farmer div
  // It looks like: <div className="flex items-center gap-2 ..."> ... Add Farmer ... </div>
  const addFarmerRegex = /<div className="flex items-center gap-2[^>]*>[\s\S]*?Add Farmer[\s\S]*?<\/div>/g;
  if (addFarmerRegex.test(content)) {
    content = content.replace(addFarmerRegex, '');
    modified = true;
  }

  // 2. Add PageHeader import if not present
  if (!content.includes('import { PageHeader } from')) {
    // Find the last import statement
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + "import { PageHeader } from '~/components/page-header'\n" + content.slice(endOfLastImport + 1);
      modified = true;
    }
  }

  // 3. Insert PageHeader component inside the main return div if not present
  // Need to extract the page name. We can derive it from the filename.
  if (!content.includes('<PageHeader')) {
    const basename = path.basename(file, '.tsx');
    // Format the title e.g. scan-qr -> Scan Qr
    const title = basename.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Find the main return div
    // It usually looks like: return (\n    <div ...>
    const returnRegex = /return\s*\(\s*<div[^>]*>/;
    const match = content.match(returnRegex);
    if (match) {
      const insertPos = match.index + match[0].length;
      const header = `\n      <PageHeader\n        items={[\n          { label: 'Dashboard', href: '/exporter' },\n          { label: '${title}' },\n        ]}\n      />\n`;
      content = content.slice(0, insertPos) + header + content.slice(insertPos);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
