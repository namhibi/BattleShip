const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        map: cc.Node,
        shipBool: cc.Node,
    },

    onLoad() {
        this.playerId = this.generateRandomId();
        this.registerEvent();
    },

    start() {},

    loadTheShip() {
        Emitter.instance.emit(EVENT_NAME.SOUND_CLICK);
        const allChildren = this.node.children[0].getChildren();
        this.ships = [];
        allChildren.forEach((child) => {
            if (child.name === "ship") {
                this.ships.push(child.getComponent("Ship"));
            }
        });
        if (this.ships.length < 4) {
            cc.log("Vui lòng chọn đủ tàu");
        } else {
            Emitter.instance.emit("SavePlayerId", this.playerId);
            Emitter.instance.emit("START", this.playerId);
            this.shipBool.active = false;
            this.turnOffDraDrop();
        }
    },

    turnOffDraDrop() {
        this.ships.forEach((element) => {
            element.node.getComponent("dradropGameObject").turnOffListener();
        });
    },

    getShipById(shipId) {
        for (let index = 0; index < this.ships.length; index++) {
            if (this.ships[index].shipId == shipId) {
                return this.ships[index];
            }
        }
    },

    updateLength(shipId) {
        let ship = this.getShipById(shipId);
        ship.length -= 1;
        return ship.length;
    },

    responeResult(data) {
        if (this.playerId == data.playerId) {
            if (data.shipId == null) {
                cc.log("hut");
                Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
                    isHit: false,
                    worldPosition: data.worldPosition,
                });
            } else {
                let length = this.updateLength(data.shipId);
                if (length == 0) {
                    cc.log("no");
                    Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
                        isHit: true,
                        worldPosition: data.worldPosition,
                        shipLength: length,
                    });

                    Emitter.instance.emit(
                        EVENT_NAME.COMPLETE_HIT_SHIP,
                        data.shipId
                    );
                } else {
                    cc.log("trung");
                    Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
                        isHit: true,
                        worldPosition: data.worldPosition,
                        shipLength: length,
                    });

                    const { position } = data;
                    cc.log("enemy call:", data);
                    Emitter.instance.emit(EVENT_NAME.HIT_SHIP, {
                        shipId: data.shipId,
                        position: { row: position.y, column: position.x },
                    });
                }
            }
        }
    },

    sendCoordinates(data) {
        cc.log({ playerId: this.playerId, position: data });
        Emitter.instance.emit("POSITION", {
            playerId: this.playerId,
            position: data,
        });
    },

    checkPositon(data) {
        cc.log(data);
        if (this.playerId == data.playerId) {
            Emitter.instance.emit("checkTile", {
                playerId: this.playerId,
                position: data.position,
            });
        }
    },

    generateRandomId() {
        return Math.floor(Math.random() * Date.now()).toString();
    },

    addEffect(data) {
        let ship = this.getShipById(data.shipId).node.getChildByName(
            "shipSprite"
        );
        cc.log(ship);
        let worldPosition = data.effect.parent.convertToWorldSpaceAR(
            data.effect.position
        );
        data.effect.parent = ship;
        let localPosition = ship.convertToNodeSpaceAR(worldPosition);
        data.effect.position = localPosition;
        if (this.getShipById(data.shipId).isHorizontal) {
            data.effect.rotation = 90;
        }
    },

    registerEvent() {
        Emitter.instance.registerEvent(
            EVENT_NAME.CHECK_POSITION,
            this.checkPositon.bind(this)
        );
        Emitter.instance.registerEvent(
            "receiveresult",
            this.responeResult.bind(this)
        );
        Emitter.instance.registerEvent(
            "sendCoordinates",
            this.sendCoordinates.bind(this)
        );
        Emitter.instance.registerEvent("addEffects", this.addEffect.bind(this));
    },
});
