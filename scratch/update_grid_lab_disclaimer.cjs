const fs = require('fs');

let content = fs.readFileSync('src/components/PricelistViewer.tsx', 'utf8');

// 1. Grid Category
content = content.replace(
  '  // Grid Category Arrays (Sesuai Urutan 12 Paket Utama Photo Studio)\n  const photoStudioGridItems = [',
  `  // Grid Category Arrays (Sesuai Urutan 12 Paket Utama Photo Studio)
  const defaultPhotoStudioGridItems = [`
);
content = content.replace(
  '  // Grid Category Arrays (Sesuai Urutan 12 Paket Utama Photo Studio)\r\n  const photoStudioGridItems = [',
  `  // Grid Category Arrays (Sesuai Urutan 12 Paket Utama Photo Studio)
  const defaultPhotoStudioGridItems = [`
);

// End of defaultPhotoStudioGridItems
content = content.replace(
  `    { id: 'sewa-studio', name: 'Sewa Studio', icon: '🏛️', img: '/images/categories/sewa-studio.jpg', colorBg: 'bg-[#eff7f8]', colorBorder: 'border-[#cee6e8]', colorText: 'text-[#1f575c]' }\n  ];`,
  `    { id: 'sewa-studio', name: 'Sewa Studio', icon: '🏛️', img: '/images/categories/sewa-studio.jpg', colorBg: 'bg-[#eff7f8]', colorBorder: 'border-[#cee6e8]', colorText: 'text-[#1f575c]' }
  ];

  const photoStudioGridItems = useMemo(() => {
    return getActiveCategories(studioConfig, defaultPhotoStudioGridItems);
  }, [studioConfig]);`
);
content = content.replace(
  `    { id: 'sewa-studio', name: 'Sewa Studio', icon: '🏛️', img: '/images/categories/sewa-studio.jpg', colorBg: 'bg-[#eff7f8]', colorBorder: 'border-[#cee6e8]', colorText: 'text-[#1f575c]' }\r\n  ];`,
  `    { id: 'sewa-studio', name: 'Sewa Studio', icon: '🏛️', img: '/images/categories/sewa-studio.jpg', colorBg: 'bg-[#eff7f8]', colorBorder: 'border-[#cee6e8]', colorText: 'text-[#1f575c]' }
  ];

  const photoStudioGridItems = useMemo(() => {
    return getActiveCategories(studioConfig, defaultPhotoStudioGridItems);
  }, [studioConfig]);`
);

// 2. Lab print items & Frame items
const labDefaults = `
  const defaultLabPrintItems = [
    { code: '4R', size: '10.2 cm x 15.2 cm', price: '5K', note: 'Standar Foto Album' },
    { code: '5R', size: '12.7 cm x 17.8 cm', price: '8K', note: 'Sedang Meja' },
    { code: '6R', size: '15.2 cm x 20.3 cm', price: '9K', note: 'Meja Kantor' },
    { code: '10Rs', size: '20.3 cm x 30.5 cm', price: '16K', note: 'Favorit Pigura Meja/Dinding' },
    { code: '12Rs', size: '30.5 cm x 45 cm', price: '52K', note: 'Dinding Kamar' },
    { code: '16Rs', size: '40 cm x 60 cm', price: '102K', note: 'Dinding Ruang Tamu' },
    { code: '20Rs', size: '50 cm x 75 cm', price: '137K', note: 'Wisuda & Prewed Besar' },
    { code: '24Rs', size: '60 cm x 90 cm', price: '172K', note: 'Jumbo Pigura Utama' },
    { code: 'Pass 2x3', size: 'Paket 6 foto', price: '8K', note: 'Dokumen / Ijazah' },
    { code: 'Pass 3x3', size: 'Paket 6 foto', price: '8K', note: 'Dokumen' },
    { code: 'Pass 3x4', size: 'Paket 6 foto', price: '8K', note: 'Buku Nikah / Ijazah' },
    { code: 'Pass 4x6', size: 'Paket 4 foto', price: '8K', note: 'Paspor / Lamaran Kerja' },
  ];

  const defaultFrameItems = [
    {
      code: '4R',
      size: '15 X 20 CM',
      price: '17K',
      type: 'Bingkai Meja / Minimalis',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      desc: 'Cocok untuk meja belajar, nakas kamar tidur, dan kado wisuda'
    },
    {
      code: '10Rs',
      size: '40 X 50 CM',
      price: '35K',
      type: 'Bingkai Dinding Sedang',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      desc: 'Ukuran paling diminati untuk foto wisuda keluarga & portrait'
    },
    {
      code: '12Rs',
      size: '50 X 60 CM',
      price: '50K',
      type: 'Bingkai Dinding Populer',
      image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80',
      desc: 'Sangat pas untuk foto wisuda sarjana & foto couple ruang tamu'
    },
    {
      code: '16Rs',
      size: '60 X 70 CM',
      price: '145K',
      type: 'Bingkai Dinding Eksklusif',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      desc: 'Tampilan megah dengan list linen ganda untuk foto keluarga'
    },
    {
      code: '20Rs',
      size: '70 X 90 CM',
      price: '175K',
      type: 'Bingkai Dinding Jumbo',
      image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80',
      desc: 'Sempurna untuk foto prewedding utama & foto keluarga besar'
    },
    {
      code: '24Rs',
      size: '90 X 120 CM',
      price: '230K',
      type: 'Bingkai Dinding Masterpiece',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      desc: 'Ukuran kanvas/pigura terbesar untuk background ruang utama'
    }
  ];

  const activeLabPrintItems = useMemo(() => {
    const items = getActiveLabPrintItems(studioConfig, defaultLabPrintItems);
    return items.map((i: any) => ({
      ...i,
      price: i.priceDisplay || (typeof i.price === 'number' ? formatPriceDisplay(i.price) : i.price)
    }));
  }, [studioConfig]);

  const activeFrameItems = useMemo(() => {
    const items = getActiveFrameItems(studioConfig, defaultFrameItems);
    return items.map((i: any) => ({
      ...i,
      price: i.priceDisplay || (typeof i.price === 'number' ? formatPriceDisplay(i.price) : i.price)
    }));
  }, [studioConfig]);
`;

