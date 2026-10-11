// KaamDost - Complete Real-World 46 Ground Trades Catalog
export const TRADES_CATALOG = [
  // --- Civil & Structural Construction ---
  { id: 'head_mason', name: 'Head Mason', telugu: 'పెద్ద మేస్త్రీ', category: 'Civil', icon: 'hammer-wrench', emoji: '🔨', color: '#ea580c', bg: '#fff7ed', dailyRate: 1100, count: '65+ Near You' },
  { id: 'masonry', name: 'Brick & Block Mason', telugu: 'ఇటుక మేస్త్రీ', category: 'Civil', icon: 'hammer-wrench', emoji: '🧱', color: '#ea580c', bg: '#fff7ed', dailyRate: 950, count: '140+ Near You' },
  { id: 'plastering', name: 'Plastering Mason', telugu: 'ప్లాస్టరింగ్ మేస్త్రీ', category: 'Civil', icon: 'view-grid', emoji: '🧱', color: '#f97316', bg: '#fff7ed', dailyRate: 950, count: '90+ Near You' },
  { id: 'centering', name: 'Centering & Shuttering', telugu: 'సెంటరింగ్', category: 'Civil', icon: 'reorder-horizontal', emoji: '🏗️', color: '#9333ea', bg: '#faf5ff', dailyRate: 950, count: '55+ Near You' },
  { id: 'bar_bending', name: 'Bar Bender / Rod Binder', telugu: 'రాడ్ బైండర్', category: 'Civil', icon: 'hammer', emoji: '🗜️', color: '#a855f7', bg: '#faf5ff', dailyRate: 900, count: '75+ Near You' },
  { id: 'concrete_vibrator', name: 'Concrete Vibrator Operator', telugu: 'వైబ్రేటర్ ఆపరేటర్', category: 'Civil', icon: 'wrench', emoji: '⚙️', color: '#7c3aed', bg: '#f5f3ff', dailyRate: 850, count: '40+ Near You' },
  { id: 'scaffolding', name: 'Scaffolding Worker', telugu: 'సారాలు కట్టే పని', category: 'Civil', icon: 'ladder', emoji: '🪜', color: '#4f46e5', bg: '#eef2ff', dailyRate: 800, count: '60+ Near You' },
  { id: 'demolition', name: 'Demolition & Breaking', telugu: 'కూల్చివేత', category: 'Civil', icon: 'hammer', emoji: '💥', color: '#dc2626', bg: '#fef2f2', dailyRate: 850, count: '50+ Near You' },
  { id: 'waterproofing', name: 'Waterproofing Specialist', telugu: 'వాటర్‌ప్రూఫింగ్', category: 'Civil', icon: 'water', emoji: '💧', color: '#0284c7', bg: '#f0f9ff', dailyRate: 950, count: '48+ Near You' },

  // --- Finishing, Flooring & Interiors ---
  { id: 'tile_marble', name: 'Tile & Marble Layer', telugu: 'టైల్స్ మేస్త్రీ', category: 'Finishing', icon: 'view-grid', emoji: '📐', color: '#0d9488', bg: '#f0fdfa', dailyRate: 950, count: '85+ Near You' },
  { id: 'granite_layer', name: 'Granite & Marble Fitter', telugu: 'గ్రానైట్ మేస్త్రీ', category: 'Finishing', icon: 'view-grid', emoji: '🏛️', color: '#059669', bg: '#ecfdf5', dailyRate: 1000, count: '60+ Near You' },
  { id: 'marble_polisher', name: 'Marble & Granite Polisher', telugu: 'మార్బుల్ పాలిషర్', category: 'Finishing', icon: 'auto-fix', emoji: '✨', color: '#10b981', bg: '#ecfdf5', dailyRate: 850, count: '45+ Near You' },
  { id: 'carpentry', name: 'Carpenter (Woodwork)', telugu: 'వడ్రంగి', category: 'Interiors', icon: 'hammer', emoji: '🪚', color: '#d97706', bg: '#fffbeb', dailyRate: 900, count: '80+ Near You' },
  { id: 'modular_interior', name: 'Modular Furniture Carpenter', telugu: 'ఇంటీరియర్ కార్పెంటర్', category: 'Interiors', icon: 'door', emoji: '🚪', color: '#b45309', bg: '#fffbeb', dailyRate: 1000, count: '70+ Near You' },
  { id: 'false_ceiling', name: 'False Ceiling (POP / Gypsum)', telugu: 'ఫాల్స్ సీలింగ్', category: 'Interiors', icon: 'view-dashboard', emoji: '🪟', color: '#ca8a04', bg: '#fefce8', dailyRate: 900, count: '52+ Near You' },
  { id: 'painting', name: 'Painter & Putty Worker', telugu: 'పెయింటర్', category: 'Finishing', icon: 'format-paint', emoji: '🎨', color: '#8b5cf6', bg: '#f5f3ff', dailyRate: 850, count: '95+ Near You' },
  { id: 'wood_polish', name: 'Wood Polisher / PU Spray', telugu: 'వుడ్ పాలిషర్', category: 'Finishing', icon: 'brush', emoji: '🪵', color: '#92400e', bg: '#fef3c7', dailyRate: 900, count: '38+ Near You' },
  { id: 'wallpaper_vinyl', name: 'Wallpaper & Vinyl Flooring', telugu: 'వాల్‌పేపర్ ఫిట్టర్', category: 'Finishing', icon: 'layers', emoji: '📜', color: '#65a30d', bg: '#f7fee7', dailyRate: 850, count: '35+ Near You' },

  // --- Electrical, Solar & Security ---
  { id: 'electrical', name: 'House Wiring Electrician', telugu: 'ఎలక్ట్రీషియన్', category: 'Electrical', icon: 'flash', emoji: '⚡', color: '#eab308', bg: '#fefce8', dailyRate: 850, count: '110+ Near You' },
  { id: 'three_phase_electrician', name: '3-Phase Power Tech', telugu: '3-ఫేజ్ ఎలక్ట్రీషియన్', category: 'Electrical', icon: 'power-plug', emoji: '🔌', color: '#f59e0b', bg: '#fefce8', dailyRate: 950, count: '44+ Near You' },
  { id: 'inverter_battery', name: 'Inverter & Battery Tech', telugu: 'ఇన్వర్టర్ టెక్నీషియన్', category: 'Electrical', icon: 'battery-charging', emoji: '🔋', color: '#e11d48', bg: '#fff1f2', dailyRate: 800, count: '40+ Near You' },
  { id: 'solar_tech', name: 'Rooftop Solar Technician', telugu: 'సోలార్ ఫిట్టర్', category: 'Electrical', icon: 'white-balance-sunny', emoji: '☀️', color: '#f97316', bg: '#fff7ed', dailyRate: 950, count: '32+ Near You' },
  { id: 'cctv_security', name: 'CCTV & Security Tech', telugu: 'CCTV టెక్నీషియన్', category: 'Electrical', icon: 'cctv', emoji: '📹', color: '#0284c7', bg: '#f0f9ff', dailyRate: 850, count: '55+ Near You' },
  { id: 'automatic_gate', name: 'Automatic Gate & Fence Tech', telugu: 'ఆటోమేటిక్ గేట్ ఫిట్టర్', category: 'Electrical', icon: 'gate', emoji: '🚧', color: '#475569', bg: '#f8fafc', dailyRate: 900, count: '28+ Near You' },

  // --- Plumbing & Water Infrastructure ---
  { id: 'plumbing', name: 'Plumber (Concealed Piping)', telugu: 'ప్లంబర్', category: 'Plumbing', icon: 'water', emoji: '🚰', color: '#0284c7', bg: '#f0f9ff', dailyRate: 800, count: '120+ Near You' },
  { id: 'sanitary_ware', name: 'Sanitary Ware Fitter', telugu: 'శానిటరీ ఫిట్టర్', category: 'Plumbing', icon: 'shower', emoji: '🚽', color: '#0369a1', bg: '#e0f2fe', dailyRate: 850, count: '65+ Near You' },
  { id: 'drainage_sewer', name: 'Drainage & Sewerage Plumber', telugu: 'డ్రైనేజ్ వర్కర్', category: 'Plumbing', icon: 'pipe', emoji: '🕳️', color: '#0f766e', bg: '#f0fdfa', dailyRate: 800, count: '48+ Near You' },
  { id: 'water_tank_sump', name: 'Overhead Tank & Sump Tech', telugu: 'వాటర్ ట్యాంక్ ఫిట్టర్', category: 'Plumbing', icon: 'barrel', emoji: '🛢️', color: '#0284c7', bg: '#f0f9ff', dailyRate: 800, count: '50+ Near You' },
  { id: 'borewell_motor', name: 'Borewell & Motor Mechanic', telugu: 'బోర్‌వెల్ మెకానిక్', category: 'Plumbing', icon: 'engine', emoji: '🌊', color: '#0891b2', bg: '#ecfeff', dailyRate: 1000, count: '38+ Near You' },
  { id: 'ro_purifier', name: 'RO Water Purifier Tech', telugu: 'వాటర్ ప్యూరిఫైయర్', category: 'Plumbing', icon: 'water-pump', emoji: '🥛', color: '#06b6d4', bg: '#ecfeff', dailyRate: 800, count: '42+ Near You' },

  // --- Metal, Fabrication & Glass ---
  { id: 'welding', name: 'Arc & Gas Welder', telugu: 'వెల్డర్', category: 'Fabrication', icon: 'fire', emoji: '🔥', color: '#dc2626', bg: '#fef2f2', dailyRate: 900, count: '70+ Near You' },
  { id: 'roofing_shed', name: 'Iron Shed & Sheet Roofing', telugu: 'రూఫింగ్ & షెడ్ వర్క్', category: 'Fabrication', icon: 'home-roof', emoji: '🛖', color: '#b91c1c', bg: '#fef2f2', dailyRate: 950, count: '45+ Near You' },
  { id: 'aluminium_fabrication', name: 'Aluminium Section Worker', telugu: 'అల్యూమినియం వర్కర్', category: 'Fabrication', icon: 'window-closed', emoji: '🪟', color: '#64748b', bg: '#f8fafc', dailyRate: 900, count: '60+ Near You' },
  { id: 'toughened_glass', name: 'Toughened Glass & Glazing', telugu: 'టఫ్‌న్డ్ గ్లాస్ ఫిట్టర్', category: 'Fabrication', icon: 'window-shutter', emoji: '💎', color: '#0284c7', bg: '#f0f9ff', dailyRate: 1000, count: '36+ Near You' },
  { id: 'rolling_shutter', name: 'Rolling Shutter Mechanic', telugu: 'రోలింగ్ షట్టర్', category: 'Fabrication', icon: 'door-sliding', emoji: '🏪', color: '#475569', bg: '#f8fafc', dailyRate: 900, count: '30+ Near You' },

  // --- General Daily Labour & Logistics ---
  { id: 'construction_labour', name: 'Male Construction Labour', telugu: 'మగ కూలీ (హెల్పర్)', category: 'Labour', icon: 'hard-hat', emoji: '👷', color: '#c2410c', bg: '#fff7ed', dailyRate: 700, count: '180+ Near You' },
  { id: 'female_labour', name: 'Female Site Labour (Chitta)', telugu: 'ఆడ కూలీ (చిత్తా)', category: 'Labour', icon: 'hard-hat', emoji: '👷‍♀️', color: '#ea580c', bg: '#fff7ed', dailyRate: 650, count: '130+ Near You' },
  { id: 'helper', name: 'Helper / Hamali / Loading', telugu: 'హెల్పర్ / హమాలి', category: 'Labour', icon: 'human-dolly', emoji: '📦', color: '#4f46e5', bg: '#eef2ff', dailyRate: 650, count: '115+ Near You' },
  { id: 'earth_digger', name: 'Earth Digger & Trench Worker', telugu: 'మట్టి తీసే కూలీ', category: 'Labour', icon: 'shovel', emoji: '⛏️', color: '#854d0e', bg: '#fefce8', dailyRate: 750, count: '65+ Near You' },
  { id: 'driver', name: 'Goods Driver (Auto/Tractor)', telugu: 'గూడ్స్ డ్రైవర్', category: 'Logistics', icon: 'truck', emoji: '🚚', color: '#2563eb', bg: '#eff6ff', dailyRate: 850, count: '80+ Near You' },

  // --- Maintenance, Cleaning & Appliances ---
  { id: 'cleaning', name: 'Home Deep Cleaning', telugu: 'డీప్ క్లీనింగ్ వర్కర్', category: 'Cleaning', icon: 'broom', emoji: '🧹', color: '#16a34a', bg: '#f0fdf4', dailyRate: 650, count: '125+ Near You' },
  { id: 'water_tank_cleaner', name: 'Water Tank & Sump Cleaner', telugu: 'ట్యాంక్ క్లీనర్', category: 'Cleaning', icon: 'spray-bottle', emoji: '🧼', color: '#059669', bg: '#ecfdf5', dailyRate: 750, count: '58+ Near You' },
  { id: 'pest_control', name: 'Pest Control Applicator', telugu: 'పెస్ట్ కంట్రోల్ టెక్', category: 'Maintenance', icon: 'bug', emoji: '🐜', color: '#15803d', bg: '#f0fdf4', dailyRate: 750, count: '50+ Near You' },
  { id: 'gardener', name: 'Gardener / Landscaping', telugu: 'తోటమాలి (గార్డెనర్)', category: 'Maintenance', icon: 'sprout', emoji: '🌱', color: '#16a34a', bg: '#f0fdf4', dailyRate: 650, count: '70+ Near You' },
  { id: 'appliance_repair', name: 'Home Appliance Technician', telugu: 'ఉపకరణాల మెకానిక్', category: 'Maintenance', icon: 'wrench', emoji: '🛠️', color: '#059669', bg: '#ecfdf5', dailyRate: 800, count: '85+ Near You' },
  { id: 'ac_technician', name: 'AC Servicing & Installation', telugu: 'AC టెక్నీషియన్', category: 'Maintenance', icon: 'snowflake', emoji: '❄️', color: '#0284c7', bg: '#f0f9ff', dailyRate: 900, count: '65+ Near You' }
];

export const ALL_TRADES_MAP = TRADES_CATALOG.reduce((acc, trade) => {
  acc[trade.id] = trade;
  return acc;
}, {});

export const TRADE_CATEGORIES = [
  'All',
  'Civil',
  'Finishing',
  'Interiors',
  'Electrical',
  'Plumbing',
  'Fabrication',
  'Labour',
  'Logistics',
  'Cleaning',
  'Maintenance'
];
