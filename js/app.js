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
    
    // Проверка наличия всех необходимых элементов
    function checkElements() {
        const elements = [
            'tapArea', 'watchAdBtn', 'connectWalletBtn', 
            'headerCoins', 'headerEnergy', 'dragonSprite'
        ];
        let allFound = true;
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (!el) {
                console.error(`❌ Элемент #${id} не найден!`);
                allFound = false;
            }
        });
        return allFound;
    }
    
    if (!checkElements()) {
        console.error('❌ Не все элементы найдены. Проверьте index.html');
        alert('Ошибка загрузки интерфейса. Откройте консоль (F12)');
        return;
    }
    
    // Инициализация UI
    console.log('📱 Инициализация UI...');
    window.ui = new UIController();
    
    // Инициализация Game
    console.log('🎮 Инициализация Game...');
    window.game = new Game(window.ui);
    
    // Привязка событий с проверкой
    const tapArea = document.getElementById('tapArea');
    const watchAdBtn = document.getElementById('watchAdBtn');
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const copyRefBtn = document.getElementById('copyRefBtn');
    
    if (tapArea) {
        tapArea.addEventListener('click', (e) => {
            console.log('🖱️ Тап по яйцу');
            game.handleTap();
        });
        tapArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            console.log('👆 Тач по яйцу');
            game.handleTap();
        }, { passive: false });
        console.log('✅ Обработчик тапов привязан');
    }
    
    if (watchAdBtn) {
        watchAdBtn.addEventListener('click', () => {
            console.log('📺 Кнопка рекламы нажата');
            game.watchAd();
        });
        console.log('✅ Обработчик рекламы привязан');
    }
    
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', () => {
            console.log('💎 Кнопка TON нажата');
            game.connectWallet();
        });
        console.log('✅ Обработчик TON привязан');
    }
    
    if (copyRefBtn) {
        copyRefBtn.addEventListener('click', () => {
            const refText = document.getElementById('refLink')?.textContent || '';
            navigator.clipboard?.writeText(refText).then(() => {
                console.log('📋 Ссылка скопирована');
                if (tg?.showPopup) {
                    tg.showPopup({ message: '✅ Ссылка скопирована!' });
                } else {
                    alert('✅ Ссылка скопирована!');
                }
            }).catch(err => {
                console.error('❌ Ошибка копирования:', err);
            });
        });
        console.log('✅ Обработчик копирования привязан');
    }
    
    // Регенерация энергии
    setInterval(() => {
        if (window.game) {
            game.regenerate();
        }
    }, CONFIG.ENERGY_REGEN_INTERVAL);
    console.log('🔄 Регенерация энергии запущена (интервал ' + CONFIG.ENERGY_REGEN_INTERVAL + 'мс)');
    
    // Установка имени из Telegram
    if (tg?.initDataUnsafe?.user?.first_name) {
        const playerName = document.getElementById('playerName');
        if (playerName) {
            playerName.textContent = tg.initDataUnsafe.user.first_name;
        }
    }
    
    console.log('✅ DragonEgg успешно запущен!');
})();
