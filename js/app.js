// ===== Главный файл приложения =====

(function() {
    'use strict';
    
    console.log('🐉 DragonEgg: Запуск приложения...');
    
    // Проверка Telegram
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand();
        tg.ready();
        console.log('✅ Telegram WebApp инициализирован');
    } else {
        console.warn('⚠️ Telegram WebApp не найден (работаем в браузере)');
    }
    
    // Переменные
    let regenInterval = null;
    let ui = null;
    let game = null;
    
    // Функция запуска регенерации
    function startRegeneration() {
        if (regenInterval) clearInterval(regenInterval);
        regenInterval = setInterval(() => {
            if (game && typeof game.regenerate === 'function') {
                game.regenerate();
            }
        }, CONFIG.ENERGY_REGEN_INTERVAL);
        console.log('🔄 Регенерация энергии запущена');
    }
    
    // Функция инициализации
    function initApp() {
        console.log('📱 Создание UI...');
        
        // Проверяем, что класс UIController существует
        if (typeof UIController === 'undefined') {
            console.error('❌ UIController не найден! Проверьте подключение ui.js');
            return;
        }
        
        ui = new UIController();
        console.log('✅ UI создан');
        
        // Проверяем, что класс Game существует
        if (typeof Game === 'undefined') {
            console.error('❌ Game не найден! Проверьте подключение game.js');
            return;
        }
        
        console.log('🎮 Создание Game...');
        game = new Game(ui);
        console.log('✅ Game создан');
        
        // Сохраняем в window для доступа из консоли (для отладки)
        window.ui = ui;
        window.game = game;
        
        // Теперь привязываем события
        bindEvents();
        
        // Запускаем регенерацию
        startRegeneration();
        
        // Установка имени из Telegram
        if (tg?.initDataUnsafe?.user?.first_name) {
            const playerName = document.getElementById('playerName');
            if (playerName) playerName.textContent = tg.initDataUnsafe.user.first_name;
        }
        
        // Установка реферальной ссылки
        const refLink = document.getElementById('refLink');
        if (refLink) {
            const userId = tg?.initDataUnsafe?.user?.id || 'guest';
            refLink.textContent = `https://t.me/dragonern_bot?start=${userId}`;
        }
        
        console.log('✅ DragonEgg успешно запущен!');
    }
    
    // Привязка всех событий
    function bindEvents() {
        const tapArea = document.getElementById('tapArea');
        const watchAdBtn = document.getElementById('watchAdBtn');
        const connectWalletBtn = document.getElementById('connectWalletBtn');
        const copyRefBtn = document.getElementById('copyRefBtn');
        
        // Тап по яйцу
        if (tapArea) {
            // Удаляем старые обработчики (на всякий случай)
            const newTap = tapArea.cloneNode(true);
            tapArea.parentNode.replaceChild(newTap, tapArea);
            
            newTap.addEventListener('click', () => {
                console.log('🖱️ Тап');
                if (game) game.handleTap();
            });
            newTap.addEventListener('touchstart', (e) => {
                e.preventDefault();
                console.log('👆 Тач');
                if (game) game.handleTap();
            }, { passive: false });
            
            console.log('✅ Обработчик тапов привязан');
        } else {
            console.error('❌ #tapArea не найден');
        }
        
        // Реклама
        if (watchAdBtn) {
            watchAdBtn.addEventListener('click', () => {
                console.log('📺 Реклама');
                if (game) game.watchAd();
            });
        }
        
        // TON кошелёк
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', () => {
                console.log('💎 TON');
                if (game) game.connectWallet();
            });
        }
        
        // Копирование реферальной ссылки
        if (copyRefBtn) {
            copyRefBtn.addEventListener('click', () => {
                const link = document.getElementById('refLink');
                if (link) {
                    const text = link.textContent;
                    navigator.clipboard?.writeText(text).then(() => {
                        alert('✅ Ссылка скопирована!');
                    }).catch(() => {
                        alert('❌ Скопируйте вручную:\n' + text);
                    });
                }
            });
        }
        
        // Навигация по табам
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.dataset.tab;
                if (ui && typeof ui.switchTab === 'function') {
                    ui.switchTab(tabId);
                }
            });
        });
    }
    
    // Ждём загрузку DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        // Если DOM уже загружен, даём небольшую задержку для уверенности
        setTimeout(initApp, 10);
    }
    
    // Очистка при закрытии
    window.addEventListener('beforeunload', () => {
        if (regenInterval) {
            clearInterval(regenInterval);
            regenInterval = null;
        }
        if (game && typeof game.save === 'function') {
            game.save();
        }
    });
    
})();
