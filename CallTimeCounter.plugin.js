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
        console.log('CreateClanPlugin started');
        this.addClanButton();
    }

    stop() {
        this.removeClanButton();
        console.log('CreateClanPlugin stopped');
    }

    addClanButton() {
        const addButton = document.querySelector('.add-friend-button'); // Измените селектор на правильный
        console.log('Add button found:', addButton);

        if (addButton) {
            const clanButton = document.createElement('button');
            clanButton.innerText = 'Добавить в клан';
            clanButton.className = 'clan-button'; // Добавьте стиль по желанию

            addButton.parentNode.insertBefore(clanButton, addButton.nextSibling);
            console.log('Clan button added');

            clanButton.addEventListener('click', () => {
                alert('Клан добавлен!');
            });
        } else {
            console.log('Add button not found');
        }
    }

    removeClanButton() {
        const clanButton = document.querySelector('.clan-button');
        if (clanButton) {
            clanButton.remove();
            console.log('Clan button removed');
        }
    }
};
