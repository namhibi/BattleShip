const Emitter = require("EventEmitter");
const EventName = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        map: cc.Node,
        container: cc.Node,
        isAvailable: false,
        touchDelay: 0.2,
    },

    onLoad() {
        this.offset = cc.Vec2.ZERO;
        this.isDragging = false;
        this.isDoubleClick = false;
        this.count = 0;
        this.lastTouchTime = 0;
        this.convertPos = new cc.Vec2();
        this.lastPosition = this.node.position;
        this.setAgain = false;
        cc.log(this.lastPosition);
    },

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        Emitter.instance.registerEvent(
            "setAvailable",
            this.setAvailable.bind(this)
        );
        Emitter.instance.registerEvent(
            "checkAvailableAll",
            this.checkAvailableAgain.bind(this)
        );
        this.node.getComponent("Ship").playanimOnWater();
    },

    onTouchStart(event) {
        cc.log("start");
        this.node.getChildByName("shipSprite").stopAllActions();
        let prevTouch = this.lastTouchTime ? this.lastTouchTime : 0;
        this.lastTouchTime = Date.now();
        if (this.lastTouchTime - prevTouch < 500) {
            cc.log(this.node.parent);
            if (this.node.parent != this.container) {
                cc.log("doubleTap");
                this.isDoubleClick = true;
            }
        } else {
            this.isDoubleClick = false;
        }
        if (this.node.parent == this.container && this.isDoubleClick == false) {
            this.node.parent = this.container.parent.parent;
            this.node.position = new cc.Vec2(
                this.node.x + this.container.x + this.container.parent.x,
                this.node.y + this.container.y + this.container.parent.y
            );
        }
        this.isDragging = true;
        const worldPos = this.node.parent.convertToNodeSpaceAR(
            event.getLocation()
        );
        this.offset = this.node.position.sub(worldPos);
    },

    onTouchMove(event) {
        cc.log("dra");
        if (!this.isDragging) return;
        const worldPos = this.node.parent.convertToNodeSpaceAR(
            event.getLocation()
        );
        this.node.position = worldPos.add(this.offset);
        let shipPos = new cc.Vec2(
            this.node.x - this.map.x,
            this.node.y - this.map.y
        );
        this.convertPosition(shipPos);
    },

    onTouchEnd(event) {
        cc.log("có chạy tochend");
        if (this.isDoubleClick) {
            this.node.getComponent("Ship").changeRotation();
        } else {
            this.isDoubleClick = false;
            this.endTochAction();
        }
        let currentTime = new Date().getTime();
        this.lastTouchTime = currentTime;
    },

    convertPosition(shipPos) {
        let posX = shipPos.x - 30;
        let posY = shipPos.y + 30;
        let stepX = Math.round(posX / 55);
        let stepY = Math.round(posY / 55);
        let newPos = new cc.Vec2(stepX * 55, stepY * 55);
        this.node
            .getComponent("Ship")
            .calculatePosition(stepX, stepY * -1, true);
        this.convertPos = new cc.Vec2(
            newPos.x + this.map.x + 30,
            newPos.y + this.map.y - 30
        );
    },

    setAvailable(data) {
        if (this.node.getComponent("Ship").shipId == data.shipId) {
            cc.log("data", data);
            cc.log("isdraging", this.isDragging);
            this.isAvailable = data.isAvailable;
            cc.log("isdouble click", this.isDoubleClick);
            if (this.isDoubleClick) {
                this.endTochAction();
                this.isDoubleClick = false;
            }
            if (this.setAgain && this.isAvailable) {
                this.setAgain = false;
                Emitter.instance.emit("setShipId", {
                    positions: this.node.getComponent("Ship").positions,
                    shipId: this.node.getComponent("Ship").shipId,
                });
                Emitter.instance.emit(EventName.CHECK_SHIP_IN_CONTAINER);
            }
        }
    },

    endTochAction() {
        this.node.position = this.convertPos;
        this.isDragging = false;
        cc.log("isAvailable", this.isAvailable);
        if (this.isAvailable == false) {
            if (this.isDoubleClick == false) {
                this.node.parent = this.container;
                this.node.position = this.lastPosition;
                this.node.getComponent("Ship").isHorizontal = true;
                this.node.rotation = 0;
                cc.log(this.node.parent);
                Emitter.instance.emit("clear", {
                    shipId: this.node.getComponent("Ship").shipId,
                });
            }
            Emitter.instance.emit(
                "clearShipId",
                this.node.getComponent("Ship").shipId
            );
        } else {
            cc.log("có set");
            Emitter.instance.emit("setShipId", {
                positions: this.node.getComponent("Ship").positions,
                shipId: this.node.getComponent("Ship").shipId,
            });
        }
        Emitter.instance.emit(EventName.CHECK_SHIP_IN_CONTAINER);
        Emitter.instance.emit(
            "checkAvailableAll",
            this.node.getComponent("Ship").shipId
        );
        this.node.getComponent("Ship").playanimOnWater();
    },

    turnOffListener() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    checkAvailableAgain(data) {
        if (this.node.getComponent("Ship").shipId != data) {
            if (this.node.parent != this.container) {
                if (this.isAvailable == false) {
                    this.setAgain = true;
                    let shipPos = new cc.Vec2(
                        this.node.x - this.map.x,
                        this.node.y - this.map.y
                    );
                    this.convertPosition(shipPos);
                }
            }
        }
    },
});
