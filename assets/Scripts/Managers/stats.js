cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        cc.sys.localStorage.setItem("mainMusicVolume", 0.5);
        cc.sys.localStorage.setItem("soundsVolume", 0.5);
    },

    start() {},
});
