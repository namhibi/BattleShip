cc.Class({
    extends: cc.Component,

    properties: {
        posX: 0,
        posY: 0,
    },

    start() {
        this.posX = this.node.x;
        this.posY = this.node.y;
        var action = cc.repeatForever(
            cc.sequence(
                cc.spawn(
                    cc.scaleTo(2, this.random(1, 1.3), this.random(1, 1.1)),
                    cc.moveTo(
                        2,
                        this.random(this.posX, this.posX + 5),
                        this.random(this.posY, this.posY + 5)
                    )
                ),
                cc.spawn(
                    cc.scaleTo(2, 1, 1),
                    cc.moveTo(
                        2,
                        this.random(this.posX, this.posX - 5, this.posY),
                        this.random(this.posY, this.posY - 5)
                    )
                )
            )
        );
        this.node.runAction(action);
    },

    random(min, max) {
        return Math.random() * (max - min) + min;
    },
});
