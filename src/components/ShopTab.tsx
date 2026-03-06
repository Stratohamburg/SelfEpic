import React, { useState } from 'react';
import { useGameStore } from '../store';
import { GachaItem, Rarity } from '../types';
import { SINGLE_PULL_DIAMONDS, MULTI_PULL_DIAMONDS, SINGLE_PULL_TICKETS, MULTI_PULL_TICKETS } from '../gachaConfig';

const RARITY_STYLES: Record<Rarity, { bg: string; text: string; glow: string; label: string }> = {
  common:    { bg: 'bg-gray-700/80',   text: 'text-gray-200',   glow: '',                             label: '普通' },
  rare:      { bg: 'bg-blue-800/80',   text: 'text-blue-200',   glow: 'shadow-[0_0_10px_#3b82f680]',  label: '稀有' },
  epic:      { bg: 'bg-purple-800/80', text: 'text-purple-200', glow: 'shadow-[0_0_12px_#a855f780]',  label: '史诗' },
  legendary: { bg: 'bg-amber-700/80',  text: 'text-amber-200',  glow: 'shadow-[0_0_16px_#f59e0b]',    label: '传说' },
};

type PullMode = 'diamonds' | 'tickets';

const ItemCard: React.FC<{ item: GachaItem; isNew?: boolean }> = ({ item, isNew }) => {
  const s = RARITY_STYLES[item.rarity];
  return (
    <div className={`relative flex flex-col items-center rounded-xl p-2 ${s.bg} ${s.glow} border border-white/10 transition-all`}>
      {isNew && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">
          NEW
        </span>
      )}
      <div className="text-3xl">{item.icon}</div>
      <div className={`text-[10px] font-semibold mt-1 truncate w-full text-center ${s.text}`}>{item.name}</div>
      <div className={`text-[9px] mt-0.5 px-1.5 py-0.5 rounded-full ${s.bg} border border-white/20 ${s.text}`}>
        {s.label}
      </div>
    </div>
  );
};

export const ShopTab: React.FC = () => {
  const { player, pityCount, pullGacha } = useGameStore();
  const [results, setResults] = useState<GachaItem[]>([]);
  const [pullMode, setPullMode] = useState<PullMode>('diamonds');
  const [isAnimating, setIsAnimating] = useState(false);

  const canSingle = pullMode === 'diamonds'
    ? player.diamonds >= SINGLE_PULL_DIAMONDS
    : player.gachaTickets >= SINGLE_PULL_TICKETS;

  const canMulti = pullMode === 'diamonds'
    ? player.diamonds >= MULTI_PULL_DIAMONDS
    : player.gachaTickets >= MULTI_PULL_TICKETS;

  const doPull = (count: number) => {
    if (isAnimating) return;
    const res = pullGacha(count, pullMode === 'diamonds');
    if (res.length === 0) return;
    setIsAnimating(true);
    setResults([]);
    setTimeout(() => {
      setResults(res);
      setIsAnimating(false);
    }, 400);
  };

  const pityLeft10  = 10  - (pityCount % 10);
  const pityLeft100 = 100 - (pityCount % 100);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-indigo-950 overflow-hidden">
      {/* 标题 */}
      <div className="text-center pt-6 pb-3">
        <div className="text-xl font-bold text-amber-300 tracking-wide">✨ 命运召唤</div>
        <div className="text-[10px] text-gray-500 mt-0.5">探寻传说中的英雄与宝器</div>
      </div>

      {/* 保底计数 */}
      <div className="flex justify-center gap-4 px-6 mb-3">
        <div className="flex-1 text-center bg-black/30 border border-blue-500/20 rounded-lg px-2 py-1.5">
          <div className="text-[9px] text-gray-400">稀有保底</div>
          <div className="text-sm font-bold text-blue-300">{pityLeft10} 抽</div>
        </div>
        <div className="flex-1 text-center bg-black/30 border border-amber-500/20 rounded-lg px-2 py-1.5">
          <div className="text-[9px] text-gray-400">传说保底</div>
          <div className="text-sm font-bold text-amber-300">{pityLeft100} 抽</div>
        </div>
        <div className="flex-1 text-center bg-black/30 border border-gray-500/20 rounded-lg px-2 py-1.5">
          <div className="text-[9px] text-gray-400">总计抽数</div>
          <div className="text-sm font-bold text-gray-300">{pityCount}</div>
        </div>
      </div>

      {/* 结果展示区 */}
      <div className="flex-1 mx-4 rounded-2xl bg-black/30 border border-white/5 overflow-hidden flex flex-col">
        {results.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
            <div className="text-5xl mb-3 opacity-30">🎴</div>
            <div className="text-sm">点击下方按钮召唤英雄</div>
            <div className="text-xs mt-1">期待你的传说</div>
          </div>
        ) : (
          <div className={`flex-1 overflow-y-auto p-3 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {results.length === 1 ? (
              /* 单抽全屏展示 */
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <div className="text-7xl animate-bounce">{results[0].icon}</div>
                <div className={`text-xl font-bold ${RARITY_STYLES[results[0].rarity].text}`}>{results[0].name}</div>
                <div className={`px-3 py-1 rounded-full text-sm border ${RARITY_STYLES[results[0].rarity].text} ${RARITY_STYLES[results[0].rarity].bg} border-white/20`}>
                  {RARITY_STYLES[results[0].rarity].label} · {results[0].type === 'weapon' ? '武器' : results[0].type === 'pet' ? '伙伴' : '材料'}
                </div>
              </div>
            ) : (
              /* 十连网格 */
              <div className="grid grid-cols-5 gap-2">
                {results.map((item, i) => (
                  <ItemCard key={i} item={item} isNew />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 货币切换 & 抽取按钮 */}
      <div className="px-4 pt-3 pb-4 space-y-3">
        {/* 货币模式 */}
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          <button
            className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${pullMode === 'diamonds' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-400'}`}
            onClick={() => setPullMode('diamonds')}
          >
            💎 钻石
          </button>
          <button
            className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${pullMode === 'tickets' ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-400'}`}
            onClick={() => setPullMode('tickets')}
          >
            🎫 抽奖券
          </button>
        </div>

        {/* 单抽 / 十连 */}
        <div className="flex gap-3">
          <button
            onClick={() => doPull(1)}
            disabled={!canSingle || isAnimating}
            className="flex-1 py-3 rounded-2xl font-bold text-sm flex flex-col items-center gap-0.5 transition-all active:scale-95 disabled:opacity-40"
            style={{ background: canSingle ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#374151' }}
          >
            <span>单抽</span>
            <span className="text-[10px] font-normal opacity-80">
              {pullMode === 'diamonds' ? `💎 ${SINGLE_PULL_DIAMONDS}` : `🎫 ${SINGLE_PULL_TICKETS}`}
            </span>
          </button>
          <button
            onClick={() => doPull(10)}
            disabled={!canMulti || isAnimating}
            className="flex-1 py-3 rounded-2xl font-bold text-sm flex flex-col items-center gap-0.5 transition-all active:scale-95 disabled:opacity-40"
            style={{ background: canMulti ? 'linear-gradient(135deg,#f59e0b,#ef4444)' : '#374151' }}
          >
            <span>十连</span>
            <span className="text-[10px] font-normal opacity-80">
              {pullMode === 'diamonds' ? `💎 ${MULTI_PULL_DIAMONDS}` : `🎫 ${MULTI_PULL_TICKETS}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
