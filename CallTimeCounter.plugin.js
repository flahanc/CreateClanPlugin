/**
 * @name CreateClanPlugin
 * @source https://github.com/flahanc/CreateClanPlugin
 * @description Displays a button to create a clan next to the Add Friend button.
 * @updateUrl https://raw.githubusercontent.com/flahanc/CreateClanPlugin/refs/heads/main/CallTimeCounter.plugin.js
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
        description: "Displays a button to create a clan next to the Add Friend button.",
        github_raw: "https://raw.githubusercontent.com/flahanc/CreateClanPlugin/refs/heads/main/CallTimeCounter.plugin.js",
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
    const { React, UserStore } = DiscordModules;

    class CreateClanButton extends React.Component {
        handleClick = () => {
            BdApi.showToast("Создать клан", { type: "info" });
        };

        render() {
            return React.createElement("button", { 
                onClick: this.handleClick, 
                style: { 
                    margin: "5px", 
                    backgroundColor: "#7289da", 
                    color: "#ffffff", 
                    border: "none", 
                    borderRadius: "5px", 
                    padding: "5px 10px", 
                    cursor: "pointer" 
                } 
            }, "Создать клан");
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
            const MemberList = WebpackModules.getByProps("getMembers");
            const Avatar = WebpackModules.getByProps("Avatar");
            const AddFriendButton = WebpackModules.getByProps("AddFriendButton"); // Ensure you're getting the right button

            Patcher.after(MemberList, "getMembers", (_, __, ret) => {
                const members = ret || [];
                const currentUserId = UserStore.getCurrentUser ().id;

                return members.map(member => {
                    const isSelf = member.user.id === currentUserId;

                    return React.createElement("div", { key: member.user.id },
                        React.createElement(Avatar, { user: member.user }),
                        isSelf && React.createElement(CreateClanButton),
                        isSelf && React.createElement(AddFriendButton) // Add the Add Friend button
                    );
                });
            });
        }
    }

    return plugin;
})(global.ZeresPluginLibrary.buildPlugin(config));
