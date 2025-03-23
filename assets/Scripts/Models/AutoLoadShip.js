const Ship = require("Ship");

const { randomPosition } = require("rands");
const Emitter = require("EventEmitter");
const EventName = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        mapContainer: cc.Node,
        map: cc.Node,
        ships: [Ship],
    },

    onLoad() {
        const onRandomShips = this.onRandomShips.bind(this);
        Emitter.instance.registerOnce(EventName.RANDOM_SHIPS, onRandomShips);
    },

    onRandomShips() {
        this.ships.forEach((ship) => {
            this.onRandomShip(ship);
        });
    },

    onRandomShip(ship) {
        ship.node.parent = this.mapContainer;
        ship.isHorizontal = Math.random() < 0.5;

        while (true) {
            const pos = randomPosition(8, 8);
            ship.calculatePosition(pos.column, pos.row, false);

            const autoMap = this.map.getComponent("AutoLoadMap");
            const isAvailable = autoMap.checkAvailable(ship.positions);
            if (isAvailable) {
                autoMap.setShip({
                    shipId: ship.shipId,
                    arrayPos: ship.positions,
                });
                ship.setShipToMap(this.map, pos);
                break;
            }
        }
    },
});
