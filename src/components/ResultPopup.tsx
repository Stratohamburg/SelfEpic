import React from 'react';
import { useGameStore } from '../store';
import { ResultPopupData } from '../types';
import { motion } from 'framer-motion';

interface Props {
  data: ResultPopupData;
}

export const ResultPopup: React.FC<Props> = ({ data }) => {
  const { closeResultPopup } = useGameStore();

  const handleClose = () => {
    data.onClose();
    closeResultPopup();
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 border-2 border-blue-500 rounded-xl p-6 w-full max-w-sm text-center shadow-[0_0_30px_rgba(59,130,246,0.3)]"
      >
        {data.image && (
          <div className="text-6xl mb-4 filter drop-shadow-lg">
            {data.image}
          </div>
        )}
        <h2 className="text-2xl font-bold text-blue-400 mb-2">{data.title}</h2>
        <p className="text-gray-300 mb-6">{data.description}</p>
        
        <button
          onClick={handleClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
};