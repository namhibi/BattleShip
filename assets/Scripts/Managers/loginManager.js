var percent = {
    value: 0,
};

cc.Class({
    extends: cc.Component,

    properties: {
        loginScene: cc.Node,
        loadingScene: cc.Node,
        loadingWaves: cc.Node,

        yStart: 40,

        yEnd: 280,

        speed: 100,

        percentLabel: cc.Label,
    },

    onLoad() {},

    start() {
        this.loginScene.active = true;
        this.loadingScene.active = false;
    },

    update(dt) {
        this.setPercentLabel(Math.floor(percent.value));
    },

    setPercentLabel(percent) {
        this.percentLabel.string = percent + `%`;
    },

    loading() {
        this.loginScene.active = false;
        this.loadingScene.active = true;

        cc.tween(percent)
            .delay(0.5)
            .to(0.5, { value: 20 })
            .delay(0.5)
            .call(() => {
                this.loadMainScene();
            })
            .to(0.4, { value: 30 })
            .delay(0.4)
            .to(0.3, { value: 60 })
            .delay(0.3)
            .to(0.3, { value: 65 })
            .delay(0.3)
            .to(0.2, { value: 90 })
            .delay(0.2)
            .to(1, { value: 100 })
            .start();

        cc.tween(this.loadingWaves).to(5.2, { y: this.yEnd }).start();
    },

    loadMainScene() {
        cc.director.loadScene("mainScene");
    },
});
