const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {},

    sendResult(data) {
        const sendObject = {
            isHit: true,
            shipLength: 0,
            worldPosition: data.position,
        };
        Emitter.instance.emit(EVENT_NAME.SEND_RESULT, sendObject);
    },

    start() {},
});
