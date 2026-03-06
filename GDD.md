# 📜 《第一人称拓麻歌子冒险》游戏设计文档 (GDD)

## 1. 游戏概述 (Game Overview)
*   **游戏类型**：第一人称视角 / 事件驱动冒险 / 回合制自动战斗 / 电子宠物养成 (Roguelite)
*   **运行平台**：Web 浏览器 (纯前端架构，部署于 GitHub Pages)
*   **核心概念**：玩家以第一人称视角探索地牢/未知世界。**右手持实体武器**（物理打击），**左手持拓麻歌子**（召唤宠物释放技能）。游戏通过“事件双选”推进，战斗采用“战前序列编排 + 回合制自动战斗”模式。

---

## 2. 视觉风格与 UI 布局 (Visuals & UI)
*   **美术风格**：2D 伪 3D 视角（类似《世界树迷宫》）。静态背景图 + 动态 2D 立绘 + 像素风 UI。
*   **屏幕布局**：
    *   **顶部 (HUD)**：显示玩家当前血量 (HP)、当前层数/进度、金币数量。
    *   **中央 (主视口)**：显示当前遭遇的怪物立绘、NPC 或事件场景插图。战斗时怪物在此区域播放受击/攻击动画。
    *   **左下角 (左手)**：**拓麻歌子设备**。外壳为高清贴图，屏幕内为像素风动画，显示当前出战宠物的待机状态。
    *   **右下角 (右手)**：**当前装备的武器**。
    *   **底部 (交互区)**：打字机效果的文本对话框，以及事件触发时的“A/B 双选按钮”。

---

## 3. 游戏大厅 (Game Lobby)
玩家打开游戏后，首先进入游戏大厅。大厅是玩家进行战前准备和决定下一步行动的中心枢纽。大厅主要包含以下两个核心功能入口：

### 3.1 开始冒险 (Start Adventure)
*   **功能描述**：点击后，玩家将离开大厅，正式踏上未知的旅途，开启**事件驱动的冒险玩法**。
*   **玩法衔接**：进入冒险后，游戏将按照“核心玩法循环”进行，玩家将遭遇各种随机事件、敌人和抉择，直到冒险成功（通关当前区域）或失败（死亡）后结算并返回大厅。

### 3.2 养成界面 (Progression & Setup)
*   **功能描述**：点击后打开一个综合性的战前整备与养成面板。玩家在此处利用冒险中获得的资源来强化自身战斗力。
*   **核心子模块**：
    *   **宠物升级与拓麻歌子管理**：喂养宠物（消耗资源恢复饱食度/提升心情）、消耗经验值让宠物升级或进化，查看宠物技能树。
    *   **武器强化与替换**：查看当前拥有的武器库，装备更强力的武器，或消耗资源对武器进行锻造升级。
    *   **攻击序列编排 (Sequence Editor)**：在进入冒险前，玩家必须在此处配置好“出击序列”。通过拖拽的方式，将已装备的武器和出战的宠物排列在有限的槽位中，决定自动战斗时的出手顺序。

---

## 4. 核心玩法循环 (Core Loop)
1.  **事件触发**：抽取并显示一个随机/固定事件。
2.  **做出抉择**：玩家阅读文本，点击双选按钮之一（例如：A. 强攻 / B. 潜行）。
3.  **结果结算**：
    *   *和平结果*：获得物品、宠物经验、扣除属性等。
    *   *战斗结果*：进入战斗位面。
4.  **战中休整**：在特定事件（如营地）中，可进行简单的状态恢复或临时调整。
5.  **循环与结算**：点击“下一步”进入新事件，直至通关或玩家死亡，随后结算收益并返回**游戏大厅**。

---

## 5. 战斗系统 (Combat System)
战斗为**回合制自动战斗 (Auto-Battler)**，强调战前的策略编排。

### 5.1 战前编队 (Sequence Editor)
*   **出击序列**：玩家在非战斗状态下，需配置一条“攻击时间线”。
*   **槽位规则**：
    *   初期解锁 2 个槽位（1把武器 + 1只宠物）。
    *   随游戏推进，最多解锁 5 个槽位（1把武器 + 4只宠物）。
    *   **武器**：必须且只能上阵 1 把。
    *   **宠物**：最多上阵 4 只。
*   **自由排序**：玩家可自由拖拽决定出手顺序。
    *   *示例*：`[破甲宠物] -> [手持武器] -> [治疗宠物] -> [火球宠物]`

### 5.2 战斗流程 (Battle Flow)
遭遇怪物后，战斗全自动进行，玩家观看演出（提供战斗日志和加速功能）。
1.  **先手判定**：根据双方“速度值(Speed)”或事件选项决定谁先行动。
2.  **回合执行**：
    *   **玩家回合**：严格按照玩家设定的“出击序列”依次执行。
        *   *宠物节点*：左手拓麻歌子屏幕闪烁 -> 宠物全息投影至屏幕中央 -> 释放技能（伤害/治疗/Buff） -> 投影消失，退回拓麻歌子。
        *   *武器节点*：右手武器执行向前挥砍/突刺动画 -> 对怪物造成物理伤害。
    *   **怪物回合**：敌方存活的怪物依次行动。怪物立绘放大扑向屏幕 -> 屏幕泛红震动 -> 玩家扣除 HP。
3.  **胜负判定**：
    *   **胜利**：所有怪物 HP 降为 0。结算战利品。
    *   **失败**：玩家自身 HP 降为 0。游戏结束 (Game Over)。
    *   *注：宠物绝对安全，没有血量，不会成为怪物的攻击目标。*

