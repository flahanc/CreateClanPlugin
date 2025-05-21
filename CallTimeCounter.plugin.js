/**
 * @name CreateClanPlugin
 * @source https://github.com/flahanc/CreateClanPlugin
 * @description Displays a button for clans next to the add friend button.
 * @updateUrl https://raw.githubusercontent.com/flahanc/CreateClanPlugin/refs/heads/main/CallTimeCounter.plugin.js
 * @website https://github.com/flahanc/CreateClanPlugin
 * @version 1.0.0
 */

module.exports = class ClanMenuPlugin {
    start() {
        console.log('ClanMenuPlugin started');
        this.addClanMenu();
    }

    stop() {
        this.removeClanMenu();
        console.log('ClanMenuPlugin stopped');
    }

    addClanMenu() {
        const menuContainer = document.querySelector('.menu-container'); // Измените селектор на правильный
        console.log('Menu container found:', menuContainer);

        if (menuContainer) {
            const clanMenu = document.createElement('div');
            clanMenu.innerHTML = 'Кланы';
            clanMenu.className = 'clan-menu'; // Добавьте стиль по желанию

            menuContainer.appendChild(clanMenu);
            console.log('Clan menu added');

            clanMenu.addEventListener('click', () => {
                alert('Кланы');
            });
        } else {
            console.log('Menu container not found');
        }
    }

    removeClanMenu() {
        const clanMenu = document.querySelector('.clan-menu');
        if (clanMenu) {
            clanMenu.remove();
            console.log('Clan menu removed');
        }
    }
};
