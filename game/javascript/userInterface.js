class userInterface {
    constructor (components) {
        this.components = components;
        this.removedHPTimestamp = 0;
    }
}
/*
this.hpBar.width -= bullet.dmg * 4;
this.removedHPBar.width += bullet.dmg * 4;
this.removedHPBar.xOffset -= bullet.dmg * 4;
this.removedHPTimestamp = Date.now();

if (this.removedHPTimestamp !== 0 && Date.now() - this.removedHPTimestamp> 2000) {
    this.missingHPBar.width += this.removedHPBar.width;
    this.missingHPBar.xOffset = this.removedHPBar.xOffset;
    this.removedHPBar.width = 0;
    this.removedHPTimestamp = 0;
}

this.latencyText.update(this.context, this.xOffset, this.yOffset);
this.removedHPBar.update(this.context, this.xOffset, this.yOffset);
this.missingHPBar.update(this.context, this.xOffset, this.yOffset);
this.hpBar.update(this.context, this.xOffset, this.yOffset);
*/