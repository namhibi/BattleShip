const Emitter = require("EventEmitter");
var StateMachine = require("javascript-state-machine");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {},

    onEnable() {
        let spine = this.node.getComponent(sp.Skeleton);
        spine.clearTracks();
        spine.setAnimation(0, "Idle", true);
    },

    onLoad() {
        Emitter.instance.registerEvent(
            EVENT_NAME.IS_SHOOT_SHIP,
            this.handleState.bind(this)
        );
        Emitter.instance.registerEvent(
            EVENT_NAME.CHANGE_SCENE_CLOCK,
            this.handleState.bind(this)
        );
        Emitter.instance.registerEvent(
            EVENT_NAME.SHIP_FAIL,
            this.changeStateShipFail.bind(this)
        );

        this.onAttack();
    },

    clockOverTime() {
        let talkString = this.node.children[0].children[0].getComponent(
            cc.Label
        );
        let arrayTalking = {
            CB: "BOY IS OVER TIME",
            YT: "YOURS TURN HAS FINISHED",
        };
        cc.tween(talkString.node)
            .call(() => {
                talkString.string = arrayTalking.CB;
            })
            .delay(1)
            .call(() => {
                talkString.string = arrayTalking.YT;
            })
            .delay(1)
            .call(() => {
                Emitter.instance.emit(EVENT_NAME.CHANGE_SCENE, true);
            })
            .call(() => {
                this.onAttack();
            })
            .start();
    },

    onAttack() {
        let talkString = this.node.children[0].children[0].getComponent(
            cc.Label
        );
        talkString.string = "SHOOTING SHIP ENEMY";
    },

    onFinal() {
        let talkString = this.node.children[0].children[0].getComponent(
            cc.Label
        );
        let arrayTalking = {
            CB: "CHICKEN BOYS",
            YT: "YOURS TURN HAS FINISHED",
        };
        cc.tween(talkString.node)
            .call(() => {
                talkString.string = arrayTalking.CB;
            })
            .delay(1)
            .call(() => {
                talkString.string = arrayTalking.YT;
            })
            .delay(1)
            .call(() => {
                Emitter.instance.emit(EVENT_NAME.CHANGE_SCENE, true);
            })
            .call(() => {
                this.onAttack();
            })
            .start();
    },

    onAttackToAttack() {
        let talkString = this.node.children[0].children[0].getComponent(
            cc.Label
        );
        let arrayTalking = {
            GB: "GOOD BOYS",
            HASHIT: "U HAS HIT ENEMY SHIP",
            SA: "SHOOT AGAIN",
        };
        cc.tween(talkString.node)
            .call(() => {
                talkString.string = arrayTalking.GB;
            })
            .delay(1)
            .call(() => {
                talkString.string = arrayTalking.HASHIT;
            })
            .delay(1)
            .call(() => {
                talkString.string = arrayTalking.SA;
                Emitter.instance.emit(EVENT_NAME.RESET_TURN);
            })
            .start();
    },

    onShipFail() {
        cc.log("pirate taking");
        Emitter.instance.emit(EVENT_NAME.PLAY_ANI_SHIP_FAIL);
        Emitter.instance.registerOnce(EVENT_NAME.DONE_CLIP_SHIP_FAIL, () => {
            let talkString = this.node.children[0].children[0].getComponent(
                cc.Label
            );
            let arrayTalking = {
                GB: "GOOD BOYS",
                SB: "ENEMY SHIP HAS FAILED",
                GJ: "GOOD JOBS",
                SA: "SHOOT AGAIN",
            };
            cc.tween(talkString.node)
                .call(() => {
                    talkString.string = arrayTalking.GB;
                })
                .delay(1)
                .call(() => {
                    talkString.string = arrayTalking.SB;
                })
                .delay(2)
                .call(() => {
                    talkString.string = arrayTalking.GJ;
                })
                .delay(1)
                .call(() => {
                    talkString.string = arrayTalking.SA;
                    Emitter.instance.emit(EVENT_NAME.SHIP_FAIL_CHECK);
                })
                .start();
        });
    },

    changeStateShipFail() {
        this.onShipFail();
    },

    handleState(data) {
        cc.log("pre" + data);
        if (data === true) {
            this.onAttackToAttack();
        } else if (data === false) {
            this.onFinal();
        } else if (data === undefined) {
            cc.log("pirate final");
            this.clockOverTime();
        }
    },

    update() {},
});
