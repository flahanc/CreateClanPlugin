/**
 * @name CreateClanPlugin
 * @source https://github.com/YourUsername/CreateClanPlugin 
 * @description Displays a button to create a clan when you click on your own avatar.
 * @updateUrl https://github.com/flahanc/CreateClanPlugin/blob/main/CallTimeCounter.plugin.js
 * @website https://github.com/flahanc/CreateClanPlugin
 * @version 1.0.0
 */

const config = {
    info: {
        name: "CreateClanPlugin",
        authors: [
            {
                name: "YourName"
            }
        ],
        version: "1.0.0",
        description: "Displays a button to create a clan when you click on your own avatar.",
        github_raw: "https://raw.githubusercontent.com/YourUsername/CreateClanPlugin/main/CreateClanPlugin.plugin.js",
    },
    defaultConfig: []
};

module.exports = !global.ZeresPluginLibrary ? class {
    constructor() {
        this._config = config;
    }

    load() {
        BdApi.showConfirmationModal("Library plugin is needed",
            `The library plugin needed for CreateClanPlugin is missing. Please click Download Now to install it.`, {
            confirmText: "Download",
            cancelText: "Cancel",
            onConfirm: () => {
                require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", (error, response, body) => {
                    if (error)
                        return electron.shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");

                    require("fs").writeFileSync(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body);
                });
            }
        });
    }

    start() { }

    stop() { }
} : (([Plugin, Library]) => {
    const { DiscordModules, WebpackModules, Patcher } = Library;
    const { React, SelectedChannelStore } = DiscordModules;

    class CreateClanButton extends React.Component {
        handleClick = () => {
            BdApi.showToast("Создать клан", { type: "info" });
        };

        render() {
            return React.createElement("button", { onClick: this.handleClick, style: { margin: "5px" } }, "Создать клан");
        }
    }

    class plugin extends Plugin {
        constructor() {
            super();
        }

        onStart() {
            this.patch();
        }

        onStop() {
            Patcher.unpatchAll();
        }

        patch() {
            const MemberList = WebpackModules.getByProps("getMember");
            const UserStore = DiscordModules.UserStore;

            Patcher.after(MemberList, "getMember", (_, [guildId, userId], ret) => {
                // Получаем текущего пользователя
                const currentUser Id = UserStore.getCurrentUser ().id;

                // Проверяем, что кликнули на себя
                if (userId === currentUser Id) {
                    // Добавляем кнопку "Создать клан"
                    return [
                        ret,
                        React.createElement(CreateClanButton)
                    ];
                }
                return ret;
            });
        }
    }

    return plugin;
})(global.ZeresPluginLibrary.buildPlugin(config));
