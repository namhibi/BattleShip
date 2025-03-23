cc.Class({
    extends: cc.Component,

    properties: {
        pageIndex: 1,

        leftButton: cc.Node,
        rightButton: cc.Node,

        pagePool: cc.Node,
    },

    onLoad() {
        this.pageNodes = this.pagePool.getChildren();
        this.setPage();
    },

    start() {},

    nextPage() {
        this.pageIndex++;
        this.setPage();
    },

    backPage() {
        this.pageIndex--;
        this.setPage();
    },

    setPage() {
        this.checkButton();
        this.pageNodes.forEach((element) => {
            if (element.name === "Page" + this.pageIndex) {
                element.active = true;
            } else {
                element.active = false;
            }
        });
    },

    checkButton() {
        if (this.pageIndex >= this.pageNodes.length) {
            this.rightButton.active = false;
        } else if (this.pageIndex <= 1) {
            this.leftButton.active = false;
        } else {
            this.rightButton.active = true;
            this.leftButton.active = true;
        }
    },
});
