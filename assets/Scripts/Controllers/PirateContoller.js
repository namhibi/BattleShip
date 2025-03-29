const Emitter = require("EventEmitter");
var StateMachine = require("javascript-state-machine");
const EVENT_NAME = require("NAME_EVENT");
const MESSAGE = require("MessageData");

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
        Emitter.instance.registerEvent(
            EVENT_NAME.LOAD_CURRENT_STATE,
            this.onLoadGameStateState.bind(this)
        );
       this.messageCmp = this.node.children[0].children[0].getComponent(cc.Label);
       this.bubbleNode = this.node.children[0];
       this.node.active = false;
    },

    onLoadGameStateState(state){
        this.currentState = state;
        this.bubbleNode.scale = 0;
        this.messageCmp.string = "";
    },

    onOverTime() {
            let callbackAction = ()=>{
                Emitter.instance.emit(EVENT_NAME.CHANGE_SCENE, true);
            }
            this.loadMessage(MESSAGE[this.currentState].OVER_TIME,callbackAction);
    },

    onMissAttack() {
            let callbackAction = ()=>{
                Emitter.instance.emit(EVENT_NAME.CHANGE_SCENE, true);
            }
            this.loadMessage(MESSAGE[this.currentState].MISS_ATTACK,callbackAction);
    },

    onAttackToAttack() {
            let callbackAction = ()=>{
                Emitter.instance.emit(EVENT_NAME.RESET_TURN);
            }
            this.loadMessage(MESSAGE[this.currentState].ATTACK,callbackAction);
    },

    onShipFail() {
        cc.log("pirate taking");
        Emitter.instance.emit(EVENT_NAME.PLAY_ANI_SHIP_FAIL);
        Emitter.instance.registerOnce(EVENT_NAME.DONE_CLIP_SHIP_FAIL, () => {
                let callbackAction = ()=>{
                    Emitter.instance.emit(EVENT_NAME.SHIP_FAIL_CHECK);
                }
                this.loadMessage(MESSAGE[this.currentState].SHIP_FAIL,callbackAction);
        });
    },

    loadMessage(messageList, callback){
        this.bubbleNode.scale = 0;
        cc.tween(this.bubbleNode)
        .to(0.3,{scale:2.5})
        .start();
        this.tweenTalking && this.tweenTalking.stop();
        this.tweenTalking = cc.tween(this.messageCmp.node)
        for(let index = 0; index < messageList.length; index ++){
            this.tweenTalking
            .call(() => {
                this.messageCmp.string = messageList[index];
            })
            .delay(1)
        }
        this.tweenTalking
        .call(() => {
            callback && callback();
        })
        .start();
    },

    changeStateShipFail() {
        this.onShipFail();
    },

    handleState(data) {
        this.tweenTalking && this.tweenTalking.stop();
        cc.log("pre" + data);
        if (data === true) {
            this.onAttackToAttack();
        } else if (data === false) {
            this.onMissAttack();
        } else if (data === undefined) {
            cc.log("pirate final");
            this.onOverTime();
        }
    },

    update() {},
});
