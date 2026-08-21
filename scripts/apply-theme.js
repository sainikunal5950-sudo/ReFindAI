const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'client', 'src');

const replacements = [
  // Backgrounds
  { from: /#0A0A0F/gi, to: '#1E1425' },
  { from: /#0D0F14/gi, to: '#150E1C' },
  { from: /#12141C/gi, to: '#2D1B3D' },
  { from: /#161925/gi, to: '#26182F' },
  { from: /rgba\(10,\s*10,\s*15,/gi, to: 'rgba(30, 20, 37,' },
  { from: /rgba\(13,\s*15,\s*20,/gi, to: 'rgba(21, 14, 28,' },
  { from: /rgba\(18,\s*20,\s*28,/gi, to: 'rgba(45, 27, 61,' },

  // Blue / Cyan Accent Colors -> Gold / Amber
  { from: /#3B82F6/gi, to: '#D4AF37' },
  { from: /#2563EB/gi, to: '#B89628' },
  { from: /#06B6D4/gi, to: '#F5C842' },
  { from: /#60A5FA/gi, to: '#F5C842' },
  { from: /#22D3EE/gi, to: '#FDE047' },
  { from: /#93C5FD/gi, to: '#F5C842' },
  { from: /#1D4ED8/gi, to: '#9E801E' },
  { from: /rgba\(59,\s*130,\s*246,/gi, to: 'rgba(212, 175, 55,' },
  { from: /rgba\(6,\s*182,\s*212,/gi, to: 'rgba(245, 200, 66,' },
  { from: /rgba\(37,\s*99,\s*235,/gi, to: 'rgba(184, 150, 40,' },

  // Text Colors -> Warm White / Lavender Gray
  { from: /#F5F5F7/gi, to: '#F8F5F0' },
  { from: /#A1A1AA/gi, to: '#B8AEC2' },
  { from: /#71717A/gi, to: '#9A8FA8' },
  { from: /#E4E4E7/gi, to: '#F8F5F0' },
];

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (/\.(tsx|ts|css|jsx|js)$/.test(item)) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = walk(srcDir);
let changedCount = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  for (const r of replacements) {
    content = content.replace(r.from, r.to);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
    console.log(`Updated theme in: ${path.relative(srcDir, file)}`);
  }
}

console.log(`\nSuccessfully applied Deep Plum & Gold theme across ${changedCount} files.`);
