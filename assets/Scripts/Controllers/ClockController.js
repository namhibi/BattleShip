const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        countDownTime: 11,
        clockLabel: cc.Label,
        warningColor: cc.Color,
        normalColor: cc.Color,
    },

    onLoad(){
         this.clockLabel.string = ""

        Emitter.instance.registerEvent(
            EVENT_NAME.COUNT_DOWN_CLOCK,
            this.onEnterCountDown.bind(this)
        );

        Emitter.instance.registerEvent(
            EVENT_NAME.STOP_CLOCK,
                    this.resetTimer.bind(this)
                );
    },

    onEnterCountDown(callback){
        this.count = this.countDownTime;
        this.clockLabel.string = "" + this.count;
        this.clockLabel.node.color = this.count <=2 ? this.warningColor : this.normalColor;
        this.tweenCountDown && this.tweenCountDown.stop();
        this.tweenCountDown = cc.tween(this.node)
            .delay(1)
            .call(() => {
                this.count--;
                this.clockLabel.string = "" + this.count;
                this.clockLabel.node.color = this.count <= 2 ? this.warningColor : this.normalColor;
                this.playScaleNumber();
            })
            .union()
            .repeat(this.count)
            .call(() => {
                callback && callback();
                this.resetTimer();
            })
            .start();
    },

    playScaleNumber(){
        this.tweenScaleNumber = cc.tween(this.clockLabel.node)
        .to(0.3,{scale: 1.2})
        .to(0.3,{scale: 1})
        .start();
    },

    resetTimer(){
        this.tweenCountDown && this.tweenCountDown.stop();
        this.tweenCountDown = null;
         this.clockLabel.string = ""
    }
});
