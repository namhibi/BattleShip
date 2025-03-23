const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        Emitter.instance = new Emitter();
    },
});
