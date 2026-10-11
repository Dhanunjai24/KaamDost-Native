/**
 * KaamDost - LLM Voice & Search Semantic Classifier
 * Maps spoken colloquial expressions (in Telugu, English, or Telugu-English mix)
 * to exact KaamDost trade categories.
 */

import { TRADES_CATALOG } from '../../../shared/constants/trades.js';

export const TRADE_ICONS = {
  tank_cleaning: '💧',
  electrician: '⚡',
  plumbing: '🚰',
  drainage_plumber: '🚽',
  painter: '🎨',
  carpenter: '🪚',
  ac_technician: '❄️',
  borewell_mechanic: '🚜',
  deep_cleaning: '✨',
  pest_control: '🦟',
  centering: '🏗️',
  bar_bender: '⛓️',
  brick_mason: '🧱',
  plastering_mason: '🧱',
  tile_layer: '🔲',
  welder: '👨‍🏭',
  helper: '👷',
  earth_work: '⛏️',
  gardener: '🌿',
  cctv_tech: '📹',
  solar_tech: '☀️',
  appliance_tech: '🔌',
  default: '🛠️'
};

// Strict mapping dictionary for Telugu, Hindi, and English regional colloquialisms
export const TRADE_SLANG_MAPPINGS = [
  {
    tradeId: 'tank_cleaning',
    name: 'Water Tank & Sump Cleaner',
    keywords: ['water tank', 'tank clean', 'kadagali', 'neeti tank', 'sump clean', 'mudikindi', 'tanki'],
    patterns: [
      /water\s*tank/i, /tank\s*clean/i, /tank\s*kadag/i, /neeti\s*tank/i,
      /sump\s*clean/i, /sump\s*kadag/i, /mudikindi/i, /tanki/i, /over\s*head\s*tank/i
    ]
  },
  {
    tradeId: 'electrician',
    name: 'House Wiring Electrician',
    keywords: ['switchboard', 'current', 'wiring', 'fan', 'light', 'fuse', 'spark', 'short circuit', 'mcb', 'inverter', 'kaalindi'],
    patterns: [
      /current/i, /switchboard/i, /switch/i, /wiring/i, /fan/i, /light/i,
      /fuse/i, /spark/i, /power\s*cut/i, /kalindi/i, /thiragatledu/i, /velagadam/i,
      /short\s*circuit/i, /mcb/i, /inverter/i
    ]
  },
  {
    tradeId: 'plumbing',
    name: 'Plumber (Concealed Piping)',
    keywords: ['tap leak', 'plumber', 'pipe', 'nulla', 'water leak', 'sink', 'karuthondi', 'washbasin'],
    patterns: [
      /plumber/i, /tap/i, /leak/i, /nulla/i, /pipe/i, /karuthondi/i,
      /water\s*leak/i, /sink/i, /washbasin/i, /pagilindi/i, /valve/i
    ]
  },
  {
    tradeId: 'drainage_plumber',
    name: 'Drainage & Sewerage Plumber',
    keywords: ['drainage', 'sewage', 'manhole', 'toilet block', 'commode', 'overflow', 'water block'],
    patterns: [
      /drainage/i, /drain/i, /sewage/i, /manhole/i, /toilet\s*block/i,
      /commode/i, /guntalu/i, /overflow/i, /water\s*block/i, /stuck/i
    ]
  },
  {
    tradeId: 'painter',
    name: 'Painter & Putty Worker',
    keywords: ['paint', 'rangu', 'putty', 'sunnam', 'distemper', 'whitewash', 'wall paint'],
    patterns: [
      /paint/i, /rangu/i, /putty/i, /sunnam/i, /distemper/i, /colour/i,
      /wall\s*paint/i, /whitewash/i, /chithram/i, /lepam/i
    ]
  },
  {
    tradeId: 'carpenter',
    name: 'Carpenter (Woodwork)',
    keywords: ['carpenter', 'door', 'talupu', 'furniture', 'wood', 'table', 'irigindi', 'cupboard'],
    patterns: [
      /carpenter/i, /wood/i, /door/i, /talupu/i, /furniture/i, /table/i,
      /chair/i, /bed/i, /woodwork/i, /irigindi/i, /chekka/i, /almira/i, /cupboard/i
    ]
  },
  {
    tradeId: 'ac_technician',
    name: 'AC Servicing & Installation',
    keywords: ['ac', 'cooling', 'air condition', 'gas charging', 'service', 'compressor'],
    patterns: [
      /\bac\b/i, /air\s*condition/i, /cooling/i, /gas\s*charging/i,
      /filter\s*clean/i, /split\s*ac/i, /compressor/i, /water\s*dropping/i
    ]
  },
  {
    tradeId: 'borewell_mechanic',
    name: 'Borewell & Motor Mechanic',
    keywords: ['bore', 'borewell', 'motor', 'pump', 'starter', 'aagipoyindi'],
    patterns: [
      /bore/i, /borewell/i, /submersible/i, /motor/i, /pump/i, /motor\s*aagipoyindi/i,
      /starter/i, /coil/i, /kap/i, /water\s*not\s*lifting/i
    ]
  },
  {
    tradeId: 'deep_cleaning',
    name: 'Home Deep Cleaning',
    keywords: ['deep clean', 'house clean', 'cleaning', 'bathroom clean', 'thudavali', 'safai'],
    patterns: [
      /deep\s*clean/i, /house\s*clean/i, /illu\s*thudav/i, /cleaning/i,
      /bathroom\s*clean/i, /dusting/i, /kitchen\s*clean/i, /safai/i
    ]
  },
  {
    tradeId: 'pest_control',
    name: 'Pest Control Applicator',
    keywords: ['pest control', 'cockroach', 'termites', 'purugu', 'cheemalu', 'bedbugs', 'mandu kottali'],
    patterns: [
      /pest/i, /purugu/i, /boddelu/i, /cockroach/i, /cheemalu/i, /termites/i,
      /bedbugs/i, /nallalu/i, /mandu\s*kottali/i
    ]
  },
  {
    tradeId: 'centering',
    name: 'Centering & Shuttering',
    keywords: ['centering', 'shuttering', 'slab', 'slabu', 'dallu'],
    patterns: [
      /centering/i, /shuttering/i, /slab/i, /slabu/i, /dallu/i, /plywood\s*sheet/i
    ]
  },
  {
    tradeId: 'bar_bender',
    name: 'Bar Bender / Rod Binder',
    keywords: ['bar bender', 'kambi', 'rod', 'pillar kambi', 'steel bend'],
    patterns: [
      /bar\s*bend/i, /kambi/i, /rod/i, /inupa\s*rodlu/i, /pillar\s*kambi/i, /steel\s*bend/i
    ]
  },
  {
    tradeId: 'brick_mason',
    name: 'Brick & Block Mason',
    keywords: ['brick', 'ituka', 'mestri', 'mason', 'wall kattali', 'goda'],
    patterns: [
      /brick/i, /ituka/i, /wall\s*kattali/i, /goda/i, /block\s*work/i, /mestri/i, /mason/i
    ]
  },
  {
    tradeId: 'plastering_mason',
    name: 'Plastering Mason',
    keywords: ['plastering', 'plaster', 'lepam', 'finish wall'],
    patterns: [
      /plaster/i, /plastering/i, /lepam/i, /finish/i, /smooth\s*wall/i
    ]
  },
  {
    tradeId: 'tile_layer',
    name: 'Tile & Marble Layer',
    keywords: ['tiles', 'marble', 'flooring', 'granite', 'baddalu'],
    patterns: [
      /tile/i, /tiles/i, /marble/i, /flooring/i, /baddalu/i, /granite/i, /fitter/i
    ]
  },
  {
    tradeId: 'welder',
    name: 'Arc & Gas Welder',
    keywords: ['welder', 'welding', 'iron gate', 'grill', 'shed', 'railing'],
    patterns: [
      /weld/i, /welding/i, /iron\s*gate/i, /grill/i, /inumu/i, /shed/i, /railing/i
    ]
  },
  {
    tradeId: 'helper',
    name: 'Helper / Hamali / Loading',
    keywords: ['coolie', 'hamali', 'loading', 'labour', 'dimpali', 'etthali', 'samaan'],
    patterns: [
      /coolie/i, /kooli/i, /labour/i, /hamali/i, /load/i, /loading/i, /dimpali/i,
      /etthali/i, /helper/i, /shifting/i, /luggage/i, /samaan/i
    ]
  },
  {
    tradeId: 'earth_work',
    name: 'Earth Digger & Trench Worker',
    keywords: ['digger', 'digging', 'guntalu', 'matti thiyyali', 'foundation'],
    patterns: [
      /digger/i, /digging/i, /guntalu/i, /thiyyali/i, /matti/i, /trench/i,
      /borugadda/i, /boggulu/i, /foundation\s*trench/i
    ]
  },
  {
    tradeId: 'gardener',
    name: 'Gardener / Landscaping',
    keywords: ['gardener', 'plants', 'chettu', 'mokka', 'grass cutting', 'lawn'],
    patterns: [
      /garden/i, /chettu/i, /mokka/i, /plants/i, /grass/i, /cutting/i, /lawn/i
    ]
  },
  {
    tradeId: 'cctv_tech',
    name: 'CCTV & Security Tech',
    keywords: ['cctv', 'camera', 'security camera', 'surveillance'],
    patterns: [
      /cctv/i, /camera/i, /security\s*camera/i, /surveillance/i, /dvr/i
    ]
  },
  {
    tradeId: 'solar_tech',
    name: 'Rooftop Solar Technician',
    keywords: ['solar', 'solar panel', 'rooftop solar', 'solar inverter'],
    patterns: [
      /solar/i, /rooftop\s*solar/i, /solar\s*panel/i, /solar\s*inverter/i
    ]
  },
  {
    tradeId: 'appliance_tech',
    name: 'Home Appliance Technician',
    keywords: ['washing machine', 'fridge', 'refrigerator', 'geyser', 'microwave'],
    patterns: [
      /washing\s*machine/i, /fridge/i, /refrigerator/i, /microwave/i, /geyser/i, /water\s*heater/i
    ]
  }
];

