cc.Class({
    extends: cc.Component,

    properties: {},

    setMap(map) {
        this.map = map;
        this.rows = this.map.length;
        this.cols = this.map[0].length;
    },

    setShip(data) {
        for (let i = 0; i < data.arrayPos.length; i++) {
            let tile = this.map[data.arrayPos[i].y][data.arrayPos[i].x];
            tile.getComponent("Tile").shipId = data.shipId;
        }
    },

    isInMap(position) {
        return (
            position.y >= 0 &&
            position.y < this.rows &&
            position.x >= 0 &&
            position.x < this.cols
        );
    },

    checkAvailable(arrayPos) {
        for (let i = 0; i < arrayPos.length; i++) {
            if (!this.isInMap(arrayPos[i])) {
                return false;
            }

            let tile = this.map[arrayPos[i].y][arrayPos[i].x];
            if (tile.getComponent("Tile").shipId !== null) {
                return false;
            }
        }
        return true;
    },
});
