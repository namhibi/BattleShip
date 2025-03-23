const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        player: cc.Node,
    },

    onLoad() {
        this.position = {
            x: 0,
            y: 0,
        };
    },

    start() {},

    test() {
        Emitter.instance.emit("checkposition", {
            playerId: this.player.getComponent("PlayerController").playerId,
            position: this.position,
        });
    },
});
