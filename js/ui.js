// ===== UI Controller =====

class UIController {
    constructor() {
        // Элементы DOM
        this.elements = {
            coinDisplay: document.getElementById('coinDisplay'),
            energyFill: document.getElementById('energyFill'),
            energyText: document.getElementById('energyText'),
            dragonSprite: document.getElementById('dragonSprite'),
            tapArea: document.getElementById('tapArea'),
            floatingScore: document.getElementById('floatingScore'),
            watchAdBtn: document.getElementById('watchAdBtn'),
            connectWalletBtn: document.getElementById('connectWalletBtn'),
            evolutionSection: document.getElementById('evolutionSection'),
            evolutionFill: document.getElementById('evolutionFill'),
            evolutionPercent: document.getElementById('evolutionPercent')
        };
        
        // Состояние анимаций
        this.animationTimeouts = [];
    }
    
    // Обновление монет
    updateCoins(value) {
        if (this.elements.coinDisplay) {
            this.elements.coinDisplay.textContent = value;
            this.animateCoinChange();
        }
    }
    
    // Обновление энергии
    updateEnergy(current, max) {
        const percent = (current / max) * 100;
        const fill = this.elements.energyFill;
        const text = this.elements.energyText;
        
        if (fill) {
            fill.style.width = percent + '%';
            
            // Цветовая индикация
            fill.classList.remove('low', 'critical');
            if (percent < 30) {
                fill.classList.add('critical');
            } else if (percent < 60) {
                fill.classList.add('low');
            }
        }
        
        if (text) {
            text.textContent = `${current}/${max}`;
        }
    }
    
    // Обновление спрайта дракона (эволюция)
    updateDragonSprite(emoji) {
        if (this.elements.dragonSprite) {
            this.elements.dragonSprite.textContent = emoji;
        }
    }
    
    // Обновление прогресса эволюции
    updateEvolutionProgress(currentCoins) {
        const stages = CONFIG.EVOLUTION_STAGES;
        let currentStage = stages[0];
        let nextStage = stages[1];
        
        for (let i = stages.length - 1; i >= 0; i--) {
            if (currentCoins >= stages[i].threshold) {
                currentStage = stages[i];
                nextStage = stages[i + 1] || stages[i];
                break;
            }
        }
        
        // Обновляем спрайт
        this.updateDragonSprite(currentStage.emoji);
        
        // Показываем прогресс до следующей стадии
        if (nextStage && nextStage.threshold > currentStage.threshold) {
            const progress = ((currentCoins - currentStage.threshold) / 
                             (nextStage.threshold - currentStage.threshold)) * 100;
            
            if (this.elements.evolutionSection) {
                this.elements.evolutionSection.style.display = 'block';
            }
            if (this.elements.evolutionFill) {
                this.elements.evolutionFill.style.width = Math.min(progress, 100) + '%';
            }
            if (this.elements.evolutionPercent) {
                this.elements.evolutionPercent.textContent = 
                    `${currentCoins}/${nextStage.threshold}`;
            }
        } else {
            // Максимальный уровень
            if (this.elements.evolutionSection) {
                this.elements.evolutionSection.style.display = 'block';
            }
            if (this.elements.evolutionFill) {
                this.elements.evolutionFill.style.width = '100%';
            }
            if (this.elements.evolutionPercent) {
                this.elements.evolutionPercent.textContent = 'MAX';
            }
        }
    }
    
    // Анимация изменения монет
    animateCoinChange() {
        const coinElement = this.elements.coinDisplay?.parentElement;
        if (coinElement) {
            coinElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                coinElement.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    // Показ всплывающих очков при тапе
    showFloatingScore(amount, x, y) {
        const floating = this.elements.floatingScore;
        if (!floating) return;
        
        floating.textContent = `+${amount}`;
        floating.classList.add('show');
        
        // Позиционирование (если передан тач-ивент)
        if (x && y && this.elements.tapArea) {
            const rect = this.elements.tapArea.getBoundingClientRect();
            floating.style.left = (x - rect.left) + 'px';
            floating.style.top = (y - rect.top) + 'px';
        }
        
        // Скрываем через время
        const timeout = setTimeout(() => {
            floating.classList.remove('show');
        }, CONFIG.FLOATING_SCORE_DURATION);
        
        this.animationTimeouts.push(timeout);
    }
    
    // Анимация дракона при тапе
    animateDragonTap() {
        const dragon = this.elements.dragonSprite;
        if (!dragon) return;
        
        dragon.style.transform = 'scale(1.15)';
        setTimeout(() => {
            dragon.style.transform = 'scale(1)';
        }, CONFIG.TAP_ANIMATION_DURATION);
    }
    
    // Показать уведомление об ошибке/предупреждении
    showLowEnergyWarning() {
        const tg = window.Telegram?.WebApp;
        if (tg?.showPopup) {
            tg.showPopup({
                title: '😴 Усталость',
                message: 'Дракон устал! Посмотри рекламу или подожди восстановления энергии.',
                buttons: [{ type: 'ok' }]
            });
        } else {
            alert('😴 Дракон устал! Энергия на нуле.');
        }
    }
    
    // Очистка таймаутов
    destroy() {
        this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.animationTimeouts = [];
    }
}

// Глобальный экземпляр (создаётся в app.js)
let ui;
