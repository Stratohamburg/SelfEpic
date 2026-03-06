import React from 'react';
import { useGameStore } from '../store';
import { motion } from 'framer-motion';

export const Exploring: React.FC = () => {
  const { currentEvent } = useGameStore();

  if (!currentEvent) return null;

  return (
    <div className="relative h-full bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Main Viewport */}
      <div className="flex-1 flex items-center justify-center relative pt-12">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="text-8xl filter drop-shadow-lg z-10"
        >
          {currentEvent.image || '🏰'}
        </motion.div>
      </div>

      {/* Dialogue & Action UI */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gray-900/95 border-t border-gray-700 p-4 flex flex-col z-20">
        <h3 className="text-blue-400 font-bold mb-1">{currentEvent.title}</h3>
        <p className="text-sm text-gray-300 flex-1 overflow-y-auto leading-relaxed">
          {currentEvent.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          {currentEvent.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={opt.action}
              className="py-2.5 px-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 text-xs font-bold transition-colors hover:border-blue-400"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
