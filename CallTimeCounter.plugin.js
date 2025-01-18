/**
 * @name CreateClanPlugin
 * @source https://github.com/flahanc/CreateClanPlugin
 * @description Displays a button for clans next to the add friend button.
 * @updateUrl https://raw.githubusercontent.com/flahanc/CreateClanPlugin/refs/heads/main/CallTimeCounter.plugin.js
 * @website https://github.com/flahanc/CreateClanPlugin
 * @version 1.0.0
 */

module.exports = class CreateClanPlugin {
    start() {
        this.addClanButton();
    }

    stop() {
        this.removeClanButton();
    }

    addClanButton() {
        const addButton = document.querySelector('.add-friend-button'); // Измените селектор на правильный

        if (addButton) {
            const clanButton = document.createElement('button');
            clanButton.innerText = 'Добавить в клан';
            clanButton.className = 'clan-button'; // Добавьте стиль по желанию

            addButton.parentNode.insertBefore(clanButton, addButton.nextSibling);

            clanButton.addEventListener('click', () => {
                // Логика для добавления в клан
                alert('Клан добавлен!');
            });
        }
    }

    removeClanButton() {
        const clanButton = document.querySelector('.clan-button');
        if (clanButton) {
            clanButton.remove();
        }
    }
};
