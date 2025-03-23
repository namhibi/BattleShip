const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        winPanel: cc.Node,

        losePanel: cc.Node,

        loadingScene: cc.Node,

        loadingWaves: cc.Node,

        yEnd: 280,
    },

    onLoad() {
        var _openWinPanel = this.openWinPanel.bind(this);
        var _openLosePanel = this.openLosePanel.bind(this);

        Emitter.instance.registerEvent(EVENT_NAME.WIN, _openWinPanel);
        Emitter.instance.registerEvent(EVENT_NAME.LOSE, _openLosePanel);
    },

    start() {
        this.winPanel.active = false;

        this.losePanel.active = false;

        this.loadingScene.active = false;
    },

    openWinPanel() {
        this.winPanel.active = true;
        this.scheduleOnce(function () {
            this.loading();
        }, 5);
    
    },

    openLosePanel() {
        this.losePanel.active = true;
        this.scheduleOnce(function () {
            this.loading();
        }, 5);
    },

    restart() {
        cc.director.loadScene("logInScene");
    },

    loading() {
        this.loadingScene.active = true;

        cc.tween(this.loadingWaves)
            .to(5.2, { y: this.yEnd })
            .call(() => {
                this.restart();
            })
            .start();
    },
});
