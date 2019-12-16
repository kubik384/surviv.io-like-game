class userInterface {
    constructor () {
        this.HPBar = new HPBar();
        this.debugOverlay = new debugOverlay();
    }
    
    showPickItem() {
        document.getElementById("pick-item").innerHTML = this.items[i].name;
        document.getElementById("ui-pick-item").style.display = "block";
    }

    hidePickItem() {
        document.getElementById("pick-item").innerHTML = this.items[i].name;
        document.getElementById("ui-pick-item").style.display = "none";
    }
}


class HPBar {
    constructor () {
        this.healthBar = document.getElementById("current-health");
        this.takenHealthBar = document.getElementById("taken-health");
        this._lowHP = false;
    }

    update (currHP, HPChange, maxHP) {
        if (HPChange < 0) {
            if (currHP/maxHP > 0.75) {
                this.healthBar.style.backgroundColor = 'rgb(255,255,255)';
            } else if (currHP/maxHP > 0.2) {
                var greenBlue = 150 * currHP/maxHP;
                this.healthBar.style.backgroundColor = 'rgb(255,' + greenBlue + ',' + greenBlue + ')';
            } else {
                this.healthBar.style.backgroundColor = 'rgb(255,0,0)';
                this.lowHP = true;
            }
            this.healthBar.style.width = currHP/maxHP * 100 + '%';
            this.takenHealthBar.style.width = currHP/maxHP * 100 + '%';
            this.takenHealth = -HPChange;
        } else {
            this.healthBar.style.width = currHP/maxHP * 100 + '%';
            if (this.currHP > 0.2) {
                this.lowHP = false;
            }
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

class debugOverlay {
    constructor() {
        this.components = [document.getElementById("latency"), document.getElementById("coordinates"), document.getElementById("fps")];
        this.latency = this.components[0];
        this.coords = this.components[1];
        this.fps = this.components[2];
        this.displayed = false;
    }

    updateLatency (latency) {   
        this.latency.innerHTML = 'Ping: ' + latency;
    }

    updateCoords (x,y) {
        this.coords.innerHTML = 'X: ' + x + ' Y: ' + y;
    }

    updateFps (fps) {
        this.fps.innerHTML = 'FPS: ' + fps;
    }

    toggle() {
        if (this.displayed) {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].style.display = "none";
            }
        } else {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].style.display = "block";
            }
        }
        this.displayed = !this.displayed;
    }
}