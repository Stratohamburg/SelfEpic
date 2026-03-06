import { useGameStore } from './store';
import { Lobby } from './components/Lobby';
import { Camp } from './components/Camp';
import { Exploring } from './components/Exploring';
import { Combat } from './components/Combat';
import { HUD } from './components/HUD';
import { ResultPopup } from './components/ResultPopup';

function App() {
  const { phase, resultPopup } = useGameStore();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
      <div className="mobile-container relative bg-gray-900 overflow-hidden shadow-2xl">
        {phase !== 'LOBBY' && <HUD />}
        
        {phase === 'LOBBY' && <Lobby />}
        {phase === 'EXPLORING' && <Exploring />}
        {phase === 'COMBAT' && <Combat />}
        {phase === 'CAMP' && <Camp />}
        
        {phase === 'DEAD' && (
          <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center z-50">
            <h1 className="text-5xl font-bold text-white mb-4">YOU DIED</h1>
            <button 
              onClick={() => useGameStore.getState().resetGame()}
              className="px-6 py-3 bg-white text-red-900 font-bold rounded-lg hover:bg-gray-200"
            >
              Try Again
            </button>
          </div>
        )}

        {resultPopup && <ResultPopup data={resultPopup} />}
      </div>
    </div>
  );
}

export default App;