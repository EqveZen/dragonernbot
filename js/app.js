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
    
    // Ждём полной загрузки DOM
    function initApp() {
        console.log('📱 Инициализация UI...');
        window.ui = new UIController();
        
        console.log('🎮 Инициализация Game...');
        window.game = new Game(window.ui);
        
        // Привязка событий
        const tapArea = document.getElementById('tapArea');
        const watchAdBtn = document.getElementById('watchAdBtn');
        const connectWalletBtn = document.getElementById('connectWalletBtn');
        const copyRefBtn = document.getElementById('copyRefBtn');
        
        if (tapArea) {
            tapArea.addEventListener('click', (e) => {
                console.log('🖱️ Тап');
                game.handleTap();
            });
            tapArea.addEventListener('touchstart', (e) => {
                e.preventDefault();
                console.log('👆 Тач');
                game.handleTap();
            }, { passive: false });
            console.log('✅ Обработчик тапов привязан');
        } else {
            console.error('❌ Элемент #tapArea не найден!');
        }
        
        if (watchAdBtn) {
            watchAdBtn.addEventListener('click', () => game.watchAd());
            console.log('✅ Обработчик рекламы привязан');
        }
        
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', () => game.connectWallet());
            console.log('✅ Обработчик TON привязан');
        }
        
        if (copyRefBtn) {
            copyRefBtn.addEventListener('click', () => {
                const refLink = document.getElementById('refLink');
                if (refLink) {
                    navigator.clipboard?.writeText(refLink.textContent).then(() => {
                        alert('✅ Ссылка скопирована!');
                    }).catch(() => {
                        alert('❌ Не удалось скопировать');
                    });
                }
            });
        }
        
        // Регенерация энергии
        setInterval(() => {
            if (window.game) game.regenerate();
        }, CONFIG.ENERGY_REGEN_INTERVAL);
        console.log('🔄 Регенерация энергии запущена');
        
        // Установка имени из Telegram
        if (tg?.initDataUnsafe?.user?.first_name) {
            const playerName = document.getElementById('playerName');
            if (playerName) playerName.textContent = tg.initDataUnsafe.user.first_name;
        }
        
        console.log('✅ DragonEgg успешно запущен!');
    }
    
    // Запускаем, когда DOM готов
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
