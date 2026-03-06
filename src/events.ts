import { GameEvent, Monster, Weapon, Pet, ResultPopupData } from './types';

// ==========================================
// 预定义的怪物库（10个）
// ==========================================
export const MONSTERS: Record<string, Monster> = {
  goblin:    { id: 'm_goblin',    name: 'Goblin',            hp: 30,  maxHp: 30,  damage: 5,  sprite: '👺' },
  slime:     { id: 'm_slime',     name: 'Toxic Slime',       hp: 45,  maxHp: 45,  damage: 8,  sprite: '🦠' },
  skeleton:  { id: 'm_skeleton',  name: 'Skeleton Warrior',  hp: 60,  maxHp: 60,  damage: 12, sprite: '💀' },
  dragon:    { id: 'm_dragon',    name: 'Lesser Dragon',     hp: 120, maxHp: 120, damage: 20, sprite: '🐲' },
  bat:       { id: 'm_bat',       name: 'Vampire Bat',       hp: 25,  maxHp: 25,  damage: 6,  sprite: '🦇' },
  wolf:      { id: 'm_wolf',      name: 'Dire Wolf',         hp: 50,  maxHp: 50,  damage: 10, sprite: '🐺' },
  golem:     { id: 'm_golem',     name: 'Stone Golem',       hp: 100, maxHp: 100, damage: 15, sprite: '🗿' },
  ghost:     { id: 'm_ghost',     name: 'Wraith',            hp: 40,  maxHp: 40,  damage: 14, sprite: '👻' },
  spider:    { id: 'm_spider',    name: 'Giant Spider',      hp: 55,  maxHp: 55,  damage: 9,  sprite: '🕷️' },
  minotaur:  { id: 'm_minotaur',  name: 'Minotaur',          hp: 90,  maxHp: 90,  damage: 18, sprite: '🐂' },
};

// ==========================================
// 预定义的武器库（10个）
// ==========================================
export const WEAPONS: Record<string, Weapon> = {
  rustySword:    { id: 'w_rusty_sword',    name: 'Rusty Sword',       damage: 15, type: 'physical' },
  ironAxe:       { id: 'w_iron_axe',       name: 'Iron Axe',          damage: 20, type: 'physical' },
  magicStaff:    { id: 'w_magic_staff',    name: 'Magic Staff',       damage: 18, type: 'magic',    isRanged: true },
  vampireDagger: { id: 'w_vampire_dagger', name: 'Vampire Dagger',    damage: 12, type: 'physical', effect: 'lifesteal' },
  flameSword:    { id: 'w_flame_sword',    name: 'Flame Sword',       damage: 22, type: 'magic' },
  crossbow:      { id: 'w_crossbow',       name: 'Heavy Crossbow',    damage: 25, type: 'physical', isRanged: true },
  holyMace:      { id: 'w_holy_mace',      name: 'Holy Mace',         damage: 17, type: 'magic',    effect: 'crit' },
  poisonBlade:   { id: 'w_poison_blade',   name: 'Poison Blade',      damage: 14, type: 'physical', effect: 'crit' },
  thunderSpear:  { id: 'w_thunder_spear',  name: 'Thunder Spear',     damage: 28, type: 'magic',    isRanged: true },
  demonScythe:   { id: 'w_demon_scythe',   name: 'Demon Scythe',      damage: 30, type: 'physical', effect: 'lifesteal' },
};