### 5.3 索敌机制 (Targeting)
*   **默认索敌**：单体攻击默认锁定敌方“最前排”或“站位最靠左”的存活怪物。
*   **特殊索敌**：部分宠物技能带有特殊逻辑（如：全体 AOE、锁定血量最低者、为玩家自身恢复 HP）。

---

## 6. 养成系统 (Progression)
### 6.1 拓麻歌子 (宠物养成)
*   **属性**：
    *   `Hunger` (饱食度)：随探索下降，需消耗素材喂食。
    *   `Mood` (心情)：影响宠物技能的暴击率或触发概率。
    *   `Exp` (经验值)：战斗胜利获得。
*   **进化树 (Evolution)**：
    *   经验值满后触发进化（如：数码蛋 -> 幼年期 -> 成熟期）。
    *   进化后，宠物的像素外观、全息投影立绘、技能数值和类型均会发生质变。

### 6.2 主角强化
*   **武器替换**：通过事件获得不同词条的武器（如：高基础伤害的巨剑、带吸血特效的匕首）。
*   **遗物/被动**：收集特殊道具，提供全局增益（如：增加玩家最大血量、提升宠物经验获取率）。

---

## 7. 技术栈与架构方案 (Technical Architecture)

### 7.1 核心技术选型
*   **框架**：React 18 + TypeScript + Vite (极速构建，完美支持 GitHub Pages 静态部署)。
*   **状态管理**：Zustand (轻量级，管理游戏循环、战斗状态机、背包数据)。
*   **动画引擎**：Framer Motion (处理武器挥砍、宠物弹出、怪物受击、UI 切换等流畅动画)。
*   **样式方案**：Tailwind CSS (快速构建复古 UI、血条、网格布局)。
*   **数据持久化**：LocalStorage (自动保存玩家进度和宠物状态)。

### 7.2 核心数据结构设计 (TypeScript)
```typescript
// 实体定义
interface Player {
  hp: number;
  maxHp: number;
  speed: number;
  gold: number;
  floor: number;
}

interface Weapon {
  id: string;
  name: string;
  damage: number;
  type: 'physical' | 'magic';
  effect?: 'lifesteal' | 'crit'; // 特殊词条
  isRanged?: boolean; // 是否为远程武器（影响动画表现）
}

interface Pet {
  id: string;
  name: string;
  stage: 'egg' | 'baby' | 'adult';
  hunger: number;
  mood: number;
  exp: number;
  maxExp: number;
  sprite: string;
  skill: {
    name: string;
    type: 'damage' | 'heal' | 'buff';
    value: number;
    target: 'single' | 'all' | 'self';
    isRanged?: boolean; // 是否为远程技能
  };
}

interface Monster {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  damage: number;
  sprite: string; // Emoji 或图片 URL
}

// 事件与弹窗定义
type EventType = 'combat' | 'treasure' | 'trap' | 'camp' | 'merchant';

interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  image?: string;
  options: {
    label: string;
    action: () => void;
  }[];
}

interface ResultPopupData {
  title: string;
  description: string;
  image?: string;
  onClose: () => void;
}

// 战斗序列定义
type SequenceNode = 
  | { type: 'weapon', data: Weapon } 
  | { type: 'pet', data: Pet };

type ActionSequence = SequenceNode[]; 

// 全局状态机 (Zustand Store)
interface GameState {
  // 游戏阶段: 大厅 | 探索中 | 战斗中 | 营地编队 | 死亡
  phase: 'LOBBY' | 'EXPLORING' | 'COMBAT' | 'CAMP' | 'DEAD'; 
  
  // 玩家数据
  player: Player;
  inventory: { weapons: Weapon[], pets: Pet[], items: any[] };
  
  equippedWeapon: Weapon | null;
  sequence: ActionSequence;
  
  currentEvent: GameEvent | null;
  resultPopup: ResultPopupData | null;
  
  // 战斗数据
  combat: {
    monsters: Monster[];
    turn: 'player' | 'enemy';
    currentActionIndex: number;
    logs: string[];
    isAutoPlaying: boolean;
    damageNumbers: { id: string; value: number; x: number; y: number; color: string }[];
    activeAnimation?: {
      type: 'pet_attack' | 'weapon_attack' | 'enemy_attack';
      sourceId?: string;
      targetIndex?: number;
      isRanged?: boolean;
    };
  };
  
  // 核心方法 (部分)
  setPhase: (phase: GameState['phase']) => void;
  startAdventure: () => void;
  triggerEvent: (event: GameEvent) => void;
  generateNextEvent: () => void;
  startCombat: (monsters: Monster[]) => void;
  executeNextAction: () => void; // 驱动自动战斗的核心函数
  // ... 其他状态更新方法 (如 gainGold, evolvePet, upgradeWeapon 等)
}
```

---

### 📝 后续开发步骤建议
1.  **Phase 1：项目初始化** (搭建 React+Vite 环境，配置 Tailwind 和 Zustand)。
2.  **Phase 2：核心战斗原型** (实现 `executeNextAction` 自动战斗逻辑，能在控制台或简易 UI 中跑通回合制扣血)。
3.  **Phase 3：UI 与动画表现** (实装第一人称视角的左右手布局，加入 Framer Motion 动画)。
4.  **Phase 4：事件系统与编队** (实现 JSON 驱动的事件双选，以及拖拽编队功能)。
5.  **Phase 5：内容填充与部署** (添加更多怪物、宠物进化分支，打包部署至 GitHub Pages)。