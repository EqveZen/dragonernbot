// ===== Game Logic =====

class Game {
    constructor(uiController) {
        this.ui = uiController;
        
        // Состояние игры
        this.coins = 0;
        this.energy = CONFIG.MAX_ENERGY;
        this.walletConnected = false;
        
        // Таймеры
        this.regenInterval = null;
        
        // Загрузка сохранённых данных
        this.loadFromStorage();
    }
    
    // Загрузка из localStorage (временно, пока нет бэкенда)
    loadFromStorage() {
        try {
            const savedCoins = localStorage.getItem(STORAGE_KEYS.COINS);
            const savedEnergy = localStorage.getItem(STORAGE_KEYS.ENERGY);
            const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
            const walletConnected = localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED);
            
            if (savedCoins !== null) {
                this.coins = parseInt(savedCoins, 10) || 0;
            }
            
            if (savedEnergy !== null) {
                this.energy = parseInt(savedEnergy, 10) || CONFIG.MAX_ENERGY;
            } else {
                this.energy = CONFIG.MAX_ENERGY;
            }
            
            // Восстановление энергии за время отсутствия
            if (lastUpdate) {
                const timePassed = Date.now() - parseInt(lastUpdate, 10);
                const energyToRegen = Math.floor(timePassed / CONFIG.ENERGY_REGEN_INTERVAL) 
                                     * CONFIG.ENERGY_REGEN_AMOUNT;
                this.energy = Math.min(CONFIG.MAX_ENERGY, this.energy + energyToRegen);
            }
            
            this.walletConnected = walletConnected === 'true';
        } catch (e) {
            console.warn('Не удалось загрузить данные из localStorage:', e);
        }
        
        this.clampValues();
    }
    
    // Сохранение в localStorage
    saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEYS.COINS, this.coins.toString());
            localStorage.setItem(STORAGE_KEYS.ENERGY, this.energy.toString());
            localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
            localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, this.walletConnected.toString());
        } catch (e) {
            console.warn('Не удалось сохранить данные:', e);
        }
    }
    
    // Проверка и коррекция значений
    clampValues() {
        this.energy = Math.min(CONFIG.MAX_ENERGY, Math.max(0, this.energy));
        this.coins = Math.max(0, this.coins);
    }
    
    // Обработка тапа
    handleTap(event) {
        if (this.energy <= 0) {
            this.ui.showLowEnergyWarning();
            return false;
        }
        
        // Тратим энергию, получаем монеты
        this.energy = Math.max(0, this.energy - CONFIG.ENERGY_PER_TAP);
        this.coins += CONFIG.COINS_PER_TAP;
        
        // Анимации
        this.ui.animateDragonTap();
        
        // Всплывающие очки (если есть координаты тапа)
        if (event && (event.clientX || event.touches)) {
            const x = event.clientX || event.touches?.[0]?.clientX;
            const y = event.clientY || event.touches?.[0]?.clientY;
            this.ui.showFloatingScore(CONFIG.COINS_PER_TAP, x, y);
        } else {
            this.ui.showFloatingScore(CONFIG.COINS_PER_TAP);
        }
        
        // Вибрация
        const tg = window.Telegram?.WebApp;
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
        
        // Обновление UI
        this.updateAllUI();
        
        // Сохранение
        this.saveToStorage();
        
        return true;
    }
    
    // Восстановление энергии
    regenerateEnergy() {
        if (this.energy < CONFIG.MAX_ENERGY) {
            this.energy = Math.min(CONFIG.MAX_ENERGY, 
                                   this.energy + CONFIG.ENERGY_REGEN_AMOUNT);
            this.updateAllUI();
            this.saveToStorage();
        }
    }
    
    // Просмотр рекламы (награда)
    watchAd() {
        const tg = window.Telegram?.WebApp;
        
        // В реальном проекте здесь вызов рекламного API Telegram
        const showAdCallback = () => {
            this.energy = Math.min(CONFIG.MAX_ENERGY, 
                                   this.energy + CONFIG.AD_REWARD_ENERGY);
            this.updateAllUI();
            this.saveToStorage();
            
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('success');
            }
        };
        
        if (tg?.showPopup) {
            tg.showPopup({
                title: '📺 Реклама',
                message: 'Смотрите рекламу и получите +' + CONFIG.AD_REWARD_ENERGY + ' энергии!',
                buttons: [
                    { id: 'watch', type: 'default', text: 'Смотреть' },
                    { id: 'cancel', type: 'cancel', text: 'Отмена' }
                ]
            }, (buttonId) => {
                if (buttonId === 'watch') {
                    // Имитация показа рекламы
                    setTimeout(showAdCallback, 1000);
                }
            });
        } else {
            // Заглушка для веба
            if (confirm('Показать рекламу и получить +' + CONFIG.AD_REWARD_ENERGY + ' энергии?')) {
                showAdCallback();
            }
        }
    }
    
    // Подключение TON кошелька
    connectTON() {
        const tg = window.Telegram?.WebApp;
        
        const connectCallback = () => {
            this.walletConnected = true;
            this.coins += CONFIG.TON_CONNECT_BONUS;
            this.updateAllUI();
            this.saveToStorage();
            
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('success');
            }
        };
        
        if (tg?.showPopup) {
            tg.showPopup({
                title: '💎 TON Connect',
                message: 'Подключите кошелёк Tonkeeper и получите +' + 
                         CONFIG.TON_CONNECT_BONUS + ' монет!',
                buttons: [
                    { id: 'connect', type: 'default', text: 'Подключить' },
                    { id: 'later', type: 'cancel', text: 'Позже' }
                ]
            }, (buttonId) => {
                if (buttonId === 'connect') {
                    // Здесь будет реальный TON Connect
                    setTimeout(connectCallback, 1000);
                }
            });
        } else {
            if (confirm('Подключить TON кошелёк? (+' + CONFIG.TON_CONNECT_BONUS + ' монет)')) {
                connectCallback();
            }
        }
    }
    
    // Обновление всего UI
    updateAllUI() {
        this.clampValues();
        this.ui.updateCoins(this.coins);
        this.ui.updateEnergy(this.energy, CONFIG.MAX_ENERGY);
        this.ui.updateEvolutionProgress(this.coins);
    }
    
    // Запуск регенерации
    startRegeneration() {
        this.stopRegeneration();
        this.regenInterval = setInterval(() => {
            this.regenerateEnergy();
        }, CONFIG.ENERGY_REGEN_INTERVAL);
    }
    
    // Остановка регенерации
    stopRegeneration() {
        if (this.regenInterval) {
            clearInterval(this.regenInterval);
            this.regenInterval = null;
        }
    }
    
    // Инициализация
    init() {
        this.updateAllUI();
        this.startRegeneration();
    }
    
    // Очистка при закрытии
    destroy() {
        this.stopRegeneration();
        this.saveToStorage();
    }
}

let game;
