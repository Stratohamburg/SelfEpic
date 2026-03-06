export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Player {
  hp: number;
  maxHp: number;
  speed: number;
  gold: number;
  diamonds: number;
  gachaTickets: number;
  floor: number;
  level: number;
  exp: number;
  maxExp: number;
}

export interface Weapon {
  id: string;
  name: string;
  damage: number;
  type: 'physical' | 'magic';
  effect?: 'lifesteal' | 'crit';
  isRanged?: boolean;
  rarity: Rarity;
  level: number;
  maxLevel: number;
  stars: number;
}

export interface Pet {
  id: string;
  name: string;
  stage: 'egg' | 'baby' | 'adult';
  hunger: number;
  mood: number;
  exp: number;
  maxExp: number;
  sprite: string;
  rarity: Rarity;
  level: number;
  maxLevel: number;
  stars: number;
  skill: {
    name: string;
    type: 'damage' | 'heal' | 'buff';
    value: number;
    target: 'single' | 'all' | 'self';
    isRanged?: boolean;
  };
}

export interface Material {
  id: string;
  name: string;
  type: 'weapon_upgrade' | 'pet_upgrade' | 'weapon_fragment' | 'pet_fragment';
  quantity: number;
  rarity: Rarity;
  icon: string;
}

export interface Monster {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  damage: number;
  sprite: string;
}

export type SequenceNode =
  | { type: 'weapon', data: Weapon }
  | { type: 'pet', data: Pet };

export type ActionSequence = SequenceNode[];

export type EventType = 'combat' | 'treasure' | 'trap' | 'camp' | 'merchant' | 'shrine' | 'puzzle' | 'fountain' | 'gamble' | 'forge';

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  image?: string;
  options: {
    label: string;
    action: () => void;
  }[];
}

export interface ResultPopupData {
  title: string;
  description: string;
  image?: string;
  onClose: () => void;
}

export type LobbyTab = 'shop' | 'adventure' | 'equipment';

export interface GachaItem {
  id: string;
  name: string;
  type: 'weapon' | 'pet' | 'weapon_material' | 'pet_material' | 'weapon_fragment' | 'pet_fragment';
  rarity: Rarity;
  weight: number;
  icon: string;
  isGuaranteed?: boolean;
  weaponData?: Partial<Pick<Weapon, 'damage' | 'type' | 'isRanged' | 'effect'>>;
}