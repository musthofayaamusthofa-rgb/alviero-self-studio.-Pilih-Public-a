/**
 * fix_all_pending.cjs
 * Fixes all pending issues from the audit:
 * 1. Header.tsx — add useMemo to imports
 * 2. BranchSelectorModal.tsx — wire allReviews replacing CLIENT_REVIEWS
 * 3. PricelistViewer.tsx — remove static studioConfig import
 * 4. BookingCalculator.tsx — remove static studioConfig import
 * 5. PricelistViewer.tsx — add getActiveDisclaimer dynamic disclaimer
 */

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../src');

function fixFile(relPath, transforms) {
  const fullPath = path.join(SRC, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;
  let changeCount = 0;

  for (const { find, replace, desc } of transforms) {
    if (content.includes(find)) {
      content = content.split(find).join(replace);
      changeCount++;
      console.log(`  ✅ ${desc}`);
    } else {
      console.log(`  ⚠️  NOT FOUND: ${desc}`);
    }
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`  💾 Saved ${relPath} (${changeCount} changes)\n`);
  } else {
    console.log(`  — No changes needed for ${relPath}\n`);
  }
}

// ============================
// 1. Header.tsx — add useMemo
// ============================
console.log('1. Fixing Header.tsx — add useMemo to React imports...');
fixFile('components/Header.tsx', [
  {
    find: "import React, { useState, useEffect } from 'react';",
    replace: "import React, { useState, useEffect, useMemo } from 'react';",
    desc: 'Add useMemo to React import'
  }
]);

// ============================
// 2. BranchSelectorModal.tsx — wire allReviews
// ============================
console.log('2. Fixing BranchSelectorModal.tsx — wire allReviews...');
fixFile('components/BranchSelectorModal.tsx', [
  {
    find: 'if (activeBranchFilter === \'all\') return CLIENT_REVIEWS;\n    return CLIENT_REVIEWS.filter((r) => r.branch === activeBranchFilter);',
    replace: 'if (activeBranchFilter === \'all\') return allReviews;\n    return allReviews.filter((r) => r.branch === activeBranchFilter);',
    desc: 'Replace CLIENT_REVIEWS with allReviews in filter function'
  },
  {
    // Also update if it uses different quote style
    find: "if (activeBranchFilter === 'all') return CLIENT_REVIEWS;\r\n    return CLIENT_REVIEWS.filter((r) => r.branch === activeBranchFilter);",
    replace: "if (activeBranchFilter === 'all') return allReviews;\r\n    return allReviews.filter((r) => r.branch === activeBranchFilter);",
    desc: 'Replace CLIENT_REVIEWS with allReviews in filter function (CRLF)'
  },
  {
    find: '{CLIENT_REVIEWS.length}',
    replace: '{allReviews.length}',
    desc: 'Replace CLIENT_REVIEWS.length with allReviews.length'
  }
]);

// ============================
// 3. PricelistViewer.tsx — remove static import + add getActiveDisclaimer
// ============================
console.log('3. Fixing PricelistViewer.tsx — remove static import...');

// Read the file to check the exact import line
const pvPath = path.join(SRC, 'components/PricelistViewer.tsx');
let pvContent = fs.readFileSync(pvPath, 'utf8');
const pvOriginal = pvContent;

// Remove static studioConfig import (line 1)
const staticImportLine = "import studioConfig from '../data/studioConfig.json';\r\n";
const staticImportLineUnix = "import studioConfig from '../data/studioConfig.json';\n";

if (pvContent.startsWith(staticImportLine)) {
  pvContent = pvContent.slice(staticImportLine.length);
  console.log('  ✅ Removed static studioConfig.json import (CRLF)');
} else if (pvContent.startsWith(staticImportLineUnix)) {
  pvContent = pvContent.slice(staticImportLineUnix.length);
  console.log('  ✅ Removed static studioConfig.json import (LF)');
} else {
  // Try regex
  pvContent = pvContent.replace(/^import studioConfig from '\.\.\/data\/studioConfig\.json';\r?\n/, '');
  console.log('  ✅ Removed static studioConfig.json import (regex)');
}

