const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        rows: 8,
        cols: 8,
        tilePrefab: cc.Prefab,
    },

    onLoad() {
        this.map = new Array(this.rows)
            .fill(null)
            .map(() => new Array(this.cols).fill(null));
        this.enemyId = null;
        this.creatMap();

        Emitter.instance.registerEvent("checkTile", this.checkTile.bind(this));

        Emitter.instance.registerEvent(
            "setEnemyId",
            (enemyId) => (this.enemyId = enemyId)
        );

        Emitter.instance.registerEvent("log-enemy-map", () =>
            cc.log(
                "random ship",
                this.map.map((row) =>
                    row.map((tile) => tile.getComponent("Tile").shipId)
                )
            )
        );

        const autoMap = this.getComponent("AutoLoadMap");
        if (autoMap) {
            autoMap.setMap(this.map);
        }
    },

    start() {
        this.changeInteractState(true);
    },

    onTouchEnd(event) {
        cc.log("co nhan");
        let touchPosGlobal = event.getLocation();
        let touchPosLocal = this.node.convertToNodeSpaceAR(touchPosGlobal);
        this.convertPosition(touchPosLocal);
    },

    onMouseEnter(event) {
        this.clearHover();

        this.hoverAction(event);
    },

    onMouseMove(event) {
        this.hoverAction(event);
    },

    onMouseLeave(event) {
        this.clearHover();
    },

    hoverAction(event) {
        this.clearHover();
        let touchPosGlobal = event.getLocation();
        let touchPosLocal = this.node.convertToNodeSpaceAR(touchPosGlobal);
        let posX = touchPosLocal.x - 30;
        let posY = touchPosLocal.y + 30;
        let stepX = Math.round(posX / 55);
        let stepY = Math.round(posY / 55);
        if (
            stepY * -1 < 0 ||
            stepY * -1 >= this.cols ||
            stepX < 0 ||
            stepX >= this.rows
        ) {
            return;
        }
        let tile = this.map[stepY * -1][stepX];
        tile.getComponent("Tile").setHover(true);
    },

    clearHover() {
        this.map.forEach((rows) => {
            rows.forEach((element) => {
                element.getComponent("Tile").setHover(false);
            });
        });
    },

    convertPosition(pos) {
        let posX = pos.x - 30;
        let posY = pos.y + 30;
        let stepX = Math.round(posX / 55);
        let stepY = Math.round(posY / 55);
        if (
            stepY * -1 < 0 ||
            stepY * -1 >= this.cols ||
            stepX < 0 ||
            stepX >= this.rows
        ) {
            return;
        }
        let tile = this.map[stepY * -1][stepX];
        if (tile.getComponent("Tile").isShooted) {
            cc.log("ô này đã bị bắn");
        } else {
            cc.log("Gửi cho player có thể bắn");
            Emitter.instance.emit("sendCoordinates", { x: stepX, y: -stepY });
        }
    },

    test() {
        this.node.active = !this.node.active;
    },

    getRandomIntegerInRange(minValue, maxValue) {
        return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
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

    checkTile(data) {
        if (this.enemyId == data.playerId) {
            let node = this.map[data.position.y][data.position.x];
            let targetPosition = node.convertToNodeSpaceAR(cc.v2(0, 0));
            let shipId = node.getComponent("Tile").shipId;
            cc.log("enemy ship", shipId);
            Emitter.instance.emit("receiveresult", {
                playerId: this.enemyId,
                worldPosition: targetPosition.mul(-1),
                shipId: shipId,
            });
            node.getComponent("Tile").isShooted = true;
            cc.tween(this.node)
                .delay(3)
                .call(() => {
                    node.getComponent("Tile").changeState();
                })
                .start();
        }
    },

    changeInteractState(isInteract) {
        if (isInteract) {
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.node.on(
                cc.Node.EventType.MOUSE_ENTER,
                this.onMouseEnter,
                this
            );
            this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
            this.node.on(
                cc.Node.EventType.MOUSE_LEAVE,
                this.onMouseLeave,
                this
            );
        } else {
            this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.node.off(
                cc.Node.EventType.MOUSE_ENTER,
                this.onMouseEnter,
                this
            );
            this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
            this.node.off(
                cc.Node.EventType.MOUSE_LEAVE,
                this.onMouseLeave,
                this
            );
        }
    },
});
