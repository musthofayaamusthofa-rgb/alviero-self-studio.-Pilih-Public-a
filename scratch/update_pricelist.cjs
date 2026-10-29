const fs = require('fs');

let content = fs.readFileSync('src/components/PricelistViewer.tsx', 'utf8');

// 1. Update import
content = content.replace(
  "import { useStudioConfig } from '../utils/studioConfigManager';",
  "import { useStudioConfig, formatPriceDisplay, getActiveLabPrintItems, getActiveFrameItems, getActiveCategories } from '../utils/studioConfigManager';"
);

// 2. Inject helper functions
const helperCode = `
  const studioPackagesList = useMemo(() => {
    return ((studioConfig as any)?.studioPackages || (studioConfig as any)?.indoorPackages || []) as any[];
  }, [studioConfig]);

  const getPkg = (pkgId: string, fallback?: any) => {
    const found = studioPackagesList.find((p: any) => p.id === pkgId);
    if (found) return found;
    const staticFound = PACKAGES.find(p => p.id === pkgId);
    return staticFound || fallback || {};
  };

  const getPkgPrice = (pkgId: string, fallbackPrice = ''): string => {
    const pkg = getPkg(pkgId);
    if (!pkg) return fallbackPrice;
    if (pkg.price) {
      return formatPriceDisplay(pkg.price, fallbackPrice);
    }
    return fallbackPrice;
  };

  const getPkgOriginalPrice = (pkgId: string, fallback = ''): string => {
    const pkg = getPkg(pkgId);
    if (pkg && pkg.originalPrice) {
      return formatPriceDisplay(pkg.originalPrice, fallback);
    }
    return fallback;
  };

  const getPkgName = (pkgId: string, fallback = ''): string => {
    const pkg = getPkg(pkgId);
    return (pkg && pkg.name) ? pkg.name : fallback;
  };

  const getAddOnPriceDisplay = (keywordOrId: string, fallback = ''): string => {
    const addOns = ((studioConfig as any)?.addOns as any[]) || [];
    const found = addOns.find((a: any) => 
      a.id === keywordOrId || 
      a.id.includes(keywordOrId) || 
      (a.name && a.name.toLowerCase().includes(keywordOrId.toLowerCase()))
    );
    if (found && found.price) {
      return formatPriceDisplay(found.price, fallback);
    }
    return fallback;
  };
`;

content = content.replace(
  "  const studioConfig = useStudioConfig();",
  "  const studioConfig = useStudioConfig();" + helperCode
);

// 3. Self Studio tab buttons and price badges
content = content.replace("🏷️ Special (55K)", "🏷️ Special ({getPkgPrice('self-special-narsis', '55K')})");
content = content.replace("✨ Normal (80K)", "✨ Normal ({getPkgPrice('self-normal-narsis', '80K')})");
content = content.replace("🌈 Spotlight (99K)", "🌈 Spotlight ({getPkgPrice('self-special-spotlight', '99K')})");

content = content.replace('>55k</div>', '>{getPkgPrice("self-special-narsis", "55k")}</div>');
content = content.replace('>70k</div>', '>{getPkgPrice("self-special-super-narsis", "70k")}</div>');
content = content.replace('>80k</div>', '>{getPkgPrice("self-normal-narsis", "80k")}</div>');
content = content.replace('>95k</div>', '>{getPkgPrice("self-normal-super-narsis", "95k")}</div>');
content = content.replace('>99k</div>', '>{getPkgPrice("self-special-spotlight", "99k")}</div>');
content = content.replace('>115k</div>', '>{getPkgPrice("self-normal-spotlight", "115k")}</div>');

// 4. Undangan
content = content.replace(
  '>95K</div>',
  '>{getPkgPrice("undangan-paket-1", "95K")}</div>'
);
content = content.replace(
  '>155K</div>',
  '>{getPkgPrice("undangan-paket-2", "155K")}</div>'
);

// 5. Sewa Studio
content = content.replace(
  '>175K</div>',
  '>{getPkgPrice("sewa-studio-hourly", "175K")}</div>'
);

