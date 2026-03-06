import React, { useState } from 'react';
import { useGameStore } from '../store';
import { Weapon, Pet, Rarity } from '../types';

const RARITY_BORDER: Record<Rarity, string> = {
  common:    'border-gray-500/40',
  rare:      'border-blue-400/60',
  epic:      'border-purple-400/70',
  legendary: 'border-amber-400 shadow-[0_0_10px_#f59e0b60]',
};
const RARITY_TEXT: Record<Rarity, string> = {
  common: 'text-gray-400', rare: 'text-blue-300', epic: 'text-purple-300', legendary: 'text-amber-300',
};
const RARITY_LABEL: Record<Rarity, string> = {
  common: '普通', rare: '稀有', epic: '史诗', legendary: '传说',
};

type DetailTarget = { kind: 'weapon'; data: Weapon } | { kind: 'pet'; data: Pet } | null;

export const EquipmentTab: React.FC = () => {
  const { inventory, sequence, equippedWeapon, updateSequence, equipWeapon, upgradeWeaponById, player } = useGameStore();
  const [detail, setDetail] = useState<DetailTarget>(null);

  /* ── 拖拽排序（touch-friendly 交换逻辑）── */
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const moveSeq = (from: number, to: number) => {
    const next = [...sequence];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    updateSequence(next);
  };

  const addToSeq = (weapon: Weapon) => {
    if (sequence.some(n => n.type === 'weapon' && n.data.id === weapon.id)) return;
    updateSequence([...sequence, { type: 'weapon', data: weapon }]);
  };

  const removeFromSeq = (idx: number) => {
    const next = [...sequence];
    next.splice(idx, 1);
    updateSequence(next);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
      {/* ── 行1：出击序列 ── */}
      <div className="px-3 pt-4 pb-2">
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
          <span className="text-amber-400">⚔️</span> 出击序列 <span className="text-gray-600">（左→右 依次行动）</span>
        </div>
        <div className="flex gap-2 min-h-[72px] bg-black/30 border border-white/5 rounded-xl p-2 overflow-x-auto">
          {sequence.length === 0 && (
            <div className="w-full flex items-center justify-center text-gray-600 text-xs">拖入武器 / 伙伴</div>
          )}
          {sequence.map((node, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => setDraggingIdx(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggingIdx !== null && draggingIdx !== i) moveSeq(draggingIdx, i);
                setDraggingIdx(null);
              }}
              className={`relative flex-shrink-0 w-14 h-14 rounded-lg border-2 flex flex-col items-center justify-center cursor-grab select-none
                ${node.type === 'weapon' ? RARITY_BORDER[node.data.rarity ?? 'common'] : RARITY_BORDER[node.data.rarity ?? 'common']}
                bg-gray-800/60 transition-all`}
              onClick={() => {
                if (node.type === 'weapon') setDetail({ kind: 'weapon', data: node.data as Weapon });
                else setDetail({ kind: 'pet', data: node.data as Pet });
              }}
            >
              <div className="text-2xl leading-none">
                {node.type === 'weapon' ? '⚔️' : (node.data as Pet).sprite}
              </div>
              <div className="text-[8px] text-gray-400 mt-0.5 truncate w-full text-center px-0.5">
                {node.data.name.slice(0, 5)}
              </div>
              <button
                className="absolute -top-1.5 -right-1.5 bg-red-600 rounded-full w-4 h-4 text-[9px] flex items-center justify-center leading-none hover:bg-red-500"
                onClick={(e) => { e.stopPropagation(); removeFromSeq(i); }}
              >✕</button>
              <div className="absolute bottom-0.5 left-0.5 text-[8px] text-gray-500">{i + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 行2：背包格子 ── */}
      <div className="flex-1 px-3 overflow-hidden flex flex-col">
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
          <span className="text-blue-400">🎒</span> 背包
        </div>
        <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-1.5 content-start pb-2">
          {inventory.weapons.map(w => (
            <div
              key={w.id}
              className={`relative flex flex-col items-center rounded-lg border-2 p-1.5 cursor-pointer bg-gray-800/50 transition-all hover:brightness-110
                ${equippedWeapon?.id === w.id ? 'ring-2 ring-orange-400' : ''}
                ${RARITY_BORDER[w.rarity ?? 'common']}`}
              onClick={() => setDetail({ kind: 'weapon', data: w })}
              onDoubleClick={() => addToSeq(w)}
            >
              <div className="text-2xl">⚔️</div>
              <div className={`text-[9px] truncate w-full text-center mt-0.5 ${RARITY_TEXT[w.rarity ?? 'common']}`}>
                {w.name}
              </div>
              <div className="text-[8px] text-gray-500">Lv{w.level}</div>
              {equippedWeapon?.id === w.id && (
                <span className="absolute top-0.5 right-0.5 text-[8px] text-orange-400">✓</span>
              )}
            </div>
          ))}
          {inventory.pets.map(p => (
            <div
              key={p.id}
              className={`relative flex flex-col items-center rounded-lg border-2 p-1.5 cursor-pointer bg-gray-800/50 transition-all hover:brightness-110
                ${RARITY_BORDER[p.rarity ?? 'common']}`}
              onClick={() => setDetail({ kind: 'pet', data: p })}
            >
              <div className="text-2xl">{p.sprite}</div>
              <div className={`text-[9px] truncate w-full text-center mt-0.5 ${RARITY_TEXT[p.rarity ?? 'common']}`}>
                {p.name}
              </div>
              <div className="text-[8px] text-gray-500">Lv{p.level}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 行3：详情面板 ── */}
      <div className={`mx-3 mb-3 rounded-2xl bg-black/40 border border-white/10 transition-all duration-300 ${detail ? 'p-3' : 'h-0 overflow-hidden p-0 border-transparent'}`}>
        {detail && detail.kind === 'weapon' && (
          <WeaponDetail weapon={detail.data} gold={player.gold} onEquip={() => equipWeapon(detail.data)} onAddSeq={() => addToSeq(detail.data)} onUpgrade={() => upgradeWeaponById(detail.data.id)} onClose={() => setDetail(null)} />
        )}
        {detail && detail.kind === 'pet' && (
          <PetDetail pet={detail.data} onClose={() => setDetail(null)} />
        )}
      </div>
    </div>
  );
};

/* ────── 武器详情 ────── */
const WeaponDetail: React.FC<{
  weapon: Weapon; gold: number;
  onEquip: () => void; onAddSeq: () => void; onUpgrade: () => void; onClose: () => void;
}> = ({ weapon, gold, onEquip, onAddSeq, onUpgrade, onClose }) => {
  const rarity = weapon.rarity ?? 'common';
  const upgradeCost = 100 + weapon.level * 50;
  return (
    <div className="flex gap-3 items-start">
      <div className="text-4xl">⚔️</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className={`font-bold text-sm ${RARITY_TEXT[rarity]}`}>{weapon.name}</div>
          <div className={`text-[9px] px-1.5 py-0.5 rounded-full bg-gray-700 ${RARITY_TEXT[rarity]}`}>{RARITY_LABEL[rarity]}</div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          伤害 <span className="text-orange-300 font-semibold">{weapon.damage}</span>
          <span className="mx-2 text-gray-600">|</span>
          Lv <span className="text-gray-300">{weapon.level}</span> / {weapon.maxLevel ?? 10}
        </div>
        {weapon.effect && <div className="text-[10px] text-green-400 mt-0.5">效果：{weapon.effect}</div>}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          <button onClick={onEquip} className="bg-orange-600 hover:bg-orange-500 text-white text-[10px] px-2 py-1 rounded-lg">装备</button>
          <button onClick={onAddSeq} className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-lg">加入序列</button>
          <button onClick={onUpgrade} disabled={gold < upgradeCost} className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] px-2 py-1 rounded-lg disabled:opacity-40">
            强化 💰{upgradeCost}
          </button>
          <button onClick={onClose} className="ml-auto text-gray-500 text-[10px] px-2 py-1">关闭</button>
        </div>
      </div>
    </div>
  );
};

/* ────── 宠物详情 ────── */
const PetDetail: React.FC<{ pet: Pet; onClose: () => void }> = ({ pet, onClose }) => {
  const rarity = pet.rarity ?? 'common';
  return (
    <div className="flex gap-3 items-start">
      <div className="text-4xl">{pet.sprite}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className={`font-bold text-sm ${RARITY_TEXT[rarity]}`}>{pet.name}</div>
          <div className={`text-[9px] px-1.5 py-0.5 rounded-full bg-gray-700 ${RARITY_TEXT[rarity]}`}>{RARITY_LABEL[rarity]}</div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          阶段 <span className="text-gray-200">{pet.stage}</span>
          <span className="mx-2 text-gray-600">|</span>
          Lv <span className="text-gray-300">{pet.level}</span>
        </div>
        <div className="text-[10px] text-blue-300 mt-0.5">
          技能：{pet.skill.name} · {pet.skill.type === 'damage' ? `伤害 ${pet.skill.value}` : `回复 ${pet.skill.value}`}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="text-[9px] text-gray-400">EXP</div>
          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full" style={{ width: `${(pet.exp / pet.maxExp) * 100}%` }} />
          </div>
          <div className="text-[9px] text-gray-400">{pet.exp}/{pet.maxExp}</div>
        </div>
        <div className="flex gap-1.5 mt-2">
          <button onClick={onClose} className="text-gray-500 text-[10px] px-2 py-1">关闭</button>
        </div>
      </div>
    </div>
  );
};
