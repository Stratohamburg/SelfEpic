import { create } from 'zustand';
import { Player, Weapon, Pet, Monster, ActionSequence, GameEvent, ResultPopupData } from './types';
import { generateRandomEvent } from './events';

interface GameState {
  phase: 'LOBBY' | 'EXPLORING' | 'COMBAT' | 'CAMP' | 'DEAD';
  
  player: Player;
  inventory: {
    weapons: Weapon[];
    pets: Pet[];
    items: any[];
  };
  
  equippedWeapon: Weapon | null;
  sequence: ActionSequence;
  
  currentEvent: GameEvent | null;
  resultPopup: ResultPopupData | null;
  
  combat: {
    monsters: Monster[];
    turn: 'player' | 'enemy';
    currentActionIndex: number;
    logs: string[];
    isAutoPlaying: boolean;
    damageNumbers: { id: string; value: number; x: number; y: number; color: string }[];
    activeAnimation?: {
      type: 'pet_attack' | 'weapon_attack' | 'enemy_attack';
      sourceId?: string;
      targetIndex?: number;
      isRanged?: boolean;
    };
  };
  
  // Actions
  setPhase: (phase: GameState['phase']) => void;
  startAdventure: () => void;
  triggerEvent: (event: GameEvent) => void;
  generateNextEvent: () => void;
  startCombat: (monsters: Monster[]) => void;
  executeNextAction: () => void;
  addLog: (log: string) => void;
  updateSequence: (newSequence: ActionSequence) => void;
  equipWeapon: (weapon: Weapon) => void;
  healPlayer: (amount: number) => void;
  damagePlayer: (amount: number) => void;
  gainGold: (amount: number) => void;
  gainPetExp: (amount: number) => void;
  evolvePet: (petId: string) => void;
  upgradeWeapon: () => void;
  nextFloor: () => void;
  resetGame: () => void;
  showResultPopup: (popup: ResultPopupData) => void;
  closeResultPopup: () => void;
}

const initialPlayer: Player = {
  hp: 100,
  maxHp: 100,
  speed: 10,
  gold: 0,
  floor: 1,
};

const initialWeapon: Weapon = {
  id: 'w1',
  name: 'Rusty Sword',
  damage: 15,
  type: 'physical',
};

