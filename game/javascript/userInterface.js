class userInterface {
    constructor (canvas, character) {
        this.latency = {component:new interface_text(5, 20, 'Ping: checking', '20px Arial', 'left', "rgb(0,0,0)"), display:true};
        this.coords = {component:new interface_text(5, 50, 'x: ' + character.x + '   y: ' + character.y, '20px Arial', 'left', "rgb(0,0,0)"), display:true};
        this.fps = {component:new interface_text(5, 80, 'FPS: loading', '20px Arial', 'left', "rgb(0,0,0)"), display:true};
        this.HPBar = new HPBar();
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
    constructor () {
        this.healthBar = document.getElementById("current-health");
        this.takenHealthBar = document.getElementById("taken-health");
        this._lowHP = false;
    }

    updateHP (currHP, HPChange, maxHP) {
        if (HPChange < 0) {
            if (currHP/maxHP > 0.75) {
                this.healthBar.style.backgroundColor = 'rgb(255,255,255)';
                this.lowHP = false;
            } else if (currHP/maxHP > 0.2) {
                var greenBlue = 150 * currHP/maxHP;
                this.healthBar.style.backgroundColor = 'rgb(255,' + greenBlue + ',' + greenBlue + ')';
                this.lowHP = false;
            } else {
                this.healthBar.style.backgroundColor = 'rgb(255,0,0)';
                this.lowHP = true;
            }
            this.healthBar.style.width = currHP/maxHP * 100 + '%';
            this.takenHealthBar.style.width = currHP/maxHP * 100 + '%';
            this.takenHealth = -HPChange;
        } else {
            this.healthBar.style.width = currHP/maxHP * 100 + '%';
        }
    }

    set lowHP(value) {
        if (value !== this.lowHP) {
            this.healthBar.classList.toggle("red-black-pulse-animation");
            this._lowHP = value;
        } 
    }

    get lowHP() {
        return this._lowHP;
    }
}