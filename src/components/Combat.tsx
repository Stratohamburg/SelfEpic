import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const Combat: React.FC = () => {
  const { combat, executeNextAction, sequence, inventory } = useGameStore();
  const { activeAnimation } = combat;
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [isHitFlashVisible, setIsHitFlashVisible] = useState(false);
  const lastPlayerDamageId = useRef<string | null>(null);

  useEffect(() => {
    if (combat.isAutoPlaying && !activeAnimation) {
      const timer = setTimeout(() => {
        executeNextAction();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [combat.isAutoPlaying, combat.turn, combat.currentActionIndex, activeAnimation, executeNextAction]);

  useEffect(() => {
    const latestPlayerDamage = [...combat.damageNumbers]
      .filter((dn) => dn.y === 80)
      .slice(-1)[0];

    if (latestPlayerDamage && latestPlayerDamage.id !== lastPlayerDamageId.current) {
      lastPlayerDamageId.current = latestPlayerDamage.id;
      setIsScreenShaking(true);
      setIsHitFlashVisible(true);

      const shakeTimer = setTimeout(() => setIsScreenShaking(false), 300);
      const flashTimer = setTimeout(() => setIsHitFlashVisible(false), 500);

      return () => {
        clearTimeout(shakeTimer);
        clearTimeout(flashTimer);
      };
    }
    return undefined;
  }, [combat.damageNumbers]);

  // Find the active pet if it's a pet attack
  const activePetNode = activeAnimation?.type === 'pet_attack' 
    ? sequence.find(n => n.type === 'pet' && n.data.id === activeAnimation.sourceId) 
    : null;
  const activePet = activePetNode?.type === 'pet' ? activePetNode.data : null;

  // Tamagotchi screen icon
  const currentSequenceNode = sequence[combat.currentActionIndex];
  const tamagotchiIcon = activePet 
    ? activePet.sprite 
    : (currentSequenceNode?.type === 'pet' ? currentSequenceNode.data.sprite : (inventory.pets[0]?.sprite || '👾'));

  return (
    <motion.div
      className="relative h-full bg-gray-900 text-white overflow-hidden flex flex-col"
      animate={
        isScreenShaking
          ? { x: [-8, 8, -6, 6, 0], y: [-2, 2, -2, 0] }
          : { x: 0, y: 0 }
      }
      transition={{ duration: 0.3 }}
    >
      {/* Main Viewport (Monsters) */}
      <div className="flex-1 flex items-start justify-center relative pt-24">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        
        <motion.div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,0,0,0) 40%, rgba(255,0,0,0.4) 100%)'
          }}
          animate={{ opacity: isHitFlashVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="flex space-x-6 z-10">
          <AnimatePresence>
            {combat.monsters.map((monster, index) => {
              const isHit = combat.damageNumbers.some(dn => dn.y === 30 && dn.x === 50 + (index * 20));
              const isMeleeTarget =
                activeAnimation?.type === 'weapon_attack' &&
                !activeAnimation.isRanged &&
                activeAnimation.targetIndex === index;
              return monster.hp > 0 && (
                // Outer wrapper: scales the ENTIRE monster card (UI + sprite) for melee rush
                <motion.div
                  key={monster.id}
                  initial={{ opacity: 0, y: 50, scale: 0.4 }}
                  animate={
                    isMeleeTarget
                      ? {
                          // 接近 → 停顿 → 攻击 → 停顿(等待挥完) → 返回
                          scale:  [1,    2.6,    3,    3,    2.6,    1  ],
                          y:      [0,  160,  160,  160,  160,   0  ],  // 向下移，怪物压迫感
                          opacity: 1,
                        }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={
                    isMeleeTarget
                      // 怪物在 t=0.75 才开始缩回，确保武器挥完(~0.68)后才收
                      ? { duration: 1.5, times: [0, 0.33, 0.47, 0.6, 0.75, 1], ease: 'easeInOut' }
                      : { duration: 0.4 }
                  }
                  className="flex flex-col items-center"
                  style={{ transformOrigin: 'center bottom' }}
                >
                  {/* Stats above monster */}
                  <div className="flex items-center space-x-2 mb-1.5 text-[10px] font-bold bg-gray-900/80 px-2 py-0.5 rounded-lg border border-gray-700">
                    <div className="flex items-center text-red-400">
                      <span className="mr-0.5 text-[8px]">❤️</span>
                      {monster.hp}/{monster.maxHp}
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <span className="mr-0.5 text-[8px]">⚔️</span>
                      {monster.damage}
                    </div>
                  </div>
                  
                  {/* HP Bar */}
                  <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden border border-gray-600 mb-2">
                    <motion.div 
                      className="h-full bg-red-500"
                      initial={{ width: '100%' }}
                      animate={{ width: `${(monster.hp / monster.maxHp) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Monster Sprite — hit flash & melee shake+brightness */}
                  <motion.div 
                    className="text-6xl filter drop-shadow-lg relative"
                    animate={
                      isMeleeTarget
                        ? {
                            // 7 帧：武器挥出(t=0.40)到峰值(t=0.55)的中间点 t=0.525 触发受击
                            // 受击：抖动 + 高亮白闪
                            x:      [0,    0,     -14,   12,   -10,    0,    0 ],
                            filter: [
                              'brightness(1) blur(0px)',   // t=0      静止
                              'brightness(1) blur(0px)',   // t=0.40   武器刚开始挥
                              'brightness(4) blur(0px)',   // t=0.525  受击瞬间：白闪
                              'brightness(2) blur(2px)',   // t=0.575  抖动中
                              'brightness(1.5) blur(1px)', // t=0.625  抖动减弱
                              'brightness(1) blur(0px)',   // t=0.70   恢复
                              'brightness(1) blur(0px)',   // t=1      正常
                            ],
                          }
                        : isHit
                          ? {
                              x: [-10, 10, -10, 10, 0],
                              filter: ['brightness(1)', 'brightness(2)', 'brightness(1)']
                            }
                          : {}
                    }
                    transition={
                      isMeleeTarget
                        // 受击在武器挥到一半(t=0.525)触发，武器归位(t=0.65)后震动已平息
                        ? { duration: 1.5, times: [0, 0.40, 0.525, 0.575, 0.625, 0.70, 1] }
                        : { duration: 0.4 }
                    }
                  >
                    {monster.sprite}
                    
                    {/* Floating Damage Numbers for Monster */}
                    <AnimatePresence>
                      {combat.damageNumbers.map((dn) => (
                        dn.y === 30 && ( // Simple check to see if it's for monster
                          <motion.div
                            key={dn.id}
                            initial={{ opacity: 1, y: 0, scale: 1.5 }}
                            animate={{ opacity: 0, y: -50, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute top-0 left-1/2 transform -translate-x-1/2 font-bold text-2xl z-50 ${dn.color}`}
                          >
                            -{dn.value}
                          </motion.div>
                        )
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Spawned Pet Animation */}
      <AnimatePresence>
        {activeAnimation?.type === 'pet_attack' && activePet && (
          <>
            {/* Spawn burst effect: rings at pet standby position (arrives at ~0.3s = 0.15*2s) */}
            {/* Standby position: left=calc(50%-30px), top=calc(50%+80px) */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`burst-ring-${i}`}
                className="absolute rounded-full border-4 border-yellow-300 pointer-events-none z-20"
                initial={{ opacity: 0.9, scale: 0, x: '-50%', y: '-50%', width: 50, height: 50 }}
                animate={{ opacity: 0, scale: 4, x: '-50%', y: '-50%' }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.55, ease: 'easeOut' }}
                style={{ left: 'calc(50% - 30px)', top: 'calc(50% + 80px)' }}
              />
            ))}

            {/* Spawn sparkles shooting outward at pet standby position */}
            {['✨', '⭐', '💫', '✨', '⭐', '💥'].map((spark, i) => (
              <motion.div
                key={`spark-${i}`}
                className="absolute pointer-events-none z-20 text-2xl"
                initial={{ opacity: 1, x: 0, y: 0, scale: 1.8 }}
                animate={{
                  opacity: [1, 1, 0],
                  x: [0, Math.cos((i / 6) * Math.PI * 2) * 70],
                  y: [0, Math.sin((i / 6) * Math.PI * 2) * 70],
                  scale: [1.8, 0.4],
                }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.55, ease: 'easeOut' }}
                style={{ left: 'calc(50% - 30px)', top: 'calc(50% + 80px)' }}
              >
                {spark}
              </motion.div>
            ))}

            {/* Main Pet */}
            <motion.div
              key="spawned-pet"
              // Starts at tamagotchi screen center: x=-112px from viewport center, y=+220px below center
              // Standby position: x=-30, y=80 (scale=2, large "close-up" feel)
              initial={{ opacity: 0, scale: 0, x: -112, y: 220 }}
              animate={
                activeAnimation.isRanged
                  ? {
                      opacity:  [0,   1,    1,    1,    0  ],
                      scale:    [0,   2,    2,    2,    0  ],
                      x:        [-112, -30,  -30,  -30, -112],
                      y:        [220,  80,   80,   80,  220 ],
                      filter:   [
                        'brightness(2.5) blur(6px)',
                        'brightness(1) blur(0px)',
                        'brightness(1) blur(0px)',
                        'brightness(1) blur(0px)',
                        'brightness(2) blur(10px)',
                      ],
                    }
                  : {
                      // scale shrinks as pet dashes toward far monster, returns to full size
                      opacity:  [0,   1,    1,    0.9,  1,    0  ],
                      scale:    [0,   2,    2,    0.65, 2,    0  ],
                      x:        [-112, -30,  -30,  30,   -30, -112],
                      y:        [220,  80,   80,  -140,  80,  220 ],
                      filter:   [
                        'brightness(2.5) blur(6px)',
                        'brightness(1) blur(0px)',
                        'brightness(1) blur(0px)',
                        'brightness(1.5) blur(0px)',
                        'brightness(1) blur(0px)',
                        'brightness(2) blur(10px)',
                      ],
                    }
              }
              transition={{
                duration: 2,
                times: activeAnimation.isRanged
                  ? [0, 0.15, 0.4, 0.85, 1]
                  : [0, 0.15, 0.35, 0.55, 0.85, 1],
              }}
              className="absolute z-10 text-6xl filter drop-shadow-2xl pointer-events-none"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            >
              {activePet.sprite}

              {/* Ranged Projectile */}
              {activeAnimation.isRanged && (
                <motion.div
                  initial={{ opacity: 0, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: [0, 1, 1, 0], x: [0, 0], y: [0, -220], scale: [1.2, 1, 0.6] }}
                  transition={{ delay: 0.4, duration: 0.45 }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 text-4xl"
                >
                  ✨
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* First Person View (Hands) */}
      <div className="absolute bottom-24 left-0 w-full h-48 pointer-events-none flex justify-between items-end px-4">
        
        {/* Floating Damage Numbers for Player */}
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-50">
          <AnimatePresence>
            {combat.damageNumbers.map((dn) => (
              dn.y === 80 && ( // Simple check to see if it's for player
                <motion.div
                  key={dn.id}
                  initial={{ opacity: 1, y: 0, scale: 1.5 }}
                  animate={{ opacity: 0, y: -50, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`font-bold text-3xl ${dn.color}`}
                >
                  -{dn.value}
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Left Hand: Tamagotchi */}
        <motion.div 
          className="w-32 h-48 bg-gray-800 rounded-3xl border-4 border-gray-700 flex flex-col items-center justify-center shadow-2xl relative overflow-visible z-20"
          animate={
            activeAnimation?.type === 'pet_attack'
              ? { y: -20, scale: 1.15, boxShadow: "0px 0px 35px rgba(250, 200, 50, 0.9)" }
              : combat.turn === 'player' && sequence[combat.currentActionIndex]?.type === 'pet' 
                ? { y: -20, scale: 1.1, boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.5)" } 
                : { y: 0, scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }
          }
          transition={{ duration: 0.2 }}
        >
          {/* Tamagotchi spawn aura rings (outside device) */}
          <AnimatePresence>
            {activeAnimation?.type === 'pet_attack' && (
              <>
                {[0, 1].map((i) => (
                  <motion.div
                    key={`tama-ring-${i}`}
                    className="absolute rounded-3xl border-2 border-yellow-300 pointer-events-none"
                    initial={{ opacity: 0.8, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.6 }}
                    transition={{ delay: i * 0.18, duration: 0.5, ease: 'easeOut' }}
                    style={{ inset: 0 }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          <div className="w-24 h-24 bg-green-900 rounded-lg border-4 border-gray-900 flex items-center justify-center mb-2 relative overflow-hidden">
            {/* Scanlines effect */}
            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2rV7928GBgYGBkAAgwAEtwH8A2A8AAAAAElFTkSuQmCC')] opacity-20"></div>

            {/* Screen flash when pet spawns */}
            <motion.div
              className="absolute inset-0 rounded pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,255,180,1) 10%, rgba(255,220,50,0.5) 60%, transparent 100%)' }}
              animate={
                activeAnimation?.type === 'pet_attack'
                  ? { opacity: [0, 1, 0.6, 0] }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.45 }}
            />

            {/* Screen pixel-burst particles (stay inside screen) */}
            <AnimatePresence>
              {activeAnimation?.type === 'pet_attack' && (
                <>
                  {['✨', '⭐', '💫'].map((s, i) => (
                    <motion.span
                      key={`screen-spark-${i}`}
                      className="absolute text-base pointer-events-none"
                      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      animate={{
                        opacity: [1, 0],
                        x: Math.cos((i / 3) * Math.PI * 2) * 22,
                        y: Math.sin((i / 3) * Math.PI * 2) * 22,
                        scale: [1.2, 0],
                      }}
                      exit={{}}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </>
              )}
            </AnimatePresence>

            <span className="text-4xl animate-bounce relative z-10">
              {tamagotchiIcon}
            </span>
          </div>
          <div className="flex space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          </div>
        </motion.div>

        {/* Right Hand: Weapon */}
        <motion.div 
          className="w-24 h-48 bg-gray-700 rounded-t-full border-4 border-gray-600 flex items-start justify-center pt-4 shadow-2xl origin-bottom z-30"
          animate={
            activeAnimation?.type === 'weapon_attack'
              ? activeAnimation.isRanged
                // 远程：立即抬起并复位（保持原效果）
                ? { rotate: -45, y: -50 }
                // 近战：等怪物放大后（~t=0.4）再挥出，挥完（~t=0.68）归位
                // keyframe: 静止 → 静止 → 挥出 → 归位
                : { rotate: [0, 0, -70, 10, 0], y: [0, 0, -65, -10, 0] }
              : { rotate: 0, y: 0 }
          }
          transition={
            activeAnimation?.type === 'weapon_attack' && !activeAnimation?.isRanged
              // 与怪物动画同步：总时长 1.5s，t=0.47 开始挥，t=0.60 收
              ? { duration: 1.5, times: [0, 0.40, 0.55, 0.65, 1], ease: [0.4, 0, 0.2, 1] }
              : { type: 'spring', stiffness: 300, damping: 15 }
          }
        >
          <span className="text-6xl transform -rotate-45">🗡️</span>
        </motion.div>
      </div>

      {/* Combat Sequence UI */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gray-900/95 border-t border-gray-700 p-3 flex flex-col justify-center z-20">
        
        {/* Sequence Indicator */}
        <div className="flex justify-center items-center overflow-x-auto py-2 px-4">
          {sequence.map((node, idx) => (
            <React.Fragment key={idx}>
              <div 
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 ${
                  combat.turn === 'player' && combat.currentActionIndex === idx
                    ? 'border-blue-400 bg-blue-900 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10'
                    : 'border-gray-600 bg-gray-800 opacity-70'
                }`}
              >
                {node.type === 'weapon' ? '🗡️' : node.data.sprite}
              </div>
              
              {/* Add arrow between nodes, but not after the last node */}
              {idx < sequence.length - 1 && (
                <div className={`flex-shrink-0 mx-2 transition-all duration-300 ${
                  combat.turn === 'player' && combat.currentActionIndex === idx
                    ? 'text-blue-400 animate-pulse'
                    : 'text-gray-600'
                }`}>
                  <ArrowRight size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
};