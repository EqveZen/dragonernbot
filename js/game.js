// ===== Game Logic =====

class Game {
    constructor(uiController) {
        this.ui = uiController;
        this.coins = 0;
        this.energy = CONFIG.MAX_ENERGY;
        this.maxEnergy = CONFIG.MAX_ENERGY;
        this.totalTaps = 0;
        this.walletConnected = false;
        this.stage = CONFIG.EVOLUTION_STAGES[0];
        
        console.log('🎮 Game создан, загружаем данные...');
        this.load();
        this.ui.updateAllUI(this.getState());
        console.log('📊 Начальное состояние:', this.getState());
    }
    
    getState() {
        return {
            coins: this.coins,
            energy: this.energy,
            maxEnergy: this.maxEnergy,
            totalTaps: this.totalTaps,
            stage: this.stage,
            walletConnected: this.walletConnected
        };
    }
    
    handleTap() {
        console.log('💥 handleTap, энергия:', this.energy);
        
        if (this.energy <= 0) {
            console.warn('⚠️ Нет энергии!');
            this.ui.showLowEnergyWarning();
            return false;
        }
        
        this.energy = Math.max(0, this.energy - CONFIG.ENERGY_PER_TAP);
        this.coins += CONFIG.COINS_PER_TAP;
        this.totalTaps += 1;
        
        this.updateStage();
        this.ui.animateTap();
        this.ui.updateAllUI(this.getState());
        this.save();
        
        console.log('✅ Тап обработан, монет:', this.coins);
        return true;
    }
    
    updateStage() {
        for (let i = CONFIG.EVOLUTION_STAGES.length - 1; i >= 0; i--) {
            if (this.coins >= CONFIG.EVOLUTION_STAGES[i].threshold) {
                this.stage = CONFIG.EVOLUTION_STAGES[i];
                break;
            }
        }
    }
    
    regenerate() {
        if (this.energy < this.maxEnergy) {
            this.energy = Math.min(this.maxEnergy, this.energy + CONFIG.ENERGY_REGEN_AMOUNT);
            this.ui.updateAllUI(this.getState());
            this.save();
        }
    }
    
    watchAd() {
        console.log('📺 Просмотр рекламы...');
        this.energy = Math.min(this.maxEnergy, this.energy + CONFIG.AD_REWARD_ENERGY);
        this.ui.updateAllUI(this.getState());
        this.save();
        alert('✅ +' + CONFIG.AD_REWARD_ENERGY + ' энергии!');
    }
    
    connectWallet() {
        console.log('💎 Подключение кошелька...');
        this.walletConnected = true;
        this.coins += CONFIG.TON_CONNECT_BONUS;
        this.ui.updateAllUI(this.getState());
        this.save();
        alert('✅ Кошелёк привязан! +' + CONFIG.TON_CONNECT_BONUS + ' монет.');
    }
    
    save() {
        try {
            const data = {
                coins: this.coins,
                energy: this.energy,
                totalTaps: this.totalTaps,
                walletConnected: this.walletConnected,
                lastUpdate: Date.now()
            };
            localStorage.setItem('dragon_game', JSON.stringify(data));
            console.log('💾 Данные сохранены');
        } catch (e) {
            console.error('❌ Ошибка сохранения:', e);
        }
    }
    
    load() {
        try {
            const saved = localStorage.getItem('dragon_game');
            if (saved) {
                const data = JSON.parse(saved);
                this.coins = data.coins || 0;
                this.totalTaps = data.totalTaps || 0;
                this.walletConnected = data.walletConnected || false;
                
                // Восстановление энергии
                const elapsed = Date.now() - (data.lastUpdate || Date.now());
                const regen = Math.floor(elapsed / CONFIG.ENERGY_REGEN_INTERVAL);
                this.energy = Math.min(this.maxEnergy, (data.energy || this.maxEnergy) + regen);
                
                console.log('📂 Данные загружены');
            } else {
                this.energy = this.maxEnergy;
                console.log('📂 Новый игрок');
            }
            this.updateStage();
        } catch (e) {
            console.error('❌ Ошибка загрузки:', e);
            this.energy = this.maxEnergy;
        }
    }
}

// Глобальная переменная
let game;
