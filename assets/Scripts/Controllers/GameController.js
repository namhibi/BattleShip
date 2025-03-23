const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");
var StateMachine = require("javascript-state-machine");

cc.Class({
    extends: cc.Component,

    properties: {
        ballCannon: cc.Prefab,
        mapEnemy: cc.Node,
        mapPlayer: cc.Node,
        changeSceneNode: cc.Node,
        pirate: sp.Skeleton,
        clockPlayer: cc.Label,
        clockEnemy: cc.Label,
    },

    onLoad() {
        cc.log(Emitter);
        this.playerId = 0;
        this.enemyId = 1;
        this.shipPlayerCounter = 4;
        this.shipEnemyCounter = 4;
        this.oldPosition = this.mapPlayer.position;
        this.scalePositionMiniMap = cc.v2(540, 200);
        Emitter.instance.registerOnce("setEnemyId", (enemyId) => {
            this.enemyId = enemyId;
        });
        Emitter.instance.registerOnce(
            EVENT_NAME.START,
            this.setPlayerIdStartGame.bind(this)
        );
        Emitter.instance.registerEvent(
            EVENT_NAME.CHANGE_SCENE,
            this.changeScene.bind(this)
        );
        Emitter.instance.registerEvent(
            EVENT_NAME.SEND_RESULT,
            this.playAnimation.bind(this)
        );
        Emitter.instance.registerEvent(
            EVENT_NAME.RESET_TURN,
            this.restTurn.bind(this)
        );
        Emitter.instance.registerEvent(
            EVENT_NAME.SHIP_FAIL_CHECK,
            this.changeSceneShipFail.bind(this)
        );
        this.fsm = new StateMachine({
            init: "init",
            transitions: [
                {
                    name: "changePlayerScene",
                    from: [
                        "init",
                        "enemyScene",
                        "shipFailScene",
                        "playerScene",
                    ],
                    to: "playerScene",
                },
                {
                    name: "changeEnemyScene",
                    from: [
                        "init",
                        "playerScene",
                        "shipFailScene",
                        "enemyScene",
                    ],
                    to: "enemyScene",
                },
                {
                    name: "changeEndScene",
                    from: ["playerScene", "enemyScene", "shipFailScene"],
                    to: "endScene",
                },
                {
                    name: "changeShipFailScene",
                    from: ["playerScene", "enemyScene"],
                    to: "shipFailScene",
                },
            ],
            methods: {
                onChangePlayerScene: this.onChangePlayerScene.bind(this),
                onChangeEnemyScene: this.onChangeEnemyScene.bind(this),

                onEnterPlayerScene: this.onEnterplayerScene.bind(this),
                onEnterEnemyScene: this.onEnterenemyScene.bind(this),
                onChangeShipFailScene: this.changeSceneShipFail.bind(this),
            },
        });
    },

    setPlayerIdStartGame(data) {
        this.playerId = data;
        cc.log(this.playerId);
        this.pirate.node.active = false;
        this.mapPlayer.active = false;
        this.mapEnemy.active = false;
        Emitter.instance.emit(EVENT_NAME.WAIT_FOR_ENEMY);
        Emitter.instance.registerOnce(EVENT_NAME.WAIT_FOR_ENEMY_DONE, () => {
            this.fsm.changePlayerScene();
        });
    },

    onEnterplayerScene() {
        cc.log("hello");
        this.pirate.node.active = false;
        this.mapEnemy.active = false;
        this.mapPlayer.active = false;
        Emitter.instance.emit(EVENT_NAME.YOUR_TURN_PANEL);
        Emitter.instance.registerOnce(EVENT_NAME.YOUR_TURN_PANEL_DONE, () => {
            this.mapEnemy.active = true;
            this.mapPlayer.active = true;
            this.pirate.node.active = true;
            this.changeToMiniMap(this.mapPlayer);
            let childrenArray = this.mapPlayer.children;

            this.changeToRealMap(this.mapEnemy, false);
        });
    },

    onChangePlayerScene() {
        cc.log("chuyen player");
        Emitter.instance.registerOnce(EVENT_NAME.POSITION, (data) => {
            data.playerId = this.enemyId;
            let spine = this.pirate.node.getComponent(sp.Skeleton);
            spine.clearTracks();
            spine.setAnimation(0, "Attack_2", false);
            spine.addAnimation(0, "Idle", true);
            Emitter.instance.emit("checkTile", data);
        });
    },

    onEnterenemyScene() {
        this.pirate.node.active = false;
        this.mapEnemy.active = false;
        this.mapPlayer.active = false;
        Emitter.instance.emit(EVENT_NAME.ENEMY_TURN_PANEL);
        Emitter.instance.registerOnce(EVENT_NAME.ENEMY_TURN_PANEL_DONE, () => {
            this.changeToMiniMap(this.mapEnemy);
            this.mapPlayer.active = true;
            this.mapEnemy.active = true;
            this.pirate.node.active = true;
            this.changeToRealMap(this.mapPlayer, true);
        });
    },

    onChangeEnemyScene() {
        cc.log("chuyen enemy");
        Emitter.instance.registerOnce(EVENT_NAME.POSITION, (data) => {
            data.playerId = this.playerId;
            Emitter.instance.emit(EVENT_NAME.CHECK_POSITION, data);
            cc.log("playerId EnemyScene", data.playerId);
        });
        cc.tween(this.node)
            .call(() => {})
            .delay(3)
            .call(() => {
                Emitter.instance.emit(EVENT_NAME.CHOOSE_COORDINATES);
                let spine = this.pirate.node.getComponent(sp.Skeleton);
                spine.clearTracks();
                spine.setAnimation(0, "Attack_2", false);
                spine.addAnimation(0, "Idle", true);
            })
            .start();
    },

    playAnimation(data) {
        const currentScene = cc.director.getScene().children[0];
        let cannonBall = cc.instantiate(this.ballCannon);
        cannonBall.setParent(currentScene);
        cannonBall.position = cc.v2(3, -250);
        Emitter.instance.emit(EVENT_NAME.SOUND_CANON_SHOOT);
        Emitter.instance.emit("attackToPosition", data);
    },

    restTurn() {
        if (this.fsm.state === "playerScene") {
            this.fsm.changePlayerScene();
            cc.log("reset");
        }
        if (this.fsm.state === "enemyScene") {
            this.fsm.changeEnemyScene();
        }
    },

    changeScene(data) {
        cc.log("data trong change scene", data);

        let nowScene = this.fsm.state;
        if (nowScene === "playerScene" && data === true) {
            cc.log("đổi enemy");
            this.fsm.changeEnemyScene();
        } else if (nowScene === "enemyScene" && data === true) {
            cc.log("đổi player");
            this.fsm.changePlayerScene();
        }
    },

    changeSceneShipFail() {
        if (this.fsm.state === "playerScene") {
            this.shipEnemyCounter -= 1;
            if (this.shipEnemyCounter === 0) {
                this.onChangeEndScene(true);
            } else {
                this.fsm.changePlayerScene();
            }
        } else if (this.fsm.state === "enemyScene") {
            this.shipPlayerCounter -= 1;
            if (this.shipPlayerCounter === 0) {
                this.onChangeEndScene(false);
            } else {
                this.fsm.changeEnemyScene();
            }
        }
    },

    onChangeEndScene(data) {
        let win = true;
        if (win === data) {
            Emitter.instance.emit(EVENT_NAME.WIN);
        } else {
            Emitter.instance.emit(EVENT_NAME.LOSE);
        }
    },

    changeToMiniMap(map) {
        cc.log(map);
        map.scale = 0.4;
        map.position = this.scalePositionMiniMap;
        map.opacity = 200;
    },

    changeToRealMap(map, isShowShip) {
        map.scale = 1;
        map.position = this.oldPosition;
        map.opacity = 255;
        if (isShowShip === true) {
            let childrenArray = this.mapPlayer.children;
            childrenArray.forEach((e) => {
                if (e.name === "ship") {
                    e.active = true;
                }
            });
        }
    },
});
