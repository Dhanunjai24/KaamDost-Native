// KaamDost - 13 Core Telangana Trades & Full Catalog
export const TRADES_CATALOG = [
  { id: 'masonry', name: 'Mason', telugu: 'మేస్త్రీ', icon: 'hammer-wrench', color: '#ea580c', bg: '#fff7ed', dailyRate: 950, count: '120+ Near You' },
  { id: 'electrical', name: 'Electrician', telugu: 'ఎలక్ట్రీషియన్', icon: 'flash', color: '#eab308', bg: '#fefce8', dailyRate: 850, count: '85+ Near You' },
  { id: 'plumbing', name: 'Plumber', telugu: 'ప్లంబర్', icon: 'water', color: '#0284c7', bg: '#f0f9ff', dailyRate: 800, count: '94+ Near You' },
  { id: 'painting', name: 'Painter', telugu: 'పెయింటర్', icon: 'format-paint', color: '#8b5cf6', bg: '#f5f3ff', dailyRate: 850, count: '76+ Near You' },
  { id: 'carpentry', name: 'Carpenter', telugu: 'వడ్రంగి', icon: 'hammer', color: '#d97706', bg: '#fffbeb', dailyRate: 900, count: '62+ Near You' },
  { id: 'welding', name: 'Welder', telugu: 'వెల్డర్', icon: 'fire', color: '#dc2626', bg: '#fef2f2', dailyRate: 900, count: '48+ Near You' },
  { id: 'tile_marble', name: 'Tile & Marble', telugu: 'టైల్స్ మేస్త్రీ', icon: 'view-grid', color: '#0d9488', bg: '#f0fdfa', dailyRate: 950, count: '55+ Near You' },
  { id: 'cleaning', name: 'Cleaning', telugu: 'క్లీనింగ్', icon: 'broom', color: '#16a34a', bg: '#f0fdf4', dailyRate: 600, count: '110+ Near You' },
  { id: 'construction_labour', name: 'Construction Labour', telugu: 'కూలీ', icon: 'hard-hat', color: '#c2410c', bg: '#fff7ed', dailyRate: 700, count: '140+ Near You' },
  { id: 'helper', name: 'Helper / Hamali', telugu: 'హెల్పర్', icon: 'human-dolly', color: '#4f46e5', bg: '#eef2ff', dailyRate: 650, count: '90+ Near You' },
  { id: 'driver', name: 'Driver', telugu: 'డ్రైవర్', icon: 'truck', color: '#2563eb', bg: '#eff6ff', dailyRate: 850, count: '70+ Near You' },
  { id: 'centering', name: 'Centering & Bending', telugu: 'సెంటరింగ్', icon: 'reorder-horizontal', color: '#9333ea', bg: '#faf5ff', dailyRate: 950, count: '45+ Near You' },
  { id: 'appliance_repair', name: 'Appliance Repair', telugu: 'ఉపకరణాలు', icon: 'wrench', color: '#059669', bg: '#ecfdf5', dailyRate: 800, count: '68+ Near You' }
];

export const ALL_TRADES_MAP = TRADES_CATALOG.reduce((acc, trade) => {
  acc[trade.id] = trade;
  return acc;
}, {});