// ==========================================
// 预定义的宠物库（10个）
// ==========================================
export const PETS: Record<string, Pet> = {
  slimey: {
    id: 'p_slimey', name: 'Slimey', stage: 'egg', hunger: 100, mood: 100, exp: 0, maxExp: 50, sprite: '🥚',
    skill: { name: 'Tackle', type: 'damage', value: 5, target: 'single', isRanged: false },
  },
  sparky: {
    id: 'p_sparky', name: 'Sparky', stage: 'egg', hunger: 100, mood: 100, exp: 0, maxExp: 50, sprite: '🥚',
    skill: { name: 'Spark', type: 'damage', value: 8, target: 'single', isRanged: true },
  },
  leafy: {
    id: 'p_leafy', name: 'Leafy', stage: 'egg', hunger: 100, mood: 100, exp: 0, maxExp: 50, sprite: '🥚',
    skill: { name: 'Vine Whip', type: 'damage', value: 6, target: 'single', isRanged: true },
  },
  bubbles: {
    id: 'p_bubbles', name: 'Bubbles', stage: 'egg', hunger: 100, mood: 100, exp: 0, maxExp: 50, sprite: '🥚',
    skill: { name: 'Water Jet', type: 'damage', value: 7, target: 'single', isRanged: true },
  },
  ember: {
    id: 'p_ember', name: 'Ember', stage: 'egg', hunger: 100, mood: 100, exp: 0, maxExp: 50, sprite: '🥚',
    skill: { name: 'Fireball', type: 'damage', value: 10, target: 'all', isRanged: true },
  },
  medica: {
    id: 'p_medica', name: 'Medica', stage: 'egg', hunger: 100, mood: 100, exp: 0, maxExp: 50, sprite: '🥚',
    skill: { name: 'Heal Pulse', type: 'heal', value: 15, target: 'self', isRanged: false },
  },
  rocky: {
    id: 'p_rocky', name: 'Rocky', stage: 'egg', hunger: 100, mood: 100, exp: 0, maxExp: 50, sprite: '🥚',
    skill: { name: 'Rock Throw', type: 'damage', value: 9, target: 'single', isRanged: true },
  },
  shadow: {
    id: 'p_shadow', name: 'Shadow', stage: 'egg', hunger: 100, mood: 100, exp: 0, maxExp: 50, sprite: '🥚',
    skill: { name: 'Dark Slash', type: 'damage', value: 11, target: 'single', isRanged: false },
  },
  breezy: {
    id: 'p_breezy', name: 'Breezy', stage: 'egg', hunger: 100, mood: 100, exp: 0, maxExp: 50, sprite: '🥚',
    skill: { name: 'Gust', type: 'damage', value: 6, target: 'all', isRanged: true },
  },
  guardian: {
    id: 'p_guardian', name: 'Guardian', stage: 'egg', hunger: 100, mood: 100, exp: 0, maxExp: 50, sprite: '🥚',
    skill: { name: 'Shield Aura', type: 'buff', value: 10, target: 'self', isRanged: false },
  },
};

