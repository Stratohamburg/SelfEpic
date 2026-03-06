import React from 'react';
import { useGameStore } from '../store';

const CHAPTER_NAMES = ['幽暗森林', '迷失沼泽', '火焰山脉', '冰封废墟', '幽冥地牢'];

export const AdventureTab: React.FC = () => {
  const { player, startAdventure } = useGameStore();

  const chapter = Math.ceil(player.floor / 10);
  const levelInChapter = ((player.floor - 1) % 10) + 1;
  const chapterName = CHAPTER_NAMES[(chapter - 1) % CHAPTER_NAMES.length];

  return (
    <div className="relative h-full flex flex-col items-center overflow-hidden bg-gradient-to-b from-indigo-950 via-gray-900 to-gray-950">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-6 left-5  text-5xl opacity-10 animate-pulse">🌌</div>
        <div className="absolute top-10 right-6 text-4xl opacity-10 animate-pulse" style={{ animationDelay: '0.8s' }}>⭐</div>
        <div className="absolute top-24 left-14 text-3xl opacity-10 animate-pulse" style={{ animationDelay: '1.5s' }}>✨</div>
        <div className="absolute bottom-36 left-3  text-5xl opacity-10 animate-bounce" style={{ animationDuration: '3s' }}>🏔️</div>
        <div className="absolute bottom-32 right-3 text-5xl opacity-10 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.6s' }}>🌲</div>
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-5xl opacity-5">🌲</div>
      </div>

      {/* 章节进度 */}
      <div className="mt-10 text-center z-10 px-6">
        <div className="inline-block bg-black/40 backdrop-blur-sm border border-indigo-500/30 rounded-2xl px-6 py-4">
          <div className="text-[10px] text-indigo-300 uppercase tracking-widest mb-1">当前关卡</div>
          <div className="text-lg font-bold text-white">
            第 {chapter} 章 · {chapterName}
          </div>
          <div className="text-sm text-gray-400 mt-0.5">
            {levelInChapter} / 10
          </div>
          <div className="w-44 h-1.5 bg-gray-700/60 rounded-full mt-3 overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-500"
              style={{ width: `${(levelInChapter / 10) * 100}%` }}
            />
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            总进度：第 {player.floor} 层
          </div>
        </div>
      </div>

      {/* 主角待机动画 */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 gap-3">
        <div className="text-8xl" style={{ animation: 'heroIdle 2s ease-in-out infinite' }}>⚔️</div>
        <div className="text-xs text-gray-500 italic">勇者，准备好了吗？</div>
      </div>

      {/* GO! 按钮 */}
      <div className="mb-16 z-10 flex flex-col items-center gap-3">
        <div className="text-xs text-gray-500">点击出发，踏上冒险旅途</div>
        <button
          onClick={startAdventure}
          className="relative w-32 h-32 rounded-full font-black text-4xl text-white border-4 border-orange-400/60 transition-all transform hover:scale-105 active:scale-95"
          style={{
            background: 'radial-gradient(circle at 40% 35%, #f97316, #dc2626)',
            animation: 'goButtonPulse 2.5s ease-in-out infinite',
          }}
        >
          GO!
        </button>
      </div>
    </div>
  );
};
