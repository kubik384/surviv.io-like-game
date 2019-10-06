class userInterface {
    constructor () {
        this.components = [];
        this.latency;
        this.HPBar;
        this.takenHPbar;
        this.missingHPBar;
        this.removedHPTimestamp = 0;
    }

    updateLatency(text) {
        this.latency.text = text;
    }

    build(canvas) {
        this.components = [new interface_text(5, 20, 'Ping: checking', '20px Arial', 'left', "rgb(0,0,0)"), new rectangle(canvas.width/2 - 200, canvas.height - 100, 400, 30, 'rgb(255,255,255)', 1), new rectangle(canvas.width/2 + 200, canvas.height - 100, 0, 30, 'rgb(255,0,0)', 1), new rectangle(canvas.width/2 + 200, canvas.height - 100, 0, 30, 'rgb(0,0,0)', 1)];
        this.latency = this.components[0];
        this.HPBar = this.components[1];
        this.takenHPBar = this.components[2];
        this.missingHPBar = this.components[3];
    }

    update(ctx, xOffset, yOffset) {
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].update(ctx, xOffset, yOffset);
        }

        if (this.removedHPTimestamp !== 0 && Date.now() - this.removedHPTimestamp > 2000) {
            this.missingHPBar.width += this.takenHPBar.width;
            this.missingHPBar.xOffset = this.takenHPBar.xOffset;
            this.takenHPBar.width = 0;
            this.removedHPTimestamp = 0;
        }
    }

    updateHPBar(dmg) {
        if (dmg > 0) {
            var width = dmg * 4;
            if (width > this.HPBar.width) {
                width = this.HPBar.width;
            }
            this.HPBar.width -= width;
            this.takenHPBar.width += width;
            this.takenHPBar.xOffset -= width;
            this.removedHPTimestamp = Date.now();
        }
    }
}