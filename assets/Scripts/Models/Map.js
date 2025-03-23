const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        rows: 8,
        cols: 8,
        tilePrefab: cc.Prefab,
        selectedTiles: [cc.Node],
    },

    onLoad() {
        this.map = new Array(this.rows)
            .fill(null)
            .map(() => new Array(this.cols).fill(null));
        cc.log(this.map);
        this.isAvailable = true;
        this.playerId = null;
        this.creatMap();
    },

    start() {
        Emitter.instance.registerEvent(
            "selected",
            this.addSelectedTile.bind(this)
        );
        Emitter.instance.registerEvent("setShipId", this.setShipId.bind(this));
        Emitter.instance.registerEvent(
            "clear",
            this.removeAllSelectedTile.bind(this)
        );
        Emitter.instance.registerEvent(
            "clearShipId",
            this.clearShipId.bind(this)
        );
        Emitter.instance.registerEvent("checkTile", this.checkTile.bind(this));
        Emitter.instance.registerEvent(
            "SavePlayerId",
            this.savePlayerId.bind(this)
        );
    },

    creatMap() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let tile = cc.instantiate(this.tilePrefab);
                this.map[i][j] = tile;
                tile.parent = this.node;
            }
        }
    },

    removeAllSelectedTile() {
        if (this.selectedTiles.length >= 0) {
            this.selectedTiles.forEach((element) => {
                element.getComponent("Tile").active(false);
            });
            this.selectedTiles.length = 0;
        }
    },

    addSelectedTile(data) {
        this.removeAllSelectedTile();
        this.isAvailable = true;
        this.checkAvailable(data.positions, data.shipId);
        this.selectedTiles.forEach((element) => {
            if (this.isAvailable) {
                element.getComponent("Tile").activeColor = cc.color(
                    0,
                    255,
                    0,
                    180
                );
                element.getComponent("Tile").active(true);
            } else {
                element.getComponent("Tile").activeColor = cc.color(
                    255,
                    0,
                    0,
                    180
                );
                element.getComponent("Tile").active(true);
            }
        });
        Emitter.instance.emit("setAvailable", {
            isAvailable: this.isAvailable,
            shipId: data.shipId,
        });
    },

    checkAvailable(arrayPos, shipId) {
        for (let i = 0; i < arrayPos.length; i++) {
            if (
                arrayPos[i].y < 0 ||
                arrayPos[i].y >= this.rows ||
                arrayPos[i].x < 0 ||
                arrayPos[i].x >= this.rows
            ) {
                this.isAvailable = false;
                continue;
            } else {
                this.selectedTiles.push(this.map[arrayPos[i].y][arrayPos[i].x]);
            }
        }
        this.selectedTiles.forEach((element) => {
            if (element.getComponent("Tile").shipId != null) {
                if (element.getComponent("Tile").shipId != shipId) {
                    this.isAvailable = false;
                }
            }
        });
    },

    clearShipId(shipId) {
        cc.log("clear:", shipId);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.map[i][j].getComponent("Tile").shipId == shipId) {
                    cc.log("clear");
                    this.map[i][j].getComponent("Tile").shipId = null;
                }
            }
        }
    },

    setShipId(data) {
        cc.log("setShipid");
        this.removeAllSelectedTile();
        this.clearShipId(data.shipId);
        data.positions.forEach((element) => {
            this.map[element.y][element.x].getComponent("Tile").shipId =
                data.shipId;
        });
    },

    checkTile(data) {
        if (this.playerId == data.playerId) {
            let node = this.map[data.position.y][data.position.x];
            let targetPosition = node.convertToNodeSpaceAR(cc.v2(0, 0));
            let shipId = node.getComponent("Tile").shipId;
            Emitter.instance.emit("receiveresult", {
                playerId: this.playerId,
                worldPosition: targetPosition.mul(-1),
                shipId: shipId,
                position: data.position,
            });
            cc.tween(this.node)
                .delay(3)
                .call(() => {
                    node.getComponent("Tile").changeState();
                    if (shipId != null) {
                        Emitter.instance.emit("spawnEffects", {
                            position: node.position,
                            shipId: shipId,
                        });
                    }
                })
                .start();
        }
    },

    savePlayerId(data) {
        cc.log("save player id");
        this.playerId = data;
    },
});
