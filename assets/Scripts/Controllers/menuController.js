const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        mainMenu: cc.Node,
        mainMenuButton: cc.Node,

        setting: cc.Node,
        helpInfo: cc.Node,

        soundManager: cc.Node,

        musicSlider: cc.Slider,

        soundsSlider: cc.Slider,
    },

    onLoad() {},

    start() {
        this.mainMenu.active = false;
        this.setting.active = false;
        this.helpInfo.active = false;
        this._soundManager = this.soundManager.getComponent("soundManager");
        this.updateSlider();
    },
    update(dt) {},

    openMainMenu() {
        this.mainMenu.active = true;
        this.mainMenuButton.active = false;
        this.soundButton();
        cc.director.pause();
    },

    closeMainMenu() {
        this.mainMenu.active = false;
        this.mainMenuButton.active = true;
        this.soundButton();
        cc.director.resume();
    },

    openSetting() {
        this.setting.active = true;
        this.soundButton();
    },

    closeSetting() {
        this.setting.active = false;
        this.soundButton();
    },

    openHelpInfo() {
        this.helpInfo.active = true;
        this.soundButton();
    },

    closeHelpInfo() {
        this.helpInfo.active = false;
        this.soundButton();
    },

    newGame() {
        cc.director.resume();
        this.closeMainMenu();
        cc.director.loadScene("mainScene");
    },

    soundButton() {
        this._soundManager.click();
    },

    changeMusicVolume() {
        this._soundManager.changeMusicVolume(this.musicSlider.progress);
        this.musicSlider.node
            .getChildByName("Music ProgressBar")
            .getComponent(cc.ProgressBar).progress = this.musicSlider.progress;
    },

    changeSoundsVolume() {
        this._soundManager.changeSoundsVolume(this.soundsSlider.progress);
        this.soundsSlider.node
            .getChildByName("Sound ProgressBar")
            .getComponent(cc.ProgressBar).progress = this.soundsSlider.progress;
    },

    updateSlider() {
        this.musicSlider.progress =
            cc.sys.localStorage.getItem("mainMusicVolume");
        this.soundsSlider.progress =
            cc.sys.localStorage.getItem("soundsVolume");
        this.changeMusicVolume();
        this.changeSoundsVolume();
    },
});
