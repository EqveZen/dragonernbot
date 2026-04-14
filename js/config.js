// ===== Конфигурация игры DragonEgg =====

const CONFIG = {
    // Игровая экономика
    COINS_PER_TAP: 1,
    ENERGY_PER_TAP: 1,
    MAX_ENERGY: 100,
    
    // Восстановление энергии
    ENERGY_REGEN_INTERVAL: 2000, // мс
    ENERGY_REGEN_AMOUNT: 1,
    
    // Эволюция дракона
    EVOLUTION_STAGES: [
        { threshold: 0, emoji: '🥚', name: 'Яйцо' },
        { threshold: 50, emoji: '🥚✨', name: 'Яйцо с трещиной' },
        { threshold: 150, emoji: '🐣', name: 'Детёныш' },
        { threshold: 500, emoji: '🐉', name: 'Дракон' },
        { threshold: 2000, emoji: '🔥🐉🔥', name: 'Легендарный дракон' }
    ],
    
    // Награды за рекламу
    AD_REWARD_ENERGY: 15,
    
    // Бонусы
    TON_CONNECT_BONUS: 100,
    
    // Анимации
    TAP_ANIMATION_DURATION: 100,
    FLOATING_SCORE_DURATION: 300
};

// Ключи для localStorage (для временного хранения до подключения бэкенда)
const STORAGE_KEYS = {
    COINS: 'dragonEgg_coins',
    ENERGY: 'dragonEgg_energy',
    LAST_UPDATE: 'dragonEgg_lastUpdate',
    WALLET_CONNECTED: 'dragonEgg_walletConnected'
};

// Экспорт (если используем модули, но пока работаем в глобальном scope)
