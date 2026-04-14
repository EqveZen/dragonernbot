// ===== Главный файл приложения =====

(function() {
    'use strict';
    
    // Инициализация Telegram Web App
    const tg = window.Telegram.WebApp;
    
    // Настройка Telegram
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Применяем цвета темы (уже через CSS-переменные, 
    // но можно добавить дополнительные настройки)
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.add('light-theme');
    }
    
    // Инициализация UI
    window.ui = new UIController();
    
    // Инициализация игры
    window.game = new Game(window.ui);
    game.init();
    
    // Привязка событий
    const tapArea = document.getElementById('tapArea');
    const watchAdBtn = document.getElementById('watchAdBtn');
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    
    // Обработчик тапов
    if (tapArea) {
        tapArea.addEventListener('click', (e) => game.handleTap(e));
        tapArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            game.handleTap(e);
        }, { passive: false });
    }
    
    // Кнопка рекламы
    if (watchAdBtn) {
        watchAdBtn.addEventListener('click', () => game.watchAd());
    }
    
    // Кнопка TON
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', () => game.connectTON());
    }
    
    // Обработка закрытия/сворачивания
    window.addEventListener('beforeunload', () => {
        game.destroy();
        ui.destroy();
    });
    
    // Сообщаем Telegram, что приложение готово
    tg.ready();
    
    // Устанавливаем цвет верхней панели
    tg.setHeaderColor('bg_color');
    
    // Показываем кнопку "Назад" в интерфейсе Telegram (если нужно)
    // tg.BackButton.show();
    
    console.log('🐉 DragonEgg game initialized!');
})();
