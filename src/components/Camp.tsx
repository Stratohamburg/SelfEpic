import { useGameStore } from '../store';
import { ArrowLeft, Sword, Shield, Heart } from 'lucide-react';

export const Camp: React.FC = () => {
  const { setPhase, inventory, sequence, updateSequence, evolvePet } = useGameStore();

  // Simple drag and drop logic for sequence (simplified for prototype)
  const moveItem = (fromIndex: number, toIndex: number) => {
    const newSeq = [...sequence];
    const [moved] = newSeq.splice(fromIndex, 1);
    newSeq.splice(toIndex, 0, moved);
    updateSequence(newSeq);
  };

  return (
    <div className="h-full bg-gray-800 text-white p-4 overflow-y-auto pb-20">
      <button 
        onClick={() => setPhase('LOBBY')}
        className="flex items-center text-sm text-gray-400 hover:text-white mb-4 mt-10"
      >
        <ArrowLeft className="mr-1 w-4 h-4" /> Back to Lobby
      </button>

      <h2 className="text-xl font-bold mb-4">Progression & Setup</h2>

      <div className="flex flex-col gap-4">
        {/* Sequence Editor */}
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-bold mb-2 flex items-center">
            <Sword className="mr-2 w-4 h-4 text-red-400" /> Attack Sequence
          </h3>
          <p className="text-xs text-gray-400 mb-3">Drag to reorder your attack timeline.</p>
          
          <div className="space-y-2">
            {sequence.map((node, index) => (
              <div 
                key={`${node.type}-${node.data.id}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-600 cursor-move hover:border-blue-400"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  moveItem(fromIndex, index);
                }}
              >
                <div className="flex items-center">
                  <span className="w-5 h-5 flex items-center justify-center bg-gray-700 rounded-full mr-2 text-[10px]">
                    {index + 1}
                  </span>
                  <span className="font-bold text-sm">
                    {node.type === 'weapon' ? '🗡️ ' : `${node.data.sprite} `}
                    {node.data.name}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 uppercase">{node.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory / Pets */}
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <Heart className="mr-2 w-4 h-4 text-pink-400" /> Tamagotchi Pets
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {inventory.pets.map(pet => (
                <div key={pet.id} className="p-3 bg-gray-800 rounded border border-gray-600 relative">
                  <div className="text-3xl mb-1">{pet.sprite}</div>
                  <div className="font-bold text-sm">{pet.name}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Stage: {pet.stage}</div>
                  
                  {/* EXP Bar */}
                  <div className="w-full h-2 bg-gray-700 rounded-full mb-1 overflow-hidden">
                    <div 
                      className="h-full bg-green-400 transition-all duration-500" 
                      style={{ width: `${(pet.exp / pet.maxExp) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-right text-gray-400 mb-2">EXP: {pet.exp}/{pet.maxExp}</div>

                  <div className="text-xs bg-gray-900 p-2 rounded">
                    <span className="text-blue-400 font-bold">{pet.skill.name}</span>
                    <br/>
                    <span className="text-gray-400 text-[10px]">Effect: {pet.skill.value} {pet.skill.type}</span>
                  </div>

                  {pet.exp >= pet.maxExp && pet.stage !== 'adult' && (
                    <button 
                      onClick={() => evolvePet(pet.id)}
                      className="mt-2 w-full py-1.5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 rounded font-bold text-xs shadow-lg transform transition hover:scale-105 animate-pulse"
                    >
                      ✨ EVOLVE ✨
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <Shield className="mr-2 w-4 h-4 text-blue-400" /> Weapons
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {inventory.weapons.map(weapon => (
                <div key={weapon.id} className="p-3 bg-gray-800 rounded border border-gray-600">
                  <div className="text-2xl mb-1">🗡️</div>
                  <div className="font-bold text-sm">{weapon.name}</div>
                  <div className="text-[10px] text-gray-400">DMG: {weapon.damage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};