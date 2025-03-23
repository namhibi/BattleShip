const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        yourTurnPanel: cc.Node,
        xStartYourTurn: -1500,

        enemyTurnPanel: cc.Node,
        xStartEnemyTurn: 1500,

        circleLoading: cc.Node,

        loadingLabel: cc.Label,
    },

    onLoad() {
        this.circleLoading.parent.active = false;
        var _yourTurn = this.yourTurn.bind(this);
        var _enemyTurn = this.enemyTurn.bind(this);
        var _waitForEnemy = this.waitForEnemy.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.YOUR_TURN_PANEL, _yourTurn);
        Emitter.instance.registerEvent(EVENT_NAME.ENEMY_TURN_PANEL, _enemyTurn);
        Emitter.instance.registerEvent(
            EVENT_NAME.WAIT_FOR_ENEMY,
            _waitForEnemy
        );
    },

    start() {
        this.resetPosition();
    },

    resetPosition() {
        this.yourTurnPanel.x = this.xStartYourTurn;
        this.enemyTurnPanel.x = this.xStartEnemyTurn;

        this.yourTurnPanel.active = false;
        this.enemyTurnPanel.active = false;
    },

    yourTurn() {
        this.yourTurnPanel.active = true;
        var action = cc.sequence(
            cc.moveTo(0.5, -20, 0),
            cc.moveTo(1, 20, 0),
            cc.moveTo(0.5, 1500, 0),
            cc.callFunc(() => {
                this.resetPosition();
                Emitter.instance.emit(EVENT_NAME.YOUR_TURN_PANEL_DONE);
            })
        );
        this.yourTurnPanel.runAction(action);
    },

    enemyTurn() {
        this.enemyTurnPanel.active = true;
        var action = cc.sequence(
            cc.moveTo(0.5, 20, 0),
            cc.moveTo(1, -20, 0),
            cc.moveTo(0.5, -1500, 0),
            cc.callFunc(() => {
                this.resetPosition();
                Emitter.instance.emit(EVENT_NAME.ENEMY_TURN_PANEL_DONE);
            })
        );
        this.enemyTurnPanel.runAction(action);
    },

    waitForEnemy() {
        this.circleLoading.parent.active = true;
        var action = cc.sequence(
            cc.spawn(
                cc.rotateTo(3, 180),
                cc.callFunc(() => {
                    this.loadingLabel.string = "WAITING ENEMY";
                    Emitter.instance.emit(EVENT_NAME.SOUND_LOADING);
                })
            ),
            cc.spawn(
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.loadingLabel.string = "START";
                })
            ),
            cc.callFunc(() => {
                this.circleLoading.rotation = 0;
                this.circleLoading.parent.active = false;

                Emitter.instance.emit(EVENT_NAME.WAIT_FOR_ENEMY_DONE);
            })
        );
        this.circleLoading.runAction(action);
    },
});
