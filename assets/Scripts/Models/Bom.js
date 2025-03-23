const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        bomSprite: cc.SpriteFrame,
    },

    onLoad() {
        Emitter.instance.registerOnce(
            "attackToPosition",
            this.onAttack.bind(this)
        );
    },

    start() {
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on("finished", this.onAnimationFinished, this);
    },

    onAnimationFinished(data) {
        this.node.getComponent(cc.Sprite).spriteFrame = this.bomSprite;
    },

    onAttack(data) {
        cc.tween(this.node)
            .delay(0.94)
            .parallel(
                cc.tween().to(2, {
                    position: this.node.parent.convertToNodeSpaceAR(
                        data.worldPosition
                    ),
                }),
                cc
                    .tween()
                    .to(0.75, { scale: 2 }, { easing: "sineOut" })
                    .then(
                        cc
                            .tween()
                            .to(1.25, { scale: 0.5 }, { easing: "sineIn" })
                    ),
                cc.tween().to(2, { angle: 360 * 7 })
            )
            .call(() => {
                this.playAnimationtileTarget(data);
                this.node.destroy();
            })
            .start();
    },

    playAnimationtileTarget(data) {
        Emitter.instance.emit(EVENT_NAME.PLAY_ANI, data);
    },

    onDestroy() {},
});
