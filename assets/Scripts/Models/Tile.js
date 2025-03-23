cc.Class({
    extends: cc.Component,

    properties: {
        cover: cc.Node,
        hover: cc.Node,
        activeColor: cc.Color,
        effect: [cc.Prefab],
        shipId: null,
        isShooted: false,
    },

    active(isSelected) {
        if (isSelected) {
            this.cover.active = true;
            this.cover.color = this.activeColor;
        } else {
            this.cover.active = false;
        }
    },

    select() {
        let effect = null;
        if (this.isHasShip) {
            effect = cc.instantiate(this.effect[0]);
        } else {
            effect = cc.instantiate(this.effect[1]);
        }
        effect.parent = this.node;
    },

    setHover(isHover) {
        if (isHover) {
            this.hover.active = true;
        } else {
            this.hover.active = false;
        }
    },

    changeState() {
        if (this.shipId == null) {
            this.cover.active = true;
            this.cover.color = this.activeColor = cc.color(80, 80, 80, 180);
        } else {
            this.cover.active = true;
            this.cover.color = this.activeColor = cc.color(255, 0, 0, 180);
        }
    },
});
