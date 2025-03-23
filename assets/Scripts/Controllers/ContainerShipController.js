const Emitter = require("EventEmitter");
const EventName = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        startButton: cc.Button,
        allShip: [cc.Node],
    },

    onLoad() {
        this.loadAllShip();
    },

    start() {
        this.startButton.interactable = false;
        Emitter.instance.registerEvent(
            EventName.CHECK_SHIP_IN_CONTAINER,
            this.checkShipInContainer.bind(this)
        );
    },

    checkShipInContainer() {
        let availableCount = 0;
        for (let index = 0; index < this.allShip.length; index++) {
            cc.log(
                this.allShip[index].getComponent("dradropGameObject")
                    .isAvailable
            );
            if (
                this.allShip[index].getComponent("dradropGameObject")
                    .isAvailable
            ) {
                availableCount++;
            }
        }
        if (availableCount == 4) {
            this.startButton.interactable = true;
        } else {
            this.startButton.interactable = false;
        }
    },

    loadAllShip() {
        let allChildren = this.node.getChildren();
        for (let index = 0; index < allChildren.length; index++) {
            this.allShip.push(allChildren[index]);
        }
    },
});
