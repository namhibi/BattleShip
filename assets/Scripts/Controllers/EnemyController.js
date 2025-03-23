const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

const { randomPosition, randomHitShip } = require("rands");

cc.Class({
    extends: cc.Component,

    properties: {
        _isHitting: false,
        _hitShips: {
            default: {},
        },
        _saveHitPos: [],

        _maxRow: 8,
        _maxColumn: 8,
    },

    onLoad() {
        this.enemyId = Math.floor(Math.random() * Date.now()).toString();

        const onChooseCoordinates = this.chooseCoordinates.bind(this);
        Emitter.instance.registerEvent(
            EVENT_NAME.CHOOSE_COORDINATES,
            onChooseCoordinates
        );

        const onCompleteHitShip = this.onCompleteHitShip.bind(this);
        Emitter.instance.registerEvent(
            EVENT_NAME.COMPLETE_HIT_SHIP,
            onCompleteHitShip
        );

        const onHitShip = this.onHitShip.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.HIT_SHIP, onHitShip);

        Emitter.instance.registerEvent(
            EVENT_NAME.RECEIVE_RESULT,
            this.responeResult.bind(this)
        );
    },

    start() {
        Emitter.instance.emit("setEnemyId", this.enemyId);
        Emitter.instance.emit(EVENT_NAME.RANDOM_SHIPS);
        Emitter.instance.emit("log-enemy-map");
    },

    chooseCoordinates() {
        let position = null;
        do {
            if (!this._isHitting) {
                position = randomPosition(this._maxRow, this._maxColumn);
            } else {
                position = randomHitShip(
                    this._hitShips,
                    this._maxRow,
                    this._maxColumn
                );
            }
        } while (this.hasHitShip(position));
        this._saveHitPos.push(position);
        cc.log("enemy shoot", position);

        Emitter.instance.emit(EVENT_NAME.POSITION, {
            position: {
                // playerId: this.enemyId,
                x: position.column,
                y: position.row,
            },
        });
    },

    hasHitShip(position) {
        return this._saveHitPos.some(
            (value) =>
                value.row === position.row && value.column === position.column
        );
    },

    onHitShip(data) {
        const { shipId, position } = data;
        if (this._hitShips[shipId]) {
            this._hitShips[shipId].push(position);
        } else {
            this._hitShips[shipId] = [position];
        }

        this._isHitting = true;
    },

    onCompleteHitShip(shipId) {
        delete this._hitShips[shipId];

        if (Object.keys(this._hitShips).length === 0) {
            this._isHitting = false;
        }
    },

    responeResult(data) {
        if (this.enemyId == data.playerId) {
            if (data.shipId == null) {
                cc.log("hut");
                Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
                    isHit: false,
                    worldPosition: data.worldPosition,
                });
            } else {
                const out = {};
                Emitter.instance.emit("updateLength", data.shipId, out);
                const { length } = out;
                if (length == 0) {
                    cc.log("no");
                    Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
                        isHit: true,
                        worldPosition: data.worldPosition,
                        shipLength: length,
                    });
                    Emitter.instance.emit("showShip", data.shipId);
                } else {
                    cc.log("trung");
                    Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
                        isHit: true,
                        worldPosition: data.worldPosition,
                        shipLength: length,
                    });
                }
            }
        }
    },
});
