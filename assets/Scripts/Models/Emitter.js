const Emitter = require("EventEmitter");
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        this.mousePos = cc.v2(0, 0);

        this.node.on("mousedown", this.onMouseDown, this);
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    },

    onMouseDown(event) {
        this.mousePos = event.getLocation();
        Emitter.instance.emit("takePosition", this.mousePos);
    },
});
