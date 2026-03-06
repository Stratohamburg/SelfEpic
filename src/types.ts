export interface Player {
  hp: number;
  maxHp: number;
  speed: number;
  gold: number;
  floor: number;
}

export interface Weapon {
  id: string;
  name: string;
  damage: number;
  type: 'physical' | 'magic';
  effect?: 'lifesteal' | 'crit';
  isRanged?: boolean;
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
  skill: {
    name: string;
    type: 'damage' | 'heal' | 'buff';
    value: number;
    target: 'single' | 'all' | 'self';
    isRanged?: boolean;
  };
}

export interface Monster {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  damage: number;
  sprite: string; // Emoji or image URL
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