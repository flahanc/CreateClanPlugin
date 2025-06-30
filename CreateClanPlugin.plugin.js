/**
 * @name CreateClanPlugin
 * @source https://github.com/flahanc/CreateClanPlugin
 * @description Displays a button for clans next to the add friend button.
 * @updateUrl https://raw.githubusercontent.com/flahanc/CreateClanPlugin/refs/heads/main/CallTimeCounter.plugin.js
 * @website https://github.com/flahanc/CreateClanPlugin
 * @version 1.0.0
 */

const config = {
    info: {
        name: "CreateClanPlugin",
        authors: [
            {
                name: "flahanc",
                github_username: "flahanc"
            }
        ],
        version: "1.0.0",
        description: "Displays a button for clans next to the add friend button. Система кланов с GitHub базой данных.",
        github: "https://github.com/flahanc/CreateClanPlugin",
        github_raw: "https://raw.githubusercontent.com/flahanc/CreateClanPlugin/main/CreateClanPlugin.plugin.js"
    },
    github: {
        owner: "flahanc",
        repo: "CreateClanPlugin",
        branch: "main",
        dataFile: "clans-data.json",
        token: null // Будет установлен пользователем
    }
};

module.exports = class CreateClanPlugin {
    constructor() {
        this.clans = {};
        this.githubToken = BdApi.Data.load("CreateClanPlugin", "githubToken") || "";
        this.loadClansFromGitHub();
    }

    getName() { return config.info.name; }
    getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
    getDescription() { return config.info.description; }
    getVersion() { return config.info.version; }

    start() {
        this.injectClanButton();
        this.checkGitHubToken();
    }

    stop() {
        this.removeClanButton();
    }

    // Проверка GitHub токена
    checkGitHubToken() {
        if (!this.githubToken) {
            BdApi.showConfirmationModal(
                "GitHub Token Required",
                BdApi.React.createElement("div", {},
                    BdApi.React.createElement("p", {}, "Для работы с GitHub базой данных нужен Personal Access Token."),
                    BdApi.React.createElement("p", {}, "1. Перейдите на https://github.com/settings/tokens"),
                    BdApi.React.createElement("p", {}, "2. Создайте новый токен с правами 'repo'"),
                    BdApi.React.createElement("p", {}, "3. Вставьте токен ниже:"),
                    BdApi.React.createElement("input", {
                        type: "password",
                        placeholder: "GitHub Personal Access Token",
                        id: "github-token-input",
                        style: { width: "100%", marginBottom: "8px" }
                    })
                ),
                {
                    confirmText: "Сохранить",
                    cancelText: "Позже",
                    onConfirm: () => this.saveGitHubToken()
                }
            );
        }
    }

    saveGitHubToken() {
        const input = document.getElementById("github-token-input");
        if (input && input.value.trim()) {
            this.githubToken = input.value.trim();
            BdApi.Data.save("CreateClanPlugin", "githubToken", this.githubToken);
            BdApi.showToast("GitHub токен сохранен!", {type: "success"});
            this.loadClansFromGitHub();
        }
    }

    // Загрузка кланов из GitHub
    async loadClansFromGitHub() {
        if (!this.githubToken) return;

        try {
            const response = await fetch(
                `https://api.github.com/repos/${config.github.owner}/${config.github.repo}/contents/${config.github.dataFile}`,
                {
                    headers: {
                        'Authorization': `token ${this.githubToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                const content = atob(data.content);
                this.clans = JSON.parse(content);
                BdApi.showToast("Кланы загружены из GitHub!", {type: "success"});
            } else if (response.status === 404) {
                // Файл не существует, создаем пустой
                this.clans = {};
                await this.saveClansToGitHub();
            }
        } catch (error) {
            console.error("Ошибка загрузки кланов:", error);
            BdApi.showToast("Ошибка загрузки кланов из GitHub", {type: "error"});
        }
    }

    // Сохранение кланов в GitHub
    async saveClansToGitHub() {
        if (!this.githubToken) {
            BdApi.showToast("GitHub токен не настроен", {type: "error"});
            return;
        }

        try {
            // Сначала получаем текущий файл для получения SHA
            const getResponse = await fetch(
                `https://api.github.com/repos/${config.github.owner}/${config.github.repo}/contents/${config.github.dataFile}`,
                {
                    headers: {
                        'Authorization': `token ${this.githubToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            let sha = null;
            if (getResponse.ok) {
                const data = await getResponse.json();
                sha = data.sha;
            }

            // Создаем или обновляем файл
            const content = btoa(JSON.stringify(this.clans, null, 2));
            const body = {
                message: `Update clans data - ${new Date().toISOString()}`,
                content: content,
                branch: config.github.branch
            };

            if (sha) {
                body.sha = sha;
            }

            const response = await fetch(
                `https://api.github.com/repos/${config.github.owner}/${config.github.repo}/contents/${config.github.dataFile}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.githubToken}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );

            if (response.ok) {
                BdApi.showToast("Кланы сохранены в GitHub!", {type: "success"});
            } else {
                const error = await response.json();
                BdApi.showToast(`Ошибка сохранения: ${error.message}`, {type: "error"});
            }
        } catch (error) {
            console.error("Ошибка сохранения кланов:", error);
            BdApi.showToast("Ошибка сохранения кланов в GitHub", {type: "error"});
        }
    }

    injectClanButton() {
        const UserPanel = BdApi.findModuleByProps("UserPanel");
        if (!UserPanel) return;
        const origRender = UserPanel.UserPanel.prototype.render;
        const plugin = this;
        UserPanel.UserPanel.prototype.render = function() {
            const res = origRender.apply(this, arguments);
            try {
                if (res && res.props && res.props.children && Array.isArray(res.props.children)) {
                    res.props.children.splice(1, 0, plugin.renderClanButton());
                }
            } catch (e) {}
            return res;
        };
    }

    removeClanButton() {
        const UserPanel = BdApi.findModuleByProps("UserPanel");
        if (!UserPanel) return;
        if (UserPanel.UserPanel.prototype.render.__original) {
            UserPanel.UserPanel.prototype.render = UserPanel.UserPanel.prototype.render.__original;
        }
    }

    renderClanButton() {
        return BdApi.React.createElement("button", {
            style: {
                marginLeft: "8px",
                padding: "6px 12px",
                background: "#5865F2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
            },
            onClick: () => this.openClanModal()
        }, "Кланы");
    }

    openClanModal() {
        const React = BdApi.React;
        const Modal = BdApi.findModuleByProps("ModalRoot");
        if (!Modal) return;

        BdApi.showConfirmationModal(
            "Управление кланами (GitHub)",
            React.createElement("div", {},
                React.createElement("div", { style: { marginBottom: "16px" } },
                    React.createElement("button", {
                        onClick: () => this.loadClansFromGitHub(),
                        style: { marginRight: "8px", background: "#43b581", color: "white", border: "none", borderRadius: "4px", padding: "6px 12px", cursor: "pointer" }
                    }, "🔄 Обновить"),
                    React.createElement("button", {
                        onClick: () => this.checkGitHubToken(),
                        style: { background: "#faa61a", color: "white", border: "none", borderRadius: "4px", padding: "6px 12px", cursor: "pointer" }
                    }, "⚙️ Настройки")
                ),
                React.createElement("h3", {}, "Ваши кланы"),
                ...Object.keys(this.clans).map(clanName =>
                    React.createElement("div", { key: clanName, style: { marginBottom: "12px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" } },
                        React.createElement("b", {}, clanName),
                        React.createElement("span", {}, ` (${this.clans[clanName].members.length} участников)`),
                        React.createElement("div", { style: { marginTop: "8px" } },
                            React.createElement("button", {
                                style: { marginRight: "8px", background: "#5865f2", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" },
                                onClick: () => this.addMemberToClanPrompt(clanName)
                            }, "➕ Добавить участника"),
                            React.createElement("button", {
                                style: { marginRight: "8px", background: "#ed4245", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" },
                                onClick: () => this.deleteClan(clanName)
                            }, "🗑️ Удалить клан")
                        )
                    )
                ),
                React.createElement("hr", {}),
                React.createElement("h4", {}, "Создать новый клан"),
                React.createElement("input", {
                    type: "text",
                    placeholder: "Название клана",
                    id: "clan-create-name",
                    style: { width: "100%", marginBottom: "8px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd" }
                }),
                React.createElement("textarea", {
                    placeholder: "Описание клана (необязательно)",
                    id: "clan-create-description",
                    style: { width: "100%", marginBottom: "8px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd", height: "60px", resize: "vertical" }
                }),
                React.createElement("button", {
                    onClick: () => this.createClan(),
                    style: { width: "100%", background: "#43b581", color: "white", border: "none", borderRadius: "4px", padding: "8px", cursor: "pointer" }
                }, "Создать клан")
            ),
            {
                confirmText: "Закрыть",
                cancelText: null,
                onConfirm: () => {}
            }
        );
    }

    async createClan() {
        const nameInput = document.getElementById("clan-create-name");
        const descInput = document.getElementById("clan-create-description");
        
        if (!nameInput) return;
        const name = nameInput.value.trim();
        const description = descInput ? descInput.value.trim() : "";

        if (!name) {
            BdApi.showToast("Введите название клана", {type: "error"});
            return;
        }
        if (this.clans[name]) {
            BdApi.showToast("Клан с таким названием уже существует", {type: "error"});
            return;
        }

        const currentUser = BdApi.findModuleByProps("getCurrentUser").getCurrentUser();
        this.clans[name] = {
            name: name,
            description: description,
            leader: currentUser.id,
            members: [currentUser.id],
            createdAt: new Date().toISOString(),
            level: 1,
            experience: 0
        };

        await this.saveClansToGitHub();
        BdApi.showToast(`Клан '${name}' создан и сохранен в GitHub!`, {type: "success"});
        this.openClanModal();
    }

    addMemberToClanPrompt(clanName) {
        BdApi.showConfirmationModal(
            `Добавить участника в '${clanName}'`,
            BdApi.React.createElement("div", {},
                BdApi.React.createElement("input", {
                    type: "text",
                    placeholder: "ID пользователя Discord",
                    id: "clan-add-member-id",
                    style: { width: "100%", marginBottom: "8px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd" }
                }),
                BdApi.React.createElement("p", { style: { fontSize: "12px", color: "#666" } }, 
                    "Чтобы получить ID пользователя, включите режим разработчика в Discord и нажмите правой кнопкой на пользователя → 'Копировать ID'"
                )
            ),
            {
                confirmText: "Добавить",
                cancelText: "Отмена",
                onConfirm: () => this.addMemberToClan(clanName)
            }
        );
    }

    async addMemberToClan(clanName) {
        const input = document.getElementById("clan-add-member-id");
        if (!input) return;
        const userId = input.value.trim();
        
        if (!userId) {
            BdApi.showToast("Введите ID пользователя", {type: "error"});
            return;
        }
        if (this.clans[clanName].members.includes(userId)) {
            BdApi.showToast("Пользователь уже в клане", {type: "error"});
            return;
        }

        this.clans[clanName].members.push(userId);
        await this.saveClansToGitHub();
        BdApi.showToast("Пользователь добавлен и сохранен в GitHub!", {type: "success"});
        this.openClanModal();
    }

    async deleteClan(clanName) {
        BdApi.showConfirmationModal(
            `Удалить клан '${clanName}'?`,
            BdApi.React.createElement("p", {}, "Это действие нельзя отменить. Все данные клана будут удалены."),
            {
                confirmText: "Удалить",
                cancelText: "Отмена",
                onConfirm: async () => {
                    delete this.clans[clanName];
                    await this.saveClansToGitHub();
                    BdApi.showToast(`Клан '${clanName}' удален из GitHub!`, {type: "success"});
                    this.openClanModal();
                }
            }
        );
    }
} 