content = content.replace(
  '  const [selectedBingkaiSubTab, setSelectedBingkaiSubTab] = useState',
  labDefaults + '\n  const [selectedBingkaiSubTab, setSelectedBingkaiSubTab] = useState'
);

content = content.replace(
  `                            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800 bg-white">
                              {[
                                { code: '4R', size: '10.2 cm x 15.2 cm', price: '5K', note: 'Standar Foto Album' },
                                { code: '5R', size: '12.7 cm x 17.8 cm', price: '8K', note: 'Sedang Meja' },
                                { code: '6R', size: '15.2 cm x 20.3 cm', price: '9K', note: 'Meja Kantor' },
                                { code: '10Rs', size: '20.3 cm x 30.5 cm', price: '16K', note: 'Favorit Pigura Meja/Dinding' },
                                { code: '12Rs', size: '30.5 cm x 45 cm', price: '52K', note: 'Dinding Kamar' },
                                { code: '16Rs', size: '40 cm x 60 cm', price: '102K', note: 'Dinding Ruang Tamu' },
                                { code: '20Rs', size: '50 cm x 75 cm', price: '137K', note: 'Wisuda & Prewed Besar' },
                                { code: '24Rs', size: '60 cm x 90 cm', price: '172K', note: 'Jumbo Pigura Utama' },
                                { code: 'Pass 2x3', size: 'Paket 6 foto', price: '8K', note: 'Dokumen / Ijazah' },
                                { code: 'Pass 3x3', size: 'Paket 6 foto', price: '8K', note: 'Dokumen' },
                                { code: 'Pass 3x4', size: 'Paket 6 foto', price: '8K', note: 'Buku Nikah / Ijazah' },
                                { code: 'Pass 4x6', size: 'Paket 4 foto', price: '8K', note: 'Paspor / Lamaran Kerja' },
                              ].map((item, idx) => (`,
  `                            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800 bg-white">
                              {activeLabPrintItems.map((item: any, idx: number) => (`
);

content = content.replace(
  `                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          {[
                            {
                              code: '4R',
                              size: '15 X 20 CM',
                              price: '17K',
                              type: 'Bingkai Meja / Minimalis',
                              image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
                              desc: 'Cocok untuk meja belajar, nakas kamar tidur, dan kado wisuda'
                            },
                            {
                              code: '10Rs',
                              size: '40 X 50 CM',
                              price: '35K',
                              type: 'Bingkai Dinding Sedang',
                              image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
                              desc: 'Ukuran paling diminati untuk foto wisuda keluarga & portrait'
                            },
                            {
                              code: '12Rs',
                              size: '50 X 60 CM',
                              price: '50K',
                              type: 'Bingkai Dinding Populer',
                              image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80',
                              desc: 'Sangat pas untuk foto wisuda sarjana & foto couple ruang tamu'
                            },
                            {
                              code: '16Rs',
                              size: '60 X 70 CM',
                              price: '145K',
                              type: 'Bingkai Dinding Eksklusif',
                              image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
                              desc: 'Tampilan megah dengan list linen ganda untuk foto keluarga'
                            },
                            {
                              code: '20Rs',
                              size: '70 X 90 CM',
                              price: '175K',
                              type: 'Bingkai Dinding Jumbo',
                              image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80',
                              desc: 'Sempurna untuk foto prewedding utama & foto keluarga besar'
                            },
                            {
                              code: '24Rs',
                              size: '90 X 120 CM',
                              price: '230K',
                              type: 'Bingkai Dinding Masterpiece',
                              image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
                              desc: 'Ukuran kanvas/pigura terbesar untuk background ruang utama'
                            }
                          ].map((item, idx) => (`,
  `                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          {activeFrameItems.map((item: any, idx: number) => (`
);

fs.writeFileSync('src/components/PricelistViewer.tsx', content, 'utf8');
console.log('Update grid, lab, and frame finished!');