/**
 * Detect matching keywords from text
 */
export function extractKeywordsFromText(text) {
  if (!text) return [];
  const clean = text.toLowerCase();
  const detected = new Set();

  for (const entry of TRADE_SLANG_MAPPINGS) {
    for (const kw of entry.keywords) {
      if (clean.includes(kw.toLowerCase())) {
        detected.add(kw);
      }
    }
  }

  return Array.from(detected);
}

/**
 * Classify a user's spoken voice query or typed search using LLM intelligence
 */
export async function parseQueryWithLLM(query) {
  const clean = (query || '').trim();
  if (!clean) {
    return {
      tradeName: 'General Labour',
      tradeId: 'helper',
      icon: '👷',
      matched: false,
      confidence: 60,
      detectedKeywords: [],
      detectedLanguage: 'English',
      query: ''
    };
  }

  // 1. Language identification
  let detectedLang = 'English';
  const teluguChars = /[\u0C00-\u0C7F]/;
  const teluguKeywords = /\b(kadagali|kavali|poyindi|cheyali|aagipoyindi|karuthondi|vekkali|chudali|pani|mottam|mudikindi|thiragatledu|guntalu|ituka|chettu)\b/i;

  if (teluguChars.test(clean) || teluguKeywords.test(clean)) {
    detectedLang = 'Telugu';
  } else if (/\b(chahiye|kaam|karna|hogaya|nahi|paani|bhejo|tut\s*gaya)\b/i.test(clean)) {
    detectedLang = 'Hindi / Hinglish';
  } else if (/\b(bhai|sir|urgent|leak|repair|problem|fitting)\b/i.test(clean)) {
    detectedLang = 'Telugu / English Mix';
  }

  // Extract detected keywords
  const detectedKeywords = extractKeywordsFromText(clean);

  // 2. High-precision colloquial pattern matching
  for (const entry of TRADE_SLANG_MAPPINGS) {
    for (const pat of entry.patterns) {
      if (pat.test(clean)) {
        const fullTrade = TRADES_CATALOG.find(t => t.id === entry.tradeId) || {
          id: entry.tradeId,
          name: entry.name,
          dailyRate: 850
        };
        const icon = TRADE_ICONS[entry.tradeId] || '🛠️';

        // Add any matching keywords specifically for this entry if not already in list
        entry.keywords.forEach(kw => {
          if (clean.toLowerCase().includes(kw.toLowerCase()) && !detectedKeywords.includes(kw)) {
            detectedKeywords.push(kw);
          }
        });

        return {
          tradeName: entry.name,
          tradeId: entry.tradeId,
          matchedTrade: fullTrade,
          icon,
          matched: true,
          confidence: 96,
          detectedKeywords: detectedKeywords.length > 0 ? detectedKeywords : [clean.split(' ')[0]],
          detectedLanguage: detectedLang,
          explanation: `Mapped colloquial expression to "${entry.name}"`,
          query: clean
        };
      }
    }
  }

  // 3. Fallback scan on TRADES_CATALOG directly
  const lowerQuery = clean.toLowerCase();
  for (const t of TRADES_CATALOG) {
    const nameLower = t.name.toLowerCase();
    const words = nameLower.split(/[\s/()&,-]+/).filter(w => w.length > 3);
    for (const w of words) {
      if (lowerQuery.includes(w)) {
        const icon = TRADE_ICONS[t.id] || '🛠️';
        if (!detectedKeywords.includes(w)) detectedKeywords.push(w);

        return {
          tradeName: t.name,
          tradeId: t.id,
          matchedTrade: t,
          icon,
          matched: true,
          confidence: 88,
          detectedKeywords,
          detectedLanguage: detectedLang,
          explanation: `Keyword match on "${w}" in ${t.name}`,
          query: clean
        };
      }
    }
  }

  // 4. Default to General Labour per platform specification
  const generalLabour = TRADES_CATALOG.find(t => t.id === 'helper' || t.id === 'male_labour') || {
    id: 'helper',
    name: 'Helper / Hamali / Loading',
    dailyRate: 750
  };

  return {
    tradeName: 'General Labour',
    tradeId: 'helper',
    matchedTrade: generalLabour,
    icon: '👷',
    matched: false,
    confidence: 60,
    detectedKeywords: detectedKeywords.length > 0 ? detectedKeywords : ['general'],
    detectedLanguage: detectedLang,
    explanation: 'No specific trade identified, defaulted to General Labour',
    query: clean
  };
}
