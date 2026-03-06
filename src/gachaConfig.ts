import { GachaItem } from './types';

export const GACHA_POOL: GachaItem[] = [
  // ── 传说 Legendary (总权重 5) ──
  { id: 'w_dragon_slayer', name: '屠龙剑', type: 'weapon', rarity: 'legendary', weight: 2, icon: '🐲', weaponData: { damage: 80, type: 'physical', effect: 'crit' } },
  { id: 'w_void_staff',    name: '虚空法杖', type: 'weapon', rarity: 'legendary', weight: 2, icon: '🌌', weaponData: { damage: 75, type: 'magic', isRanged: true } },
  { id: 'p_phoenix',       name: '凤凰',    type: 'pet',    rarity: 'legendary', weight: 1, icon: '🦅', isGuaranteed: true },

  // ── 史诗 Epic (总权重 18) ──
  { id: 'w_thunder_blade', name: '雷鸣之刃', type: 'weapon', rarity: 'epic', weight: 5, icon: '⚡', weaponData: { damage: 55, type: 'physical' } },
  { id: 'w_frost_bow',     name: '霜冻弓',   type: 'weapon', rarity: 'epic', weight: 5, icon: '🏹', weaponData: { damage: 50, type: 'magic', isRanged: true } },
  { id: 'p_cerberus',      name: '地狱犬',   type: 'pet',    rarity: 'epic', weight: 4, icon: '🐕' },
  { id: 'p_unicorn',       name: '独角兽',   type: 'pet',    rarity: 'epic', weight: 4, icon: '🦄' },

  // ── 稀有 Rare (总权重 50) ──
  { id: 'w_flame_sword',   name: '炎剑',   type: 'weapon', rarity: 'rare', weight: 15, icon: '🔥', weaponData: { damage: 35, type: 'physical', effect: 'lifesteal' } },
  { id: 'w_ice_wand',      name: '冰杖',   type: 'weapon', rarity: 'rare', weight: 15, icon: '❄️', weaponData: { damage: 32, type: 'magic', isRanged: true } },
  { id: 'p_wolf',          name: '战狼',   type: 'pet',    rarity: 'rare', weight: 10, icon: '🐺' },
  { id: 'p_owl',           name: '智慧枭', type: 'pet',    rarity: 'rare', weight: 10, icon: '🦉' },

  // ── 普通 Common 材料 (总权重 90) ──
  { id: 'm_weapon_frag',   name: '武器碎片',   type: 'weapon_fragment',  rarity: 'common', weight: 25, icon: '🔩' },
  { id: 'm_pet_frag',      name: '宠物碎片',   type: 'pet_fragment',     rarity: 'common', weight: 25, icon: '💠' },
  { id: 'm_weapon_stone',  name: '武器强化石', type: 'weapon_material',  rarity: 'common', weight: 20, icon: '🪨' },
  { id: 'm_pet_essence',   name: '宠物精华',   type: 'pet_material',     rarity: 'common', weight: 20, icon: '✨' },
];

// ── 消耗配置 ──
export const SINGLE_PULL_DIAMONDS  = 160;
export const MULTI_PULL_DIAMONDS   = 1500; // 10连优惠
export const SINGLE_PULL_TICKETS   = 1;
export const MULTI_PULL_TICKETS    = 10;

// ── 保底阈值 ──
export const PITY_RARE_THRESHOLD      = 10;
export const PITY_LEGENDARY_THRESHOLD = 100;

// ── 稀有度样式 ──
export const RARITY_BORDER: Record<string, string> = {
  common:    'border-gray-500',
  rare:      'border-blue-400',
  epic:      'border-purple-400',
  legendary: 'border-yellow-400',
};

export const RARITY_GLOW: Record<string, string> = {
  common:    '',
  rare:      'shadow-[0_0_8px_rgba(96,165,250,0.5)]',
  epic:      'shadow-[0_0_8px_rgba(192,132,252,0.6)]',
  legendary: 'shadow-[0_0_14px_rgba(250,204,21,0.8)]',
};

export const RARITY_TEXT: Record<string, string> = {
  common:    'text-gray-400',
  rare:      'text-blue-400',
  epic:      'text-purple-400',
  legendary: 'text-yellow-400',
};

export const RARITY_LABEL: Record<string, string> = {
  common:    '普通',
  rare:      '稀有',
  epic:      '史诗',
  legendary: '传说',
};

// ── 核心抽奖逻辑 ──
function weightedRandom(pool: GachaItem[]): GachaItem {
  const totalWeight = pool.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * totalWeight;
  for (const item of pool) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return pool[pool.length - 1];
}

export function performPull(
  pityCount: number
): { item: GachaItem; newPityCount: number } {
  const newPity = pityCount + 1;
  let pool = [...GACHA_POOL];

  if (newPity >= PITY_LEGENDARY_THRESHOLD) {
    pool = pool.filter(i => i.rarity === 'legendary');
  } else if (newPity % PITY_RARE_THRESHOLD === 0) {
    pool = pool.filter(i => ['rare', 'epic', 'legendary'].includes(i.rarity));
  }

  const item = weightedRandom(pool);
  // 获得史诗/传说后重置保底计数
  const resetPity = ['epic', 'legendary'].includes(item.rarity) ? 0 : newPity;
  return { item, newPityCount: resetPity };
}
