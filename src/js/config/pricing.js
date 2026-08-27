export const PRICING = {
  shoe: {
    canvas: {
      'fast-clean': 35000,
      'deep-clean': 50000,
    },
    'mesh-knit': {
      'fast-clean': 40000,
      'deep-clean': 60000,
    },
    leather: {
      'fast-clean': 50000,
      'deep-clean': 75000,
    },
    'suede-nubuck': {
      'fast-clean': 55000,
      'deep-clean': 85000,
    },
    'rubber-eva': {
      'fast-clean': 30000,
      'deep-clean': 45000,
    },
  },
  sandal: {
    'fast-clean': 20000,
    'deep-clean': 30000,
  },
};

export const MATERIALS = [
  { id: 'canvas', name: 'Kanvas / Textile', icon: '🧵', description: 'Converse, Vans, sepatu sekolah kain' },
  { id: 'mesh-knit', name: 'Mesh / Knit', icon: '🕸️', description: 'Nike Flyknit, Adidas Ultraboost, running shoes' },
  { id: 'leather', name: 'Kulit Asli / Sintetis', icon: '👞', description: 'Pantofel, loafers, boots kulit' },
  { id: 'suede-nubuck', name: 'Suede / Nubuck', icon: '🦌', description: 'Puma Suede, sepatu suede casual' },
  { id: 'rubber-eva', name: 'Karet / EVA / Foam', icon: '🩴', description: 'Crocs-style, sepatu karet, sandal EVA' },
];

export const WASH_TYPES = [
  { 
    id: 'fast-clean', 
    name: 'Cuci Kering (Fast Clean)', 
    description: 'Pembersihan permukaan tanpa merendam. Cocok untuk sepatu premium & sensitif air.',
    duration: '1–2 hari',
    icon: '☀️',
  },
  { 
    id: 'deep-clean', 
    name: 'Cuci Basah (Deep Clean)', 
    description: 'Pencucian menyeluruh: upper, midsole, outsole, insole, tali. Menggunakan air & deterjen khusus.',
    duration: '3–5 hari',
    icon: '💧',
  },
];

export const CATEGORIES = [
  { id: 'shoe', name: 'Sepatu', icon: '👟', description: 'Sepatu sneakers, pantofel, boots, dll' },
  { id: 'sandal', name: 'Sandal', icon: '🩴', description: 'Sandal gunung, sandal jepit, flip-flop, dll' },
];

export function getPrice(category, material, washType) {
  if (category === 'sandal') {
    return PRICING.sandal[washType] || 0;
  }
  return PRICING.shoe[material]?.[washType] || 0;
}

export function getAllPrices() {
  return PRICING;
}

export function getMaterialsForCategory(category) {
  if (category === 'sandal') return [];
  return MATERIALS;
}

export function getWashTypesForMaterial(category, material) {
  if (category === 'sandal') return WASH_TYPES;
  return WASH_TYPES;
}