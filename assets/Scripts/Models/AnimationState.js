const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        this.myanimation = this.node.getComponent(cc.Animation);
        this.myanimation.on("finished", this.onAnimationFinished, this);
    },

    onAnimationFinished() {
        Emitter.instance.emit(EVENT_NAME.DESTROY_ANI_NODE);
    },

    start() {},
});
