const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        fireEffect: cc.Prefab,
    },

    onLoad() {},

    start() {
        this.node.zIndex = 10;
        Emitter.instance.registerEvent(
            "spawnEffects",
            this.spawnEffect.bind(this)
        );
    },

    spawnEffect(data) {
        let effect = cc.instantiate(this.fireEffect);
        effect.parent = this.node;
        effect.position = data.position;
        Emitter.instance.emit("addEffects", {
            shipId: data.shipId,
            effect: effect,
        });
    },
});
