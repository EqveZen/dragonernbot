// ===== Главный файл приложения =====

(function() {
    'use strict';
    
    console.log('🐉 DragonEgg: Запуск приложения...');
    
    // Telegram
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand();
        tg.ready();
        console.log('✅ Telegram WebApp готов');
    } else {
        console.warn('⚠️ Не в Telegram (режим браузера)');
    }
    
    // Глобальные переменные модуля
    let ui = null;
    let game = null;
    let regenTimerId = null;
    
    // ===== Функция запуска регенерации =====
    function startEnergyRegeneration() {
        // Очищаем старый таймер если есть
        if (regenTimerId) {
            clearInterval(regenTimerId);
            regenTimerId = null;
        }
        
        // Запускаем новый ТОЛЬКО если game существует
        if (!game) {
            console.error('❌ Не могу запустить регенерацию: game не создан');
            return;
        }
        
        regenTimerId = setInterval(function() {
            // Двойная проверка при каждом тике
            if (game && typeof game.regenerate === 'function') {
                game.regenerate();
            } else {
                console.warn('⚠️ game.regenerate недоступен, останавливаю таймер');
                if (regenTimerId) {
                    clearInterval(regenTimerId);
                    regenTimerId = null;
                }
            }
        }, CONFIG.ENERGY_REGEN_INTERVAL);
        
        console.log('🔄 Регенерация запущена, интервал: ' + CONFIG.ENERGY_REGEN_INTERVAL + 'мс');
    }
    
    // ===== Привязка событий интерфейса =====
    function bindEvents() {
        console.log('🔗 Привязка событий...');
        
        // Тап по яйцу
        const tapArea = document.getElementById('tapArea');
        if (tapArea) {
            // Снимаем старые обработчики
            const newTapArea = tapArea.cloneNode(true);
            tapArea.parentNode.replaceChild(newTapArea, tapArea);
            
            function handleTapEvent(e) {
                if (e.type === 'touchstart') e.preventDefault();
                console.log('👆 Тап');
                if (game) {
                    game.handleTap();
                } else {
                    console.error('❌ game не существует!');
                }
            }
            
            newTapArea.addEventListener('click', handleTapEvent);
            newTapArea.addEventListener('touchstart', handleTapEvent, { passive: false });
            console.log('✅ Тап привязан');
        }
        
        // Кнопка рекламы
        const adBtn = document.getElementById('watchAdBtn');
        if (adBtn) {
            adBtn.addEventListener('click', function() {
                if (game) game.watchAd();
            });
        }
        
        // Кнопка TON
        const walletBtn = document.getElementById('connectWalletBtn');
        if (walletBtn) {
            walletBtn.addEventListener('click', function() {
                if (game) game.connectWallet();
            });
        }
        
        // Копирование реф. ссылки
        const copyBtn = document.getElementById('copyRefBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                const linkEl = document.getElementById('refLink');
                if (linkEl) {
                    const text = linkEl.textContent;
                    navigator.clipboard?.writeText(text).then(function() {
                        alert('✅ Ссылка скопирована!');
                    }).catch(function() {
                        alert('❌ Скопируйте вручную:\n' + text);
                    });
                }
            });
        }
        
        // Нижняя навигация
        document.querySelectorAll('.nav-item').forEach(function(item) {
            item.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                if (ui && typeof ui.switchTab === 'function') {
                    ui.switchTab(tabId);
                }
            });
        });
        
        console.log('✅ Все события привязаны');
    }
    
    // ===== Инициализация приложения =====
    function initApp() {
        console.log('🚀 Инициализация...');
        
        // Проверяем наличие классов
        if (typeof UIController === 'undefined') {
            console.error('❌ UIController не найден!');
            return;
        }
        if (typeof Game === 'undefined') {
            console.error('❌ Game не найден!');
            return;
        }
        
        // Создаём UI
        ui = new UIController();
        console.log('✅ UI создан');
        
        // Создаём Game (внутри конструктора вызывается load и updateAllUI)
        game = new Game(ui);
        console.log('✅ Game создан, данные загружены');
        
        // Сохраняем в window для отладки
        window.ui = ui;
        window.game = game;
        
        // Привязываем события
        bindEvents();
        
        // Запускаем регенерацию ТОЛЬКО ПОСЛЕ создания game
        startEnergyRegeneration();
        
        // Имя из Telegram
        if (tg?.initDataUnsafe?.user?.first_name) {
            const nameEl = document.getElementById('playerName');
            if (nameEl) nameEl.textContent = tg.initDataUnsafe.user.first_name;
        }
        
        // Реферальная ссылка
        const refLink = document.getElementById('refLink');
        if (refLink) {
            const userId = tg?.initDataUnsafe?.user?.id || 'guest';
            refLink.textContent = 'https://t.me/dragonern_bot?start=' + userId;
        }
        
        console.log('🎉 DragonEgg готов к игре!');
    }
    
    // ===== Очистка при закрытии =====
    function cleanup() {
        if (regenTimerId) {
            clearInterval(regenTimerId);
            regenTimerId = null;
        }
        if (game && typeof game.save === 'function') {
            game.save();
        }
    }
    
    // ===== Запуск =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        // Небольшая задержка для надёжности
        setTimeout(initApp, 20);
    }
    
    window.addEventListener('beforeunload', cleanup);
    
})();
