const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'client', 'src');

const replacements = [
  // Background Colors
  { from: /#1E1425/gi, to: '#FFFFFF' },
  { from: /#150E1C/gi, to: '#FFFFFF' },
  { from: /#2D1B3D/gi, to: '#FFFFFF' },
  { from: /#26182F/gi, to: '#FAFAFA' },
  { from: /#0A0A0F/gi, to: '#FFFFFF' },
  { from: /#0D0F14/gi, to: '#FFFFFF' },
  { from: /#12141C/gi, to: '#FFFFFF' },

  // Translucent dark layers -> solid clean light grays
  { from: /rgba\(30,\s*20,\s*37,\s*[\d\.]+\)/gi, to: '#FFFFFF' },
  { from: /rgba\(21,\s*14,\s*28,\s*[\d\.]+\)/gi, to: '#FFFFFF' },
  { from: /rgba\(45,\s*27,\s*61,\s*[\d\.]+\)/gi, to: '#FFFFFF' },
  { from: /rgba\(18,\s*20,\s*28,\s*[\d\.]+\)/gi, to: '#FFFFFF' },
  { from: /rgba\(10,\s*10,\s*15,\s*[\d\.]+\)/gi, to: '#FFFFFF' },
  { from: /rgba\(13,\s*15,\s*20,\s*[\d\.]+\)/gi, to: '#FFFFFF' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.0[2-9]\)/gi, to: '#F9FAFB' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.01\)/gi, to: '#FFFFFF' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.1\)/gi, to: '#F3F4F6' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.0[4-8]\)/gi, to: '#E5E5E5' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.05\)/gi, to: '#E5E5E5' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.06\)/gi, to: '#E5E5E5' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.07\)/gi, to: '#E5E5E5' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.08\)/gi, to: '#E5E5E5' },

  // Borders
  { from: /rgba\(212,\s*175,\s*55,\s*0\.2[0-5]?\)/gi, to: '#E5E5E5' },
  { from: /rgba\(212,\s*175,\s*55,\s*0\.1[0-5]?\)/gi, to: '#FDF4D8' },
  { from: /rgba\(212,\s*175,\s*55,\s*0\.3[0-5]?\)/gi, to: '#F5E5B8' },

  // Text Colors
  { from: /#F8F5F0/gi, to: '#1A1A1A' },
  { from: /#F5F5F7/gi, to: '#1A1A1A' },
  { from: /#E4E4E7/gi, to: '#1A1A1A' },
  { from: /#B8AEC2/gi, to: '#6B6B6B' },
  { from: /#A1A1AA/gi, to: '#6B6B6B' },
  { from: /#9A8FA8/gi, to: '#8E8E93' },
  { from: /#71717A/gi, to: '#8E8E93' },

  // Gold text in dark contexts -> dark gold in light mode
  { from: /color:\s*["']#F5C842["']/gi, to: 'color: "#92700F"' },
  { from: /color:\s*["']#FDE047["']/gi, to: 'color: "#92700F"' },
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
let count = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  for (const r of replacements) {
    content = content.replace(r.from, r.to);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log(`Converted to Light Mode: ${path.relative(srcDir, file)}`);
  }
}

console.log(`\nSuccessfully converted ${count} files to Light Mode.`);