// ==========================================
// 工具函数
// ==========================================
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomMonster(): Monster {
  const keys = Object.keys(MONSTERS);
  const key = pickRandom(keys);
  return { ...MONSTERS[key], id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` };
}

// 生成随机事件的工厂函数（10种事件）
export const generateRandomEvent = (
  startCombat: (monsters: Monster[]) => void,
  gainGold: (amount: number) => void,
  healPlayer: (amount: number) => void,
  damagePlayer: (amount: number) => void,
  nextEvent: () => void,
  returnToLobby: () => void,
  showResultPopup: (popup: ResultPopupData) => void
): GameEvent => {
  // 加权事件池：combat 概率更高
  const eventTypes = [
    'combat', 'combat', 'combat',
    'treasure', 'trap', 'camp', 'merchant',
    'shrine', 'puzzle', 'fountain', 'gamble', 'forge'
  ];
  const type = pickRandom(eventTypes);

  switch (type) {
    // ========== 1. 战斗事件 ==========
    case 'combat': {
      const monster = getRandomMonster();
      return {
        id: `e_combat_${Date.now()}`,
        type: 'combat',
        title: 'Monster Encounter!',
        description: `A wild ${monster.name} blocks your path. It looks hostile.`,
        image: monster.sprite,
        options: [
          {
            label: 'Engage in Combat',
            action: () => startCombat([monster])
          },
          {
            label: 'Try to Flee (Take 10 DMG)',
            action: () => {
              damagePlayer(10);
              showResultPopup({
                title: 'Fled!',
                description: 'You managed to escape, but took 10 damage in the process.',
                image: '🏃',
                onClose: () => nextEvent()
              });
            }
          }
        ]
      };
    }

    // ========== 2. 宝箱事件 ==========
    case 'treasure':
      return {
        id: `e_treasure_${Date.now()}`,
        type: 'treasure',
        title: 'Abandoned Chest',
        description: 'You find an old, dusty chest sitting in the corner of the room.',
        image: '📦',
        options: [
          {
            label: 'Open it',
            action: () => {
              const gold = Math.floor(Math.random() * 50) + 20;
              gainGold(gold);
              showResultPopup({
                title: 'Treasure Found!',
                description: `You opened the chest and found ${gold} gold!`,
                image: '💰',
                onClose: () => nextEvent()
              });
            }
          },
          {
            label: 'Leave it alone',
            action: () => nextEvent()
          }
        ]
      };

    // ========== 3. 陷阱事件 ==========
    case 'trap':
      return {
        id: `e_trap_${Date.now()}`,
        type: 'trap',
        title: 'Suspicious Corridor',
        description: 'The floor tiles here look loose. There might be a trap.',
        image: '🕸️',
        options: [
          {
            label: 'Carefully step over',
            action: () => {
              if (Math.random() > 0.5) {
                showResultPopup({
                  title: 'Evaded!',
                  description: 'You successfully avoided the trap!',
                  image: '✨',
                  onClose: () => nextEvent()
                });
              } else {
                damagePlayer(15);
                showResultPopup({
                  title: 'Trap Triggered!',
                  description: 'You triggered a dart trap! Took 15 damage.',
                  image: '🩸',
                  onClose: () => nextEvent()
                });
              }
            }
          },
          {
            label: 'Rush through quickly',
            action: () => {
              damagePlayer(5);
              showResultPopup({
                title: 'Ouch!',
                description: 'You rushed through but scraped your knee. Took 5 damage.',
                image: '🩹',
                onClose: () => nextEvent()
              });
            }
          }
        ]
      };

    // ========== 4. 营地事件 ==========
    case 'camp':
      return {
        id: `e_camp_${Date.now()}`,
        type: 'camp',
        title: 'Safe Room',
        description: 'You found a quiet room with a warm campfire. A good place to rest.',
        image: '🔥',
        options: [
          {
            label: 'Rest (Heal 30 HP)',
            action: () => {
              healPlayer(30);
              showResultPopup({
                title: 'Rested',
                description: 'You sat by the fire and recovered 30 HP.',
                image: '💤',
                onClose: () => nextEvent()
              });
            }
          },
          {
            label: 'Return to Lobby',
            action: () => returnToLobby()
          }
        ]
      };

    // ========== 5. 商人事件 ==========
    case 'merchant':
      return {
        id: `e_merchant_${Date.now()}`,
        type: 'merchant',
        title: 'Mysterious Merchant',
        description: 'A cloaked figure offers you goods in exchange for your hard-earned gold.',
        image: '🧙‍♂️',
        options: [
          {
            label: 'Buy Potion (Heal 50 HP) - 20 Gold',
            action: () => {
              import('./store').then(({ useGameStore }) => {
                const state = useGameStore.getState();
                if (state.player.gold >= 20) {
                  state.gainGold(-20);
                  healPlayer(50);
                  showResultPopup({
                    title: 'Purchased!',
                    description: 'You bought a potion and healed 50 HP!',
                    image: '🧪',
                    onClose: () => nextEvent()
                  });
                } else {
                  showResultPopup({
                    title: 'Not Enough Gold',
                    description: 'You do not have enough gold to buy this.',
                    image: '❌',
                    onClose: () => {}
                  });
                }
              });
            }
          },
          {
            label: 'Upgrade Weapon (+5 DMG) - 50 Gold',
            action: () => {
              import('./store').then(({ useGameStore }) => {
                const state = useGameStore.getState();
                if (state.player.gold >= 50) {
                  state.gainGold(-50);
                  state.upgradeWeapon();
                  showResultPopup({
                    title: 'Weapon Upgraded!',
                    description: 'The merchant sharpened your weapon. It now deals +5 damage!',
                    image: '⚔️',
                    onClose: () => nextEvent()
                  });
                } else {
                  showResultPopup({
                    title: 'Not Enough Gold',
                    description: 'You do not have enough gold to buy this.',
                    image: '❌',
                    onClose: () => {}
                  });
                }
              });
            }
          },
          {
            label: 'Buy Pet Food (+50 EXP) - 30 Gold',
            action: () => {
              import('./store').then(({ useGameStore }) => {
                const state = useGameStore.getState();
                if (state.player.gold >= 30 && state.inventory.pets.length > 0) {
                  state.gainGold(-30);
                  state.gainPetExp(50);
                  showResultPopup({
                    title: 'Purchased!',
                    description: 'You bought pet food! Your pets gained 50 EXP.',
                    image: '🍖',
                    onClose: () => nextEvent()
                  });
                } else if (state.inventory.pets.length === 0) {
                  showResultPopup({
                    title: 'No Pets',
                    description: 'You have no pets to feed!',
                    image: '❌',
                    onClose: () => {}
                  });
                } else {
                  showResultPopup({
                    title: 'Not Enough Gold',
                    description: 'You do not have enough gold to buy this.',
                    image: '❌',
                    onClose: () => {}
                  });
                }
              });
            }
          },
          {
            label: 'Leave',
            action: () => nextEvent()
          }
        ]
      };

    // ========== 6. 神殿事件 ==========
    case 'shrine':
      return {
        id: `e_shrine_${Date.now()}`,
        type: 'shrine',
        title: 'Ancient Shrine',
        description: 'A glowing shrine hums with ancient power. You feel it could bless you... or curse you.',
        image: '⛩️',
        options: [
          {
            label: 'Pray for Blessing',
            action: () => {
              if (Math.random() > 0.4) {
                const hpBoost = 20;
                healPlayer(hpBoost);
                gainGold(30);
                showResultPopup({
                  title: 'Blessed!',
                  description: `The shrine glows warmly. You recovered ${hpBoost} HP and received 30 gold!`,
                  image: '🌟',
                  onClose: () => nextEvent()
                });
              } else {
                damagePlayer(20);
                showResultPopup({
                  title: 'Cursed!',
                  description: 'Dark energy erupted from the shrine! You took 20 damage.',
                  image: '💜',
                  onClose: () => nextEvent()
                });
              }
            }
          },
          {
            label: 'Offer 25 Gold for guaranteed blessing',
            action: () => {
              import('./store').then(({ useGameStore }) => {
                const state = useGameStore.getState();
                if (state.player.gold >= 25) {
                  state.gainGold(-25);
                  healPlayer(40);
                  showResultPopup({
                    title: 'Divine Blessing!',
                    description: 'The shrine accepts your offering. You recovered 40 HP!',
                    image: '✨',
                    onClose: () => nextEvent()
                  });
                } else {
                  showResultPopup({
                    title: 'Not Enough Gold',
                    description: 'The shrine requires a greater offering.',
                    image: '❌',
                    onClose: () => {}
                  });
                }
              });
            }
          }
        ]
      };

    // ========== 7. 谜题事件 ==========
    case 'puzzle': {
      const puzzles = [
        { question: 'A stone tablet reads: "I have keys but no locks. I have space but no room. You can enter but can\'t go inside. What am I?"', answer: 'A keyboard' },
        { question: 'An inscription on the wall: "The more you take, the more you leave behind. What am I?"', answer: 'Footsteps' },
        { question: 'Carved into the floor: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"', answer: 'An echo' },
      ];
      const puzzle = pickRandom(puzzles);
      return {
        id: `e_puzzle_${Date.now()}`,
        type: 'puzzle',
        title: 'Mysterious Puzzle',
        description: puzzle.question,
        image: '🧩',
        options: [
          {
            label: 'Attempt to solve (50% success)',
            action: () => {
              if (Math.random() > 0.5) {
                const reward = Math.floor(Math.random() * 40) + 30;
                gainGold(reward);
                showResultPopup({
                  title: 'Puzzle Solved!',
                  description: `Correct! The answer was "${puzzle.answer}". A hidden compartment opens, revealing ${reward} gold!`,
                  image: '🏅',
                  onClose: () => nextEvent()
                });
              } else {
                damagePlayer(10);
                showResultPopup({
                  title: 'Wrong Answer!',
                  description: `That wasn't right. The answer was "${puzzle.answer}". A magical barrier zapped you for 10 damage.`,
                  image: '⚡',
                  onClose: () => nextEvent()
                });
              }
            }
          },
          {
            label: 'Skip the puzzle',
            action: () => nextEvent()
          }
        ]
      };
    }

    // ========== 8. 神泉事件 ==========
    case 'fountain':
      return {
        id: `e_fountain_${Date.now()}`,
        type: 'fountain',
        title: 'Enchanted Fountain',
        description: 'A sparkling fountain sits in the center of the room. Its waters shimmer with magical energy.',
        image: '⛲',
        options: [
          {
            label: 'Drink from the fountain',
            action: () => {
              const roll = Math.random();
              if (roll > 0.6) {
                healPlayer(50);
                showResultPopup({
                  title: 'Rejuvenated!',
                  description: 'The magical water fully revitalizes you! Recovered 50 HP.',
                  image: '💧',
                  onClose: () => nextEvent()
                });
              } else if (roll > 0.3) {
                healPlayer(20);
                gainGold(15);
                showResultPopup({
                  title: 'Refreshed!',
                  description: 'The water tastes sweet. Recovered 20 HP and found 15 gold coins at the bottom!',
                  image: '🪙',
                  onClose: () => nextEvent()
                });
              } else {
                damagePlayer(15);
                showResultPopup({
                  title: 'Poisoned Water!',
                  description: 'The water was tainted! You feel sick and took 15 damage.',
                  image: '☠️',
                  onClose: () => nextEvent()
                });
              }
            }
          },
          {
            label: 'Toss in a coin (10 Gold) for good luck',
            action: () => {
              import('./store').then(({ useGameStore }) => {
                const state = useGameStore.getState();
                if (state.player.gold >= 10) {
                  state.gainGold(-10);
                  healPlayer(30);
                  state.gainPetExp(20);
                  showResultPopup({
                    title: 'Wish Granted!',
                    description: 'The fountain glows! Recovered 30 HP and your pets gained 20 EXP.',
                    image: '🌊',
                    onClose: () => nextEvent()
                  });
                } else {
                  showResultPopup({
                    title: 'No Coins',
                    description: "You don't have enough gold to toss.",
                    image: '❌',
                    onClose: () => {}
                  });
                }
              });
            }
          }
        ]
      };

    // ========== 9. 赌博事件 ==========
    case 'gamble':
      return {
        id: `e_gamble_${Date.now()}`,
        type: 'gamble',
        title: "Fortune's Wheel",
        description: 'A mysterious wheel of fortune stands before you. "Spin and test your luck!" says a ghostly voice.',
        image: '🎰',
        options: [
          {
            label: 'Bet 30 Gold (Double or nothing)',
            action: () => {
              import('./store').then(({ useGameStore }) => {
                const state = useGameStore.getState();
                if (state.player.gold >= 30) {
                  state.gainGold(-30);
                  if (Math.random() > 0.45) {
                    gainGold(60);
                    showResultPopup({
                      title: 'Jackpot!',
                      description: 'The wheel lands on gold! You won 60 gold!',
                      image: '🎉',
                      onClose: () => nextEvent()
                    });
                  } else {
                    showResultPopup({
                      title: 'Bad Luck!',
                      description: 'The wheel lands on nothing. You lost 30 gold.',
                      image: '😢',
                      onClose: () => nextEvent()
                    });
                  }
                } else {
                  showResultPopup({
                    title: 'Not Enough Gold',
                    description: 'You need at least 30 gold to play.',
                    image: '❌',
                    onClose: () => {}
                  });
                }
              });
            }
          },
          {
            label: 'Bet your HP (50% chance: Heal 40 or Lose 25 HP)',
            action: () => {
              if (Math.random() > 0.5) {
                healPlayer(40);
                showResultPopup({
                  title: 'Lucky!',
                  description: 'Fortune smiles upon you! Healed 40 HP.',
                  image: '🍀',
                  onClose: () => nextEvent()
                });
              } else {
                damagePlayer(25);
                showResultPopup({
                  title: 'Unlucky!',
                  description: 'The wheel of fate is cruel. Lost 25 HP.',
                  image: '💔',
                  onClose: () => nextEvent()
                });
              }
            }
          },
          {
            label: 'Walk away',
            action: () => nextEvent()
          }
        ]
      };

    // ========== 10. 锻造事件 ==========
    case 'forge':
      return {
        id: `e_forge_${Date.now()}`,
        type: 'forge',
        title: 'Abandoned Forge',
        description: 'You discover an ancient forge still burning with magical flames. Perhaps you can use it.',
        image: '🔨',
        options: [
          {
            label: 'Upgrade Weapon (+5 DMG) - Free but risky',
            action: () => {
              import('./store').then(({ useGameStore }) => {
                const state = useGameStore.getState();
                if (Math.random() > 0.3) {
                  state.upgradeWeapon();
                  showResultPopup({
                    title: 'Forge Success!',
                    description: 'The flames tempered your weapon perfectly! +5 damage.',
                    image: '🗡️',
                    onClose: () => nextEvent()
                  });
                } else {
                  damagePlayer(10);
                  showResultPopup({
                    title: 'Forge Failed!',
                    description: 'The forge erupted! You burned your hands and took 10 damage.',
                    image: '🔥',
                    onClose: () => nextEvent()
                  });
                }
              });
            }
          },
          {
            label: 'Search the forge for supplies',
            action: () => {
              const gold = Math.floor(Math.random() * 25) + 10;
              gainGold(gold);
              showResultPopup({
                title: 'Found Supplies!',
                description: `You scavenged the forge and found ${gold} gold worth of materials.`,
                image: '⚙️',
                onClose: () => nextEvent()
              });
            }
          },
          {
            label: 'Leave',
            action: () => nextEvent()
          }
        ]
      };

    // ========== 默认 ==========
    default:
      return {
        id: 'e_error',
        type: 'camp',
        title: 'Empty Room',
        description: 'Nothing here.',
        options: [{ label: 'Continue', action: () => nextEvent() }]
      };
  }
};
