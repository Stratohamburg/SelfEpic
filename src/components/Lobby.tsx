import { useGameStore } from '../store';
import { Play, Settings } from 'lucide-react';

export const Lobby: React.FC = () => {
  const { setPhase, startAdventure } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
      <h1 className="text-3xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 leading-tight">
        Tamagotchi<br/>Adventure
      </h1>
      
      <div className="space-y-4 w-56">
        <button
          onClick={startAdventure}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-sm flex items-center justify-center transition-all transform hover:scale-105"
        >
          <Play className="mr-2 w-4 h-4" /> Start Adventure
        </button>
        
        <button
          onClick={() => setPhase('CAMP')}
          className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-sm flex items-center justify-center transition-all transform hover:scale-105"
        >
          <Settings className="mr-2 w-4 h-4" /> Setup & Progression
        </button>
      </div>
    </div>
  );
};