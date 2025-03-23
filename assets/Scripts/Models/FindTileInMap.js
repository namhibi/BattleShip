const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        spritePrefab: cc.Prefab,
    },

    onLoad() {
        this.node.on("mousedown", this.onMouseDown, this);
    },

    onMouseDown(event) {
        if (event.getButton() !== cc.Event.EventMouse.BUTTON_LEFT) return;
        this.mousePosition = event.getLocation();
        const object = {
            playerId: 0,
            position: this.mousePosition,
        };
        Emitter.instance.emit(EVENT_NAME.POSITION, object);
        event.stopPropagation();
    },
});
