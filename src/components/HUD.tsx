import { useGameStore } from '../store';
import { Heart, Coins, Layers } from 'lucide-react';

export const HUD: React.FC = () => {
  const player = useGameStore((state) => state.player);

  return (
    <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-center bg-gray-900/80 border-b border-gray-700 z-50">
      <div className="flex items-center space-x-3">
        <div className="flex items-center text-red-400">
          <Heart className="w-4 h-4 mr-1" />
          <span className="text-sm font-bold">{player.hp} / {player.maxHp}</span>
        </div>
        <div className="flex items-center text-yellow-400">
          <Coins className="w-4 h-4 mr-1" />
          <span className="text-sm font-bold">{player.gold}</span>
        </div>
      </div>
      <div className="flex items-center text-blue-400">
        <Layers className="w-4 h-4 mr-1" />
        <span className="text-sm font-bold">Floor {player.floor}</span>
      </div>
    </div>
  );
};