// Add getActiveDisclaimer to imports from studioConfigManager
pvContent = pvContent.replace(
  "import { useStudioConfig, formatPriceDisplay, getActiveLabPrintItems, getActiveFrameItems, getActiveCategories } from '../utils/studioConfigManager';",
  "import { useStudioConfig, formatPriceDisplay, getActiveLabPrintItems, getActiveFrameItems, getActiveCategories, getActiveDisclaimer } from '../utils/studioConfigManager';"
);

// Add activeDisclaimer useMemo after existing activeFrameItems useMemo
// Find the pattern to insert after
const insertAfterPattern = "const activeFrameItems = useMemo(() => getActiveFrameItems(studioConfig, defaultFrameItems), [studioConfig]);";
const insertAfterPatternCRLF = "const activeFrameItems = useMemo(() => getActiveFrameItems(studioConfig, defaultFrameItems), [studioConfig]);\r\n";

const disclaimerCode = `\n  const activeDisclaimer = useMemo(() => getActiveDisclaimer(studioConfig), [studioConfig]);`;
const disclaimerCodeCRLF = `\r\n  const activeDisclaimer = useMemo(() => getActiveDisclaimer(studioConfig), [studioConfig]);`;

if (pvContent.includes(insertAfterPatternCRLF) && !pvContent.includes('activeDisclaimer')) {
  pvContent = pvContent.replace(insertAfterPatternCRLF, insertAfterPatternCRLF + disclaimerCodeCRLF);
  console.log('  ✅ Added activeDisclaimer useMemo (CRLF)');
} else if (pvContent.includes(insertAfterPattern) && !pvContent.includes('activeDisclaimer')) {
  pvContent = pvContent.replace(insertAfterPattern, insertAfterPattern + disclaimerCode);
  console.log('  ✅ Added activeDisclaimer useMemo (LF)');
} else if (pvContent.includes('activeDisclaimer')) {
  console.log('  — activeDisclaimer already exists');
} else {
  console.log('  ⚠️  Could not find insertion point for activeDisclaimer');
}

if (pvContent !== pvOriginal) {
  fs.writeFileSync(pvPath, pvContent, 'utf8');
  console.log('  💾 Saved PricelistViewer.tsx\n');
} else {
  console.log('  — No changes to PricelistViewer.tsx\n');
}

// ============================
// 4. BookingCalculator.tsx — remove static import
// ============================
console.log('4. Fixing BookingCalculator.tsx — remove static import...');

const bcPath = path.join(SRC, 'components/BookingCalculator.tsx');
let bcContent = fs.readFileSync(bcPath, 'utf8');
const bcOriginal = bcContent;

const bcStaticImportCRLF = "import studioConfig from '../data/studioConfig.json';\r\n";
const bcStaticImportLF = "import studioConfig from '../data/studioConfig.json';\n";

if (bcContent.startsWith(bcStaticImportCRLF)) {
  bcContent = bcContent.slice(bcStaticImportCRLF.length);
  console.log('  ✅ Removed static studioConfig.json import (CRLF)');
} else if (bcContent.startsWith(bcStaticImportLF)) {
  bcContent = bcContent.slice(bcStaticImportLF.length);
  console.log('  ✅ Removed static studioConfig.json import (LF)');
} else {
  bcContent = bcContent.replace(/^import studioConfig from '\.\.\/data\/studioConfig\.json';\r?\n/, '');
  console.log('  ✅ Removed static studioConfig.json import (regex)');
}

if (bcContent !== bcOriginal) {
  fs.writeFileSync(bcPath, bcContent, 'utf8');
  console.log('  💾 Saved BookingCalculator.tsx\n');
} else {
  console.log('  — No changes to BookingCalculator.tsx\n');
}

console.log('✅ All fixes applied! Now run npm run build to verify.');

