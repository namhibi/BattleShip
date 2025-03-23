const position = require("Position");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        length: 0,
        isHorizontal: true,

        hideShip: {
            get() {
                return this._hideShip;
            },
            set(value) {
                this._hideShip = value;
                this.shipSprite.node.active = !value;
            },
        },

        _hideShip: false,
        shipSprite: cc.Sprite,
    },

    ctor(length, isHorizontal) {
        this.length = length;
        this.isHorizontal = isHorizontal;
        this.shipId = this.generateRandomId();
        this.anchorIndex = Math.floor(this.length / 2);
        this.positions = [];
        this.creatPos();
    },

    onLoad() {
        if (this.shipId == null) {
            this.shipId = this.generateRandomId();
        }
        (this.isHorizontal = true),
            (this.anchorIndex = Math.floor(this.length / 2));
        this.positions = [];
        this.creatPos();

        Emitter.instance.registerEvent(
            "updateLength",
            this.updateLength.bind(this)
        );
        Emitter.instance.registerEvent("showShip", this.showShip.bind(this));
    },

    creatPos() {
        for (let i = 0; i < this.length; i++) {
            this.positions.push(new position(0, 0));
        }
    },

    calculatePosition(x, y, isPlayer) {
        this.positions[this.anchorIndex].x = x;
        this.positions[this.anchorIndex].y = y;
        if (this.isHorizontal) {
            for (let i = this.anchorIndex - 1; i >= 0; i--) {
                this.positions[i].x = x - (this.anchorIndex - i);
                this.positions[i].y = y;
            }
            for (let i = this.anchorIndex + 1; i <= this.length - 1; i++) {
                this.positions[i].x = x + (i - this.anchorIndex);
                this.positions[i].y = y;
            }
        } else {
            for (let i = this.anchorIndex - 1; i >= 0; i--) {
                this.positions[i].x = x;
                this.positions[i].y = y - (this.anchorIndex - i);
            }
            for (let i = this.anchorIndex + 1; i <= this.length - 1; i++) {
                this.positions[i].x = x;
                this.positions[i].y = y + (i - this.anchorIndex);
            }
        }
        if (isPlayer) {
            Emitter.instance.emit("selected", {
                positions: this.positions,
                shipId: this.shipId,
            });
        }
    },

    generateRandomId() {
        return Math.floor(Math.random() * Date.now()).toString();
    },

    playanimOnWater() {
        let scaleDown = cc.scaleTo(3, 0.9);
        let scaleUp = cc.scaleTo(3, 1);
        let sequence = cc.sequence(scaleDown, scaleUp);
        let repeatedAction = cc.repeatForever(sequence);
        this.node.getChildByName("shipSprite").runAction(repeatedAction);
    },

    changeRotation() {
        cc.log("rotation");
        this.isHorizontal = !this.isHorizontal;
        if (this.isHorizontal) {
            this.node.rotation = 0;
        } else {
            this.node.rotation = 90;
        }
        this.calculatePosition(
            this.positions[this.anchorIndex].x,
            this.positions[this.anchorIndex].y,
            true
        );
    },

    setShipToMap(map, position) {
        const { row, column } = position;
        const x = column * 55;
        const y = -row * 55;
        const newPos = cc.v2(x, y).add(map.position).add(cc.v2(30, -30));

        this.node.position = newPos;
        this.node.angle = this.isHorizontal ? 0 : -90;
    },

    updateLength(shipId, out) {
        if (this.shipId !== shipId) {
            return;
        }

        this.length--;
        out.length = this.length;
    },

    showShip(shipId) {
        if (this.shipId !== shipId) {
            return;
        }

        cc.tween(this.node)
            .delay(5)
            .call(() => (this.hideShip = false))
            .start();
    },
});
