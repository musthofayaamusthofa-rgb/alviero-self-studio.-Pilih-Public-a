const fs = require('fs');

let content = fs.readFileSync('src/components/PricelistViewer.tsx', 'utf8');

// 1. photoStudioGridItems
const oldGrid = `  // Grid Category Arrays (Sesuai Urutan 12 Paket Utama Photo Studio)
  const photoStudioGridItems = [
    { id: 'grad-indoor', name: 'Graduation', icon: '🎓', img: '/images/categories/graduation.jpg', colorBg: 'bg-[#f3f3fd]', colorBorder: 'border-[#d6d6f9]', colorText: 'text-[#36369c]' },
    { id: 'group-paket', name: 'Group', icon: '👥', img: '/images/categories/group.jpg', colorBg: 'bg-[#f0f4fc]', colorBorder: 'border-[#d0ddf7]', colorText: 'text-[#244983]' },
    { id: 'family-paket', name: 'Family', icon: '👨‍👩‍👧‍👦', img: '/images/categories/family.jpg', colorBg: 'bg-[#f5f8ee]', colorBorder: 'border-[#dae6c6]', colorText: 'text-[#435722]' },
    { id: 'maternity-paket', name: 'Maternity', icon: '🤰', img: '/images/categories/maternity.jpg', colorBg: 'bg-[#fdf5ee]', colorBorder: 'border-[#f8dac3]', colorText: 'text-[#82471d]' },
    { id: 'personal-paket', name: 'Personal', icon: '👩‍💼', img: '/images/categories/personal.jpg', colorBg: 'bg-[#eef8f5]', colorBorder: 'border-[#c2ece0]', colorText: 'text-[#186b57]' },
    { id: 'couple-paket', name: 'Couple', icon: '💑', img: '/images/categories/couple.jpg', colorBg: 'bg-[#fdf3f3]', colorBorder: 'border-[#f8d4d4]', colorText: 'text-[#822f2f]' },
    { id: 'event', name: 'Birthday', icon: '🎂', img: '/images/categories/birthday.jpg', colorBg: 'bg-[#fefbe8]', colorBorder: 'border-[#f8f0ab]', colorText: 'text-[#73630f]' },
    { id: 'undangan-paket', name: 'Undangan', icon: '💌', colorBg: 'bg-[#fdf9ee]', colorBorder: 'border-[#f6e9c1]', colorText: 'text-[#735515]' },
    { id: 'prewed-paket', name: 'Prewedding', icon: '💍', img: '/images/categories/prewedding.jpg', colorBg: 'bg-[#f9f2f8]', colorBorder: 'border-[#ecd4ea]', colorText: 'text-[#6b3169]' },
    { id: 'pass-foto', name: 'Pass photo', icon: '🪪', colorBg: 'bg-[#ecf9f5]', colorBorder: 'border-[#beece0]', colorText: 'text-[#175f4e]' },
    { id: 'sewa-studio', name: 'Sewa Studio', icon: '🏛️', img: '/images/categories/sewa-studio.jpg', colorBg: 'bg-[#eff7f8]', colorBorder: 'border-[#cee6e8]', colorText: 'text-[#1f575c]' }
  ];`;

