class userInterface {
    constructor (canvas, character) {
        this.latency = {component:new interface_text(5, 20, 'Ping: checking', '20px Arial', 'left', "rgb(0,0,0)"), display:true};
        this.coords = {component:new interface_text(5, 50, 'x: ' + character.x + '   y: ' + character.y, '20px Arial', 'left', "rgb(0,0,0)"), display:true};
        this.fps = {component:new interface_text(5, 80, 'FPS: loading', '20px Arial', 'left', "rgb(0,0,0)"), display:true};
        this.HPBar = new HPBar(canvas);
    }

    updateLatency (latency) {   
        this.latency.component.text = 'Ping: ' + latency;
    }

    updateCoords (x,y) {
        this.coords.component.text = 'X: ' + x + '   Y:' + y;
    }

    updateFps (fps) {
        this.fps.component.text = 'FPS: ' + fps;
    }

    update (ctx, xOffset, yOffset) {
        if (this.latency.display) {
            this.latency.component.update(ctx, xOffset, yOffset);
        }
        if (this.coords.display) {
            this.coords.component.update(ctx, xOffset, yOffset);
        }
        if (this.fps.display) {
            this.fps.component.update(ctx, xOffset, yOffset);
        }
        this.HPBar.update(ctx, xOffset, yOffset);
    }

    updateHPBar (currHP, HPChange, maxHP) {
        this.HPBar.updateHP(currHP, HPChange, maxHP);
    }
    
    toggleDebugOverlay() {
        this.coords.display = (this.coords.display ? false : true);
        this.fps.display = (this.fps.display ? false : true);
        this.latency.display = (this.latency.display ? false : true);
    }
}

class HPBar {
    constructor (canvas) {
        this.defaultHPBarWidth = 300;
        this.defaultHPBarFillColor = 'rgb(180,180,180)';
        this.HPBar = new rectangle(canvas.width/2 - this.defaultHPBarWidth/2, canvas.height - 100, this.defaultHPBarWidth, 30, this.defaultHPBarFillColor, 1);
        this.takenHPBar = new rectangle(canvas.width/2 + this.defaultHPBarWidth/2, canvas.height - 100, 0, 30, this.defaultHPBarFillColor, 1);
        this.HPBarBackground = new rectangle(this.HPBar.xOffset - 6, this.HPBar.yOffset - 6, this.HPBar.width + 12, this.HPBar.height + 12, 'rgba(0,0,0,0.5)');
        
        this.lowHP = false;
        this.red = 250;
        this.darken = true;        
    }

    update (ctx, xOffset, yOffset) {
        if (this.takenHPBar.width > 0) {
            this.takenHPBar.width -= this.takenHPBar.width/15;
        }

        if (this.lowHP) {
            if (this.darken) {
                if (this.red > 0) {
                    this.red -= 15;
                } else {
                    this.red += 15;
                    this.darken = false;
                }
            } else {
                if (this.red < 250) {
                    this.red += 15;
                } else {
                    this.darken = true;
                    this.red -= 15;
                }
            }
            this.HPBar.fillColor = 'rgb(' + this.red + ',0,0)';
        }

        this.HPBarBackground.update(ctx, xOffset, yOffset);
        this.HPBar.update(ctx, xOffset, yOffset);
        this.takenHPBar.update(ctx, xOffset, yOffset);
    }

    updateHP (currHP, HPChange, maxHP) {
        if (currHP !== 0) {
            var widthChange = HPChange * this.defaultHPBarWidth/maxHP;
            if (currHP < maxHP) {
                if (currHP/maxHP > 0.75) {
                    this.HPBar.fillColor = 'rgb(255,255,255)';
                    if (this.lowHP) {
                        this.lowHP = false;
                    }
                } else if (currHP/maxHP > 0.2) {
                    var greenBlue = 100 * currHP/maxHP;
                    this.HPBar.fillColor = 'rgb(255,' + greenBlue + ',' + greenBlue + ')';
                    if (this.lowHP) {
                        this.lowHP = false;
                    }
                } else {
                    this.lowHP = true;
                }
            } else {
                this.HPBar.fillColor = this.defaultHPBarFillColor;
                if (this.lowHP) {
                    this.lowHP = false;
                }
            }

            this.HPBar.width += widthChange;
            this.takenHPBar.width -= widthChange;
            this.takenHPBar.xOffset += widthChange;
        } else {
            this.HPBar.width = 0;
            this.takenHPBar.width = 0;
        }
    }
}