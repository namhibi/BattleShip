const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        shipFailVideo: cc.Animation,
    },

    onLoad() {
        Emitter.instance.registerEvent(
            EVENT_NAME.PLAY_ANI_SHIP_FAIL,
            this.playClip.bind(this)
        );
        this.animation = this.shipFailVideo.node.getComponent(cc.Animation);
        this.animation.on("finished", this.onAnimationFinished, this);
    },

    playClip() {
        Emitter.instance.emit(EVENT_NAME.SOUND_SHIP_SANK);
        this.shipFailVideo.node.active = true;
        let myanimation = this.shipFailVideo.node.getComponent(cc.Animation);
        myanimation.play(myanimation.getClips()[0].name);
        cc.log("hello clip");
    },

    onAnimationFinished() {
        this.shipFailVideo.node.active = false;
        Emitter.instance.emit(EVENT_NAME.DONE_CLIP_SHIP_FAIL);
    },
});