const newGrid = `  // Grid Category Arrays (Sesuai Urutan 12 Paket Utama Photo Studio)
  const defaultPhotoStudioGridItems = [
    { id: 'grad-indoor', name: 'Graduation', icon: '🎓', img: '/images/categories/graduation.jpg', colorBg: 'bg-[#f3f3fd]', colorBorder: 'border-[#d6d6f9]', colorText: 'text-[#36369c]' },
    { id: 'group-paket', name: 'Group', icon: '👥', img: '/images/categories/group.jpg', colorBg: 'bg-[#f0f4fc]', colorBorder: 'border-[#d0ddf7]', colorText: 'text-[#244983]' },
    { id: 'family-paket', name: 'Family', icon: '👨‍👩‍👧‍👦', img: '/images/categories/family.jpg', colorBg: 'bg-[#f5f8ee]', colorBorder: 'border-[#dae6c6]', colorText: 'text-[#435722]' },
    { id: 'maternity-paket', name: 'Maternity', icon: '🤰', img: '/images/categories/maternity.jpg', colorBg: 'bg-[#fdf5ee]', colorBorder: 'border-[#f8dac3]', colorText: 'text-[#82471d]' },
    { id: 'personal-paket', name: 'Personal', icon: '👩‍💼', img: '/images/categories/personal.jpg', colorBg: 'bg-[#eef8f5]', colorBorder: 'border-[#c2ece0]', colorText: 'text-[#186b57]' },
    { id: 'couple-paket', name: 'Couple', icon: '💑', img: '/images/categories/couple.jpg', colorBg: 'bg-[#fdf3f3]', colorBorder: 'border-[#f8d4d4]', colorText: 'text-[#822f2f]' },
    { id: 'event', name: 'Birthday', icon: '🎂', img: '/images/categories/birthday.jpg', colorBg: 'bg-[#fefbe8]', colorBorder: 'border-[#f8f0ab]', colorText: 'text-[#73630f]' },
    { id: 'undangan-paket', name: 'Undangan', icon: '💌', colorBg: 'bg-[#fdf9ee]', colorBorder: 'border-[#f6e9c1]', colorText: 'text-[#735515]' },
    { id: 'prewed-paket', name: 'Prewedding', icon: '💍', img: '/images/categories/prewedding.jpg', colorBg: 'bg-[#f9f2f8]', colorBorder: 'border-[#ecd4ea]', colorText: 'text-[#6b3169]' },
    { id: 'pass-foto', name: 'Pass photo', icon: '🪪', colorBg: 'bg-[#ecf9f5]', colorBorder: 'border-[#beece0]', colorText: 'text-[#175f4e]' },
    { id: 'sewa-studio', name: 'Sewa Studio', icon: '🏛️', img: '/images/categories/sewa-studio.jpg', colorBg: 'bg-[#eff7f8]', colorBorder: 'border-[#cee6e8]', colorText: 'text-[#1f575c]' }
  ];

  const photoStudioGridItems = useMemo(() => {
    return getActiveCategories(studioConfig, defaultPhotoStudioGridItems);
  }, [studioConfig]);`;

// Use regex or CRLF-tolerant replace
content = content.replace(/\/\/ Grid Category Arrays \(Sesuai Urutan 12 Paket Utama Photo Studio\)[\s\S]*?const photoStudioGridItems = \[[\s\S]*?\];/, newGrid);

// 2. Lab print items
const labPrintDefault = `const defaultLabPrintItems = [
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
  const activeLabPrintItems = useMemo(() => {
    const items = getActiveLabPrintItems(studioConfig, defaultLabPrintItems);
    return items.map((i: any) => ({
      ...i,
      price: i.priceDisplay || (typeof i.price === 'number' ? formatPriceDisplay(i.price) : i.price)
    }));
  }, [studioConfig]);`;

content = content.replace(
  'const [selectedBingkaiSubTab, setSelectedBingkaiSubTab] = useState',
  labPrintDefault + '\n  const [selectedBingkaiSubTab, setSelectedBingkaiSubTab] = useState'
);

content = content.replace(
  /\{\[\s*\{\s*code:\s*'4R',[\s\S]*?\}\s*\]\.map\(\(item,\s*idx\)\s*=>/m,
  '{activeLabPrintItems.map((item, idx) =>'
);

// 3. Frame items
const frameDefault = `const defaultFrameItems = [
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
      type: 'Bingkai Dinding Besar',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      desc: 'Cocok untuk foto keluarga besar di dinding ruang tamu utama'
    },
    {
      code: '20Rs',
      size: '70 X 95 CM',
      price: '185K',
      type: 'Bingkai Jumbo Mewah',
      image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=600&q=80',
      desc: 'Ukuran prestisius untuk momen wisuda cumlaude & prewedding'
    },
    {
      code: '24Rs',
      size: '80 X 110 CM',
      price: '245K',
      type: 'Bingkai Grand Masterpiece',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      desc: 'Ukuran terbesar untuk pajangan dinding istimewa di rumah Anda'
    }
  ];
  const activeFrameItems = useMemo(() => {
    const items = getActiveFrameItems(studioConfig, defaultFrameItems);
    return items.map((i: any) => ({
      ...i,
      price: i.priceDisplay || (typeof i.price === 'number' ? formatPriceDisplay(i.price) : i.price)
    }));
  }, [studioConfig]);`;

content = content.replace(
  'const [selectedBingkaiSubTab, setSelectedBingkaiSubTab] = useState',
  frameDefault + '\n  const [selectedBingkaiSubTab, setSelectedBingkaiSubTab] = useState'
);

content = content.replace(
  /\{\[\s*\{\s*code:\s*'4R',[\s\S]*?Ukuran terbesar untuk pajangan dinding istimewa di rumah Anda'\s*\}\s*\]\.map\(\(item,\s*idx\)\s*=>/m,
  '{activeFrameItems.map((item, idx) =>'
);

fs.writeFileSync('src/components/PricelistViewer.tsx', content, 'utf8');
console.log('Lab & Frame updated!');

