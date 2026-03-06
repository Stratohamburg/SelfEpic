import React from 'react';
import { useGameStore } from '../store';
import { LobbyTab } from '../types';
import { AdventureTab } from './AdventureTab';
import { ShopTab } from './ShopTab';
import { EquipmentTab } from './EquipmentTab';

/* ──────────────────────────────
   Top Bar
────────────────────────────── */
const TopBar: React.FC = () => {
  const { player } = useGameStore();
  const hpPct = Math.round((player.hp / player.maxHp) * 100);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/95 border-b border-white/5 flex-shrink-0">
      {/* 头像 + HP */}
      <div className="flex flex-col items-center w-10">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-sm font-bold border-2 border-indigo-300/40">
          {player.level}
        </div>
        <div className="w-full h-1 bg-gray-700 rounded-full mt-0.5 overflow-hidden">
          <div className="h-full bg-red-500 rounded-full" style={{ width: `${hpPct}%` }} />
        </div>
      </div>

      {/* EXP + Floor */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="text-[9px] text-gray-400 truncate">Lv{player.level} · 第{player.floor}层</div>
        <div className="w-full h-1 bg-gray-700 rounded-full mt-0.5 overflow-hidden">
          <div
            className="h-full bg-blue-400 rounded-full"
            style={{ width: `${(player.exp / player.maxExp) * 100}%` }}
          />
        </div>
      </div>

      {/* 资源栏 */}
      <div className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-0.5 text-yellow-300 font-semibold">
          💰 <span>{player.gold}</span>
        </span>
        <span className="flex items-center gap-0.5 text-cyan-300 font-semibold">
          💎 <span>{player.diamonds}</span>
        </span>
        <span className="flex items-center gap-0.5 text-purple-300 font-semibold">
          🎫 <span>{player.gachaTickets}</span>
        </span>
      </div>
    </div>
  );
};

/* ──────────────────────────────
   Bottom Tab Bar
────────────────────────────── */
const TABS: { id: LobbyTab; icon: string; label: string }[] = [
  { id: 'shop',      icon: '✨', label: '商店' },
  { id: 'adventure', icon: '🗺️', label: '冒险' },
  { id: 'equipment', icon: '🎒', label: '装备' },
];

const BottomTabBar: React.FC = () => {
  const { lobbyTab, setLobbyTab } = useGameStore();
  return (
    <div className="flex border-t border-white/10 bg-gray-900/95 flex-shrink-0">
      {TABS.map(tab => {
        const active = lobbyTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setLobbyTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors
              ${active ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className={`text-[10px] font-semibold ${active ? 'text-indigo-300' : ''}`}>{tab.label}</span>
            {active && <div className="w-5 h-0.5 rounded-full bg-indigo-400 mt-0.5" />}
          </button>
        );
      })}
    </div>
  );
};

/* ──────────────────────────────
   Lobby Root
────────────────────────────── */
export const Lobby: React.FC = () => {
  const { lobbyTab } = useGameStore();

  return (
    <div className="flex flex-col h-full text-white">
      <TopBar />
      <div className="flex-1 overflow-hidden">
        {lobbyTab === 'adventure' && <AdventureTab />}
        {lobbyTab === 'shop'      && <ShopTab />}
        {lobbyTab === 'equipment' && <EquipmentTab />}
      </div>
      <BottomTabBar />
    </div>
  );
};