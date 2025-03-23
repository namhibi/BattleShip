const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        mainMusic: cc.AudioSource,
        sounds: [cc.AudioSource],
    },

    onLoad() {
        var _canonShoot = this.canonShoot.bind(this);
        var _explosion = this.explosion.bind(this);
        var _shootWater = this.shootWater.bind(this);
        var _click = this.click.bind(this);
        var _loading = this.loading.bind(this);
        var _shipSank = this.shipSank.bind(this);
        Emitter.instance.registerEvent(
            EVENT_NAME.SOUND_CANON_SHOOT,
            _canonShoot
        );
        Emitter.instance.registerEvent(
            EVENT_NAME.SOUND_SHOOT_WATER,
            _shootWater
        );
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_EXPLOSION, _explosion);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_CLICK, _click);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_LOADING, _loading);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_SHIP_SANK, _shipSank);
    },

    start() {
        this.mainMusic.play();
        this.changeMusicVolume(cc.sys.localStorage.getItem("mainMusicVolume"));
        this.changeSoundsVolume(cc.sys.localStorage.getItem("soundsVolume"));
    },

    canonShoot() {
        this.playSound("explosion");
    },

    explosion() {
        this.playSound("explosion");
    },

    shootWater() {
        this.playSound("shoot_water");
    },

    click() {
        this.playSound("click");
    },

    shipSank() {
        this.playSound("shipSank");
    },

    loading() {
        this.playSound("loading");
        this.node.runAction(
            cc.sequence(
                cc.delayTime(4),
                cc.callFunc(() => {
                    this.stopSound("loading");
                })
            )
        );
    },

    playSound(name) {
        this.sounds.forEach((element) => {
            if (element.node.name == name) {
                element.play();
                return;
            }
        });
    },

    stopSound(name) {
        this.sounds.forEach((element) => {
            if (element.node.name == name) {
                element.stop();
                return;
            }
        });
    },

    changeMusicVolume(volume) {
        this.mainMusic.volume = volume;
        cc.sys.localStorage.setItem("mainMusicVolume", volume);
    },

    changeSoundsVolume(volume) {
        cc.sys.localStorage.setItem("soundsVolume", volume);
        this.sounds.forEach((element) => {
            element.volume = volume;
        });
    },
});
