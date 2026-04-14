class UIController {
    constructor() {
        // Получаем элементы (без проверки на null — будет в app.js)
        this.headerCoins = document.getElementById('headerCoins');
        this.headerEnergy = document.getElementById('headerEnergy');
        this.playerName = document.getElementById('playerName');
        this.playerLevel = document.getElementById('playerLevel');
        this.playerAvatar = document.getElementById('playerAvatar');
        this.dragonSprite = document.getElementById('dragonSprite');
        this.dragonName = document.getElementById('dragonName');
        this.energyFill = document.getElementById('energyFill');
        this.profileCoins = document.getElementById('profileCoins');
        this.totalTaps = document.getElementById('totalTaps');
        this.dragonStageProfile = document.getElementById('dragonStageProfile');
        this.walletStatus = document.getElementById('walletStatus');
        
        this.initTabs();
    }
    
    initTabs() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.dataset.tab;
                this.switchTab(tabId);
            });
        });
    }
    
    switchTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${tabId}`)?.classList.add('active');
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === tabId) item.classList.add('active');
        });
    }
    
    updateAllUI(state) {
        const { coins, energy, maxEnergy, totalTaps, stage, walletConnected } = state;
        
        // Хедер
        if (this.headerCoins) this.headerCoins.textContent = coins;
        if (this.headerEnergy) this.headerEnergy.textContent = `${energy}/${maxEnergy}`;
        if (this.energyFill) this.energyFill.style.width = (energy / maxEnergy * 100) + '%';
        
        // Профиль
        if (this.profileCoins) this.profileCoins.textContent = coins;
        if (this.totalTaps) this.totalTaps.textContent = totalTaps;
        if (this.dragonStageProfile) this.dragonStageProfile.textContent = stage.name;
        if (this.walletStatus) this.walletStatus.textContent = walletConnected ? 'Привязан' : 'Не привязан';
        
        // Дракон
        if (this.dragonSprite) this.dragonSprite.textContent = stage.emoji;
        if (this.dragonName) this.dragonName.textContent = stage.name;
        
        // Аватар и уровень
        if (this.playerAvatar) this.playerAvatar.textContent = stage.emoji;
        if (this.playerLevel) {
            const level = Math.floor(coins / 100) + 1;
            this.playerLevel.textContent = `Ур. ${level}`;
        }
    }
}