const initialPet: Pet = {
  id: 'p1',
  name: 'Slimey',
  stage: 'egg',
  hunger: 100,
  mood: 100,
  exp: 0,
  maxExp: 50,
  sprite: '🥚',
  skill: {
    name: 'Tackle',
    type: 'damage',
    value: 5,
    target: 'single',
    isRanged: false,
  },
};

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'LOBBY',
  
  player: { ...initialPlayer },
  inventory: {
    weapons: [initialWeapon],
    pets: [initialPet],
    items: [],
  },
  
  equippedWeapon: initialWeapon,
  sequence: [
    { type: 'pet', data: initialPet },
    { type: 'weapon', data: initialWeapon },
  ],
  
  currentEvent: null,
  resultPopup: null,
  
  combat: {
    monsters: [],
    turn: 'player',
    currentActionIndex: 0,
    logs: [],
    isAutoPlaying: false,
    damageNumbers: [],
  },
  
  setPhase: (phase) => set({ phase }),
  
  startAdventure: () => {
    set({ phase: 'EXPLORING' });
    get().generateNextEvent();
  },
  
  triggerEvent: (event) => set({ currentEvent: event, phase: 'EXPLORING' }),

  generateNextEvent: () => {
    const state = get();
    const newEvent = generateRandomEvent(
      state.startCombat,
      state.gainGold,
      state.healPlayer,
      state.damagePlayer,
      () => {
        state.nextFloor();
        state.generateNextEvent();
      },
      () => state.setPhase('LOBBY'),
      state.showResultPopup
    );
    set({ currentEvent: newEvent, phase: 'EXPLORING' });
  },
  
  startCombat: (monsters) => set((state) => ({
    phase: 'COMBAT',
    combat: {
      ...state.combat,
      monsters,
      turn: 'player',
      currentActionIndex: 0,
      logs: ['Combat started!'],
      isAutoPlaying: true,
      damageNumbers: [],
    }
  })),
  
  executeNextAction: () => {
    const state = get();
    if (state.phase !== 'COMBAT') return;
    
    const { combat, sequence, player } = state;
    
    // If an animation is already playing, don't trigger another action
    if (combat.activeAnimation) return;

    // Check win/loss condition first
    const allMonstersDead = combat.monsters.every(m => m.hp <= 0);
    if (allMonstersDead) {
      set((s) => ({
        combat: { ...s.combat, isAutoPlaying: false },
        player: { ...s.player, gold: s.player.gold + 50 } // Reward
      }));
      get().gainPetExp(50); // Give EXP to pets
      get().addLog('Victory! Gained 50 gold and 50 Pet EXP.');
      
      get().showResultPopup({
        title: 'Victory!',
        description: 'You defeated the monsters! Gained 50 gold and 50 Pet EXP.',
        image: '🏆',
        onClose: () => {
          get().nextFloor();
          get().generateNextEvent();
        }
      });
      return;
    }
    
    if (player.hp <= 0) {
      set({ phase: 'DEAD' });
      return;
    }

    if (combat.turn === 'player') {
      if (combat.currentActionIndex >= sequence.length) {
        // Player turn ends, switch to enemy
        set((s) => ({
          combat: { ...s.combat, turn: 'enemy', currentActionIndex: 0 }
        }));
        setTimeout(() => get().executeNextAction(), 500);
        return;
      }
      
      const action = sequence[combat.currentActionIndex];
      const targetMonsterIndex = combat.monsters.findIndex(m => m.hp > 0);
      
      if (targetMonsterIndex !== -1) {
        let damage = 0;
        let isRanged = false;
        
        if (action.type === 'weapon') {
          damage = action.data.damage;
          isRanged = action.data.isRanged || false;
        } else if (action.type === 'pet') {
          if (action.data.skill.type === 'damage') {
            damage = action.data.skill.value;
            isRanged = action.data.skill.isRanged || false;
          } else if (action.data.skill.type === 'heal') {
            get().healPlayer(action.data.skill.value);
          }
        }
        
        // 1. Set active animation
        set((s) => ({
          combat: {
            ...s.combat,
            activeAnimation: {
              type: action.type === 'pet' ? 'pet_attack' : 'weapon_attack',
              sourceId: action.type === 'pet' ? action.data.id : action.data.id,
              targetIndex: targetMonsterIndex,
              isRanged
            }
          }
        }));

        // 2. Wait for animation to reach the "hit" moment
        // For melee pet: spawn (300ms) + move to target (400ms) + hit (300ms) = 1000ms
        // For ranged pet: spawn (300ms) + shoot (500ms) = 800ms
        // For weapon: 300ms
        const hitDelay = action.type === 'pet' ? (isRanged ? 800 : 1000) : 300;
        const totalAnimDuration = action.type === 'pet' ? 2000 : 1000;

        setTimeout(() => {
          if (damage > 0) {
            set((s) => {
              const newMonsters = [...s.combat.monsters];
              newMonsters[targetMonsterIndex] = {
                ...newMonsters[targetMonsterIndex],
                hp: Math.max(0, newMonsters[targetMonsterIndex].hp - damage)
              };
              
              // Add damage number
              const newDamageNumber = {
                id: Date.now().toString(),
                value: damage,
                x: 50 + (targetMonsterIndex * 20), // Rough positioning
                y: 30,
                color: 'text-red-500'
              };

              return { 
                combat: { 
                  ...s.combat, 
                  monsters: newMonsters,
                  damageNumbers: [...s.combat.damageNumbers, newDamageNumber]
                } 
              };
            });
            
            // Remove damage number after animation
            setTimeout(() => {
              set((s) => ({
                combat: {
                  ...s.combat,
                  damageNumbers: s.combat.damageNumbers.slice(1)
                }
              }));
            }, 1000);
          }
        }, hitDelay);
        
        // 3. End animation and proceed
        setTimeout(() => {
          set((s) => ({
            combat: { 
              ...s.combat, 
              activeAnimation: undefined,
              currentActionIndex: s.combat.currentActionIndex + 1 
            }
          }));
          setTimeout(() => get().executeNextAction(), 100);
        }, totalAnimDuration);
        
      } else {
        set((s) => ({
          combat: { ...s.combat, currentActionIndex: s.combat.currentActionIndex + 1 }
        }));
        setTimeout(() => get().executeNextAction(), 100);
      }
      
    } else {
      // Enemy turn
      const aliveMonsters = combat.monsters.filter(m => m.hp > 0);
      if (combat.currentActionIndex >= aliveMonsters.length) {
        // Enemy turn ends, switch to player
        set((s) => ({
          combat: { ...s.combat, turn: 'player', currentActionIndex: 0 }
        }));
        setTimeout(() => get().executeNextAction(), 500);
        return;
      }
      
      const monster = aliveMonsters[combat.currentActionIndex];
      
      set((s) => ({
        combat: {
          ...s.combat,
          activeAnimation: {
            type: 'enemy_attack',
            sourceId: monster.id
          }
        }
      }));

      setTimeout(() => {
        get().damagePlayer(monster.damage);
        
        // Add damage number for player
        set((s) => {
          const newDamageNumber = {
            id: Date.now().toString(),
            value: monster.damage,
            x: 50, // Center
            y: 80, // Lower down for player
            color: 'text-red-500'
          };
          return {
            combat: { 
              ...s.combat, 
              damageNumbers: [...s.combat.damageNumbers, newDamageNumber]
            }
          };
        });

        setTimeout(() => {
          set((s) => ({
            combat: {
              ...s.combat,
              damageNumbers: s.combat.damageNumbers.slice(1)
            }
          }));
        }, 1000);
      }, 500);
      
      setTimeout(() => {
        set((s) => ({
          combat: { 
            ...s.combat, 
            activeAnimation: undefined,
            currentActionIndex: s.combat.currentActionIndex + 1 
          }
        }));
        setTimeout(() => get().executeNextAction(), 100);
      }, 1000);
    }
  },
  
  addLog: (log) => set((state) => ({
    combat: { ...state.combat, logs: [...state.combat.logs, log] }
  })),
  
  updateSequence: (newSequence) => set({ sequence: newSequence }),
  
  equipWeapon: (weapon) => set({ equippedWeapon: weapon }),
  
  healPlayer: (amount) => set((state) => ({
    player: { ...state.player, hp: Math.min(state.player.maxHp, state.player.hp + amount) }
  })),
  
  damagePlayer: (amount) => set((state) => ({
    player: { ...state.player, hp: Math.max(0, state.player.hp - amount) }
  })),
  
  gainGold: (amount) => set((state) => ({
    player: { ...state.player, gold: state.player.gold + amount }
  })),
  
  gainPetExp: (amount) => set((state) => {
    const updatedPets = state.inventory.pets.map(pet => ({
      ...pet,
      exp: Math.min(pet.exp + amount, pet.maxExp)
    }));
    
    // Update sequence with new pet data
    const updatedSequence = state.sequence.map(node => {
      if (node.type === 'pet') {
        const updatedPet = updatedPets.find(p => p.id === node.data.id);
        return updatedPet ? { ...node, data: updatedPet } : node;
      }
      return node;
    });

    return {
      inventory: { ...state.inventory, pets: updatedPets },
      sequence: updatedSequence
    };
  }),

  evolvePet: (petId) => set((state) => {
    const updatedPets = state.inventory.pets.map(pet => {
      if (pet.id === petId && pet.exp >= pet.maxExp) {
        if (pet.stage === 'egg') {
          return { 
            ...pet, 
            stage: 'baby' as const, 
            exp: 0, 
            maxExp: 100, 
            sprite: '🐣', 
            skill: { ...pet.skill, name: 'Acid Spit', value: pet.skill.value + 10, isRanged: true } 
          };
        } else if (pet.stage === 'baby') {
          return { 
            ...pet, 
            stage: 'adult' as const, 
            exp: 0, 
            maxExp: 999, 
            sprite: '🐉', 
            skill: { ...pet.skill, name: 'Venom Blast', value: pet.skill.value + 25, isRanged: true } 
          };
        }
      }
      return pet;
    });

    const updatedSequence = state.sequence.map(node => {
      if (node.type === 'pet' && node.data.id === petId) {
        const updatedPet = updatedPets.find(p => p.id === petId);
        return updatedPet ? { ...node, data: updatedPet } : node;
      }
      return node;
    });

    return {
      inventory: { ...state.inventory, pets: updatedPets },
      sequence: updatedSequence
    };
  }),

  upgradeWeapon: () => set((state) => {
    if (!state.equippedWeapon) return state;
    
    const upgradedWeapon = {
      ...state.equippedWeapon,
      damage: state.equippedWeapon.damage + 5,
      name: state.equippedWeapon.name.includes('+') 
        ? state.equippedWeapon.name.replace(/\+\d+/, (match) => `+${parseInt(match.slice(1)) + 1}`)
        : `${state.equippedWeapon.name} +1`
    };

    const updatedWeapons = state.inventory.weapons.map(w => 
      w.id === upgradedWeapon.id ? upgradedWeapon : w
    );

    const updatedSequence = state.sequence.map(node => 
      node.type === 'weapon' && node.data.id === upgradedWeapon.id 
        ? { ...node, data: upgradedWeapon } 
        : node
    );

    return {
      equippedWeapon: upgradedWeapon,
      inventory: { ...state.inventory, weapons: updatedWeapons },
      sequence: updatedSequence
    };
  }),

  nextFloor: () => set((state) => ({
    player: { ...state.player, floor: state.player.floor + 1 }
  })),
  
  resetGame: () => set({
    phase: 'LOBBY',
    player: { ...initialPlayer },
    inventory: { weapons: [initialWeapon], pets: [initialPet], items: [] },
    equippedWeapon: initialWeapon,
    sequence: [{ type: 'pet', data: initialPet }, { type: 'weapon', data: initialWeapon }],
    currentEvent: null,
    resultPopup: null,
    combat: { monsters: [], turn: 'player', currentActionIndex: 0, logs: [], isAutoPlaying: false, damageNumbers: [] }
  }),

  showResultPopup: (popup) => set({ resultPopup: popup }),
  closeResultPopup: () => set((state) => {
    const onClose = state.resultPopup?.onClose;
    if (onClose) onClose();
    return { resultPopup: null };
  }),
}));