// 6. Prewed
content = content.replace(
  '>550K</div>',
  '>{getPkgPrice("prewed-sweet-promise", "550K")}</div>'
);
content = content.replace(
  '>600K</div>',
  '>{getPkgPrice("prewed-velvet-romance", "600K")}</div>'
);

// 7. Couple
content = content.replace(
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">255K</div>',
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{getPkgPrice("couple-eternal-love", "255K")}</div>'
);
content = content.replace(
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">305K</div>',
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{getPkgPrice("couple-sweet-memories", "305K")}</div>'
);

// 8. Personal (the remaining 155K and 255K)
content = content.replace(
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">155K</div>',
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{getPkgPrice("personal-bold-statement", "155K")}</div>'
);
content = content.replace(
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">255K</div>',
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{getPkgPrice("personal-opulent-shot", "255K")}</div>'
);

// 9. Maternity (the next 255K and 305K)
content = content.replace(
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">255K</div>',
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{getPkgPrice("maternity-warm-embrace", "255K")}</div>'
);
content = content.replace(
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">305K</div>',
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{getPkgPrice("maternity-golden-motherhood", "305K")}</div>'
);

// 10. Birthday
content = content.replace(
  '>199K</div>',
  '>{getPkgPrice("birthday-sweet-celebration", "199K")}</div>'
);
content = content.replace(
  '>275K</div>',
  '>{getPkgPrice("birthday-glow-sweet", "275K")}</div>'
);
content = content.replace(
  '>250K</div>',
  '>{getPkgPrice("birthday-sweet-light", "250K")}</div>'
);
content = content.replace(
  '>325K</div>',
  '>{getPkgPrice("birthday-ultimate-sweet-light", "325K")}</div>'
);

// 11. Family (the next 255K and 305K)
content = content.replace(
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">255K</div>',
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{getPkgPrice("family-sweet-together", "255K")}</div>'
);
content = content.replace(
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">305K</div>',
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{getPkgPrice("family-happy-nest", "305K")}</div>'
);

// 12. Group
content = content.replace(
  '>215K</div>',
  '>{getPkgPrice("group-friendly-frame", "215K")}</div>'
);
content = content.replace(
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">275K</div>',
  '<div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{getPkgPrice("group-signature-squad", "275K")}</div>'
);
content = content.replace(
  '>375K</div>',
  '>{getPkgPrice("group-royal-ensemble", "375K")}</div>'
);
content = content.replace(
  '>499K</div>',
  '>{getPkgPrice("group-imperial-union", "499K")}</div>'
);

// 13. Pass Foto
content = content.replace(
  '>35K</div>',
  '>{getPkgPrice("passfoto-1", "35K")}</div>'
);
content = content.replace(
  '>50K</div>',
  '>{getPkgPrice("passfoto-2", "50K")}</div>'
);
content = content.replace(
  '>65K</div>',
  '>{getPkgPrice("passfoto-3", "65K")}</div>'
);

// 14. Additional perks
content = content.replace(
  '<span>+ Background</span><span className="font-bold">75K</span>',
  '<span>+ Background</span><span className="font-bold">{getAddOnPriceDisplay("backdrop", "75K")}</span>'
);
content = content.replace(
  '<span>+ Hairdo</span><span className="font-bold">150K</span>',
  '<span>+ Hairdo</span><span className="font-bold">{getAddOnPriceDisplay("hairdo", "150K")}</span>'
);
content = content.replace(
  '<span>+ Make UP</span><span className="font-bold">350K</span>',
  '<span>+ Make UP</span><span className="font-bold">{getAddOnPriceDisplay("makeup", "350K")}</span>'
);
content = content.replace(
  '<span>+ Edit</span><span className="font-bold">10K</span>',
  '<span>+ Edit</span><span className="font-bold">{getAddOnPriceDisplay("edit", "10K")}</span>'
);

fs.writeFileSync('src/components/PricelistViewer.tsx', content, 'utf8');
console.log('Part A done!');
