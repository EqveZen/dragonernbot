// ===== UI Controller =====

class UIController {
    constructor() {
        // Элементы верхней панели
        this.headerCoins = document.getElementById('headerCoins');
        this.headerEnergy = document.getElementById('headerEnergy');
        this.playerName = document.getElementById('playerName');
        this.playerLevel = document.getElementById('playerLevel');
        this.playerAvatar = document.getElementById('playerAvatar');
        
        // Элементы главного экрана
        this.dragonSprite = document.getElementById('dragonSprite');
        this.dragonName = document.getElementById('dragonName');
        this.energyFill = document.getElementById('energyFill');
        this.tapArea = document.getElementById('tapArea');
        
        // Профиль
        this.profileCoins = document.getElementById('profileCoins');
        this.totalTaps = document.getElementById('totalTaps');
        this.dragonStageProfile = document.getElementById('dragonStageProfile');
        this.walletStatus = document.getElementById('walletStatus');
        
        // Рефералы
        this.refLink = document.getElementById('refLink');
        this.refCount = document.getElementById('refCount');
        this.refEarned = document.getElementById('refEarned');
        
        // Квесты
        this.quest1Progress = document.getElementById('quest1Progress');
        this.quest2Progress = document.getElementById('quest2Progress');
        
        // Табы
        this.tabContents = document.querySelectorAll('.tab-content');
        this.navItems = document.querySelectorAll('.nav-item');
        this.currentTab = 'home';
        
        this.initTabs();
        console.log('✅ UIController создан');
    }
    
    initTabs() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.dataset.tab;
                this.switchTab(tabId);
            });
        });
    }
    
    switchTab(tabId) {
        this.tabContents.forEach(content => {
            content.classList.remove('active');
        });
        const targetTab = document.getElementById(`tab-${tabId}`);
        if (targetTab) targetTab.classList.add('active');
        
        this.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === tabId) item.classList.add('active');
        });
        
        this.currentTab = tabId;
    }
    
    // Обновление данных на всех экранах
    updateAllUI(gameState) {
        const { coins, energy, maxEnergy, totalTaps, stage, walletConnected } = gameState;
        
        // Хедер
        if (this.headerCoins) this.headerCoins.textContent = coins;
        if (this.headerEnergy) this.headerEnergy.textContent = `${energy}/${maxEnergy}`;
        if (this.energyFill) this.energyFill.style.width = (energy / maxEnergy * 100) + '%';
        
        // Профиль
        if (this.profileCoins) this.profileCoins.textContent = coins;
        if (this.totalTaps) this.totalTaps.textContent = totalTaps;
        if (this.dragonStageProfile) this.dragonStageProfile.textContent = stage.name;
        if (this.walletStatus) this.walletStatus.textContent = walletConnected ? 'Привязан 💎' : 'Не привязан';
        
        // Спрайт и имя дракона
        if (this.dragonSprite) this.dragonSprite.textContent = stage.emoji;
        if (this.dragonName) this.dragonName.textContent = stage.name;
        
        // Аватар и уровень
        if (this.playerAvatar) this.playerAvatar.textContent = stage.emoji;
        if (this.playerLevel) {
            const level = Math.floor(coins / 100) + 1;
            this.playerLevel.textContent = `Ур. ${level}`;
        }
    }
    
    animateTap() {
        const tapBtn = this.tapArea;
        if (tapBtn) {
            tapBtn.style.transform = 'scale(0.95)';
            setTimeout(() => tapBtn.style.transform = '', 80);
        }
    }
    
    showLowEnergyWarning() {
        alert('😴 Дракон устал! Посмотри рекламу для восстановления.');
    }
}

// Глобальная переменная (будет создана в app.js)
let ui;
