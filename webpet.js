jQuery.fn.cssNumber = function(a) {
    var b = parseInt(this.css(a), 10);
    return isNaN(b) ? 0 : b
};

function vec2(a, b) {
    this.x = a, this.y = b, this.add = function(a, b) {
        this.x += a, this.y += b
    }, this.sub = function(a, b) {
        this.x -= a, this.y -= b
    }, this.mul = function(a, b) {
        this.x *= a, this.y *= b
    }, this.set = function(a, b) {
        this.x = a, this.y = b
    }, this.addV = function(a) {
        this.add(a.x, a.y)
    }, this.subV = function(a) {
        this.sub(a.x, a.y)
    }, this.mulV = function(a) {
        this.mul(a.x, a.y)
    }, this.setV = function(a) {
        this.set(a.x, a.y)
    }, this.toString = function() {
        return "(" + this.x + ", " + this.y + ")"
    }, this.toPx = function() {
        return this.x + "px " + this.y + "px"
    }
}

function cssdiv(a) {
    this.e = $(a), this.getLeft = function() {
        return this.e.cssNumber("left")
    }, this.getTop = function() {
        return this.e.cssNumber("top")
    }, this.getWidth = function() {
        return this.e.cssNumber("width")
    }, this.getHeight = function() {
        return this.e.cssNumber("height")
    }, this.getRight = function() {
        return this.getLeft() + this.getWidth()
    }, this.getBottom = function() {
        return this.getTop() + this.getHeight()
    }, this.setLeft = function(a) {
        this.e.css("left", L + "px")
    }, this.setTop = function(a) {
        this.e.css("top", a + "px")
    }
}

function updateTicks(a) {
    tickSpeed = a, clearInterval(fticks), fticks = setInterval("figur.tick()", tickSpeed)
}

function queue(a, b, c) {
    clearTimeout(queueEvent), queueEvent = setTimeout(a, b * tickSpeed + c)
}

function randInt(a) {
    return Math.floor(Math.random() * a)
}

function chance(a, b) {
    return randInt(b) < a
}

function trigger(a, b) {
    return a > b ? 1 : -b > a ? -1 : 0
}

function between(a, b, c) {
    return a > b && c > a
}

function decf(a, b) {
    return b >= a ? a : b
}

function dbTxt(a, b) {
    DEBUG && $("#debug" + a).text(b)
}

function getFrame(a) {
    1 == a.dir ? a.elem.e.removeClass("flip") : -1 == a.dir && a.elem.e.addClass("flip");
    for (var b = a.state[a.framenum]; void 0 == b;) a.framenum--, b = a.state[a.framenum];
    var c = b[0] * -a.dim.x,
        d = b[1] * -a.dim.y;
    return ++a.framenum >= a.state.length && (a.framenum -= a.framenum), 0 != c && (c += "px"), 0 != d && (d += "px"), c + " " + d
}

function activePhysics() {
    var a = $(".mass");
    if (!figur.dragged) {
        figur.v.y += gravity;
        var b = detTop(a),
            c = detLeft(a);
        a.css("top", b - $(document).scrollTop() + "px"), a.css("left", c + "px")
    }
    if (!figur.airborne) {
        var d = 1 * figur.v.x,
            e = 1 - friction;
        figur.v.x = d > 0 ? Math.floor(e * d) : Math.ceil(e * d)
    }
    var f = figur.activevx + figur.v.x;
    inBounds(figur, mouse.r.x, mouse.r.y) && (figur.alone -= decf(figur.alone, figur.friendliness)), dbTxt(7, figur.state_name(figur.state) + " : " + figur.framenum), dbTxt(9, "position: " + figur.r.toString() + "\n" + figur.elem.getLeft() + " " + figur.elem.getTop()), dbTxt(10, "vel: " + f + ", " + figur.v.y), dbTxt(11, (figur.active ? "ACTIVE" : "INACTIVE") + "  " + (figur.animate ? "ANIMATE" : "STILL") + " ticks: " + tickSpeed), dbTxt(12, figur.hurt + " >> " + figur.recoveryTime), dbTxt(13, $(document).scrollTop()), dbTxt(15, figur.airborne ? "ON AIR" : "ON GROUND")
}

function detTop(a) {
    var b = $(document).scrollTop() + window.innerHeight,
        c = b - a.cssNumber("height"),
        d = figur.r.y,
        e = d + figur.v.y;
    if (e >= c) return figur.ground(c);
    var f = figur.state;
    return figur.dirsign(figur.activevx + figur.v.x), figur.v.y > 0 && f != figur.ff.fall && f != figur.ff.beginfall && figur.beginfall(), figur.airborne = 1, figur.r.y = e, Math.floor(figur.r.y)
}

function detLeft(a) {
    return figur.activevx = figur.xVelbase * figur.mouseDistFactor(), figur.r.x += figur.v.x + figur.activevx, figur.r.x < 0 && (figur.v.x < 33 && (figur.hurt -= figur.v.x / 33), figur.v.x *= figur.v.x >= 0 ? .9 : -.9), figur.r.x + a.cssNumber("width") > window.innerWidth && (figur.v.x > 33 && (figur.hurt += figur.v.x / 33), figur.v.x *= figur.v.x >= 0 ? -.9 : .9), Math.floor(figur.r.x)
}

function inBounds(a, b, c) {
    var d = " < ";
    return dbTxt(2, a.getLB() + d + b + d + a.getRB()), dbTxt(3, a.getTB() + d + c + d + a.getBB()), between(b, a.getLB(), a.getRB()) && between(c, a.getTB(), a.getBB())
}
var DEBUG = 0,
    gravity = .8,
    tickSpeed = 200,
    tickSpeed_default = 200,
    friction = .05,
    queueEvent = null,
    gravi = setInterval("activePhysics()", 20),
    fticks = setInterval("figur.tick()", tickSpeed),
    mouse = {
        r: new vec2(window.innerWidth / 2, window.innerHeight / 2),
        v: new vec2(0, 0)
    },
    Vector = {
        sum: function(a, b) {
            return new vec2(a.x + b.x, a.y + b.y)
        },
        diff: function(a, b) {
            return new vec2(a.x - b.x, a.y - b.y)
        }
    };
var figur = {
        id: -1,
        elem: new cssdiv("#figure"),
        initialize: function() {
            void 0 == window.fstack ? window.fstack = [this] : window.fstack.push(this), this.id = window.fstack.length - 1, this.elem = new cssdiv("#figure"), this.elem.setTop(0), this.r = new vec2(this.elem.getLeft(), this.elem.getTop() + $(document).scrollTop()), this.state = this.ff.idle
        },
        leave: function() {
            clearTimeout(gravi), clearTimeout(fticks), window.fstack.forEach(function(a, b, c) {
                a.id == this.id && c.splice(b, 1)
            }), this.elem.e.remove()
        },
        skin: 0,
        r: new vec2(0, 0),
        activevx: 0,
        xVelbase: 0,
        v: new vec2(0, 0),
        alone: 0,
        dir: 0,
        dragged: 0,
        airborne: 1,
        active: 1,
        recoveryTime: 1,
        hurt: 0,
        animate: 1,
        friendliness: 10,
        down: 0,
        maxAllowV: 20,
        mOff: new vec2(0, 0),
        fov_angle: Math.PI / 12,
        framenum: 0,
        dim: new vec2(150, 150),
        fr_xMargin: 25,
        fr_topMargin: 0,
        ff: {
            idle: [
                [0, 0],
                [1, 0],
                [2, 0],
                [3, 0]
            ],
            seek: [
                [3, 1],
                [3, 1],
                [4, 1],
                [4, 1],
                [4, 1],
                [4, 1],
                [3, 1],
                [3, 1],
                [3, 1]
            ],
            turn: [
                [3, 0],
                [3, 0],
                [3, 0],
                [3, 0],
                [4, 0],
                [4, 0],
                [4, 0],
                [4, 0],
                [4, 0]
            ],
            tocen: [
                [5, 0],
                [4, 0],
                [3, 0]
            ],
            tosid: [
                [3, 0],
                [4, 0],
                [5, 0]
            ],
            walk: [
                [5, 0],
                [0, 1],
                [1, 1],
                [2, 1]
            ],
            dragged: [4, 1],
            fall: [
                [5, 1],
                [0, 2]
            ],
            floor: [
                [1, 2],
                [2, 2],
                [3, 2],
                [3, 2]
            ],
            beginfall: [
                [3, 3],
                [4, 3],
                [5, 3],
                [3, 2],
                [3, 2],
                [1, 2],
                [1, 2]
            ],
            sleep: [
                [3, 2]
            ],
            rise: [
                [4, 2],
                [4, 2],
                [5, 2],
                [5, 2],
                [5, 2],
                [5, 2]
            ],
            prepjumpup: [
                [0, 3]
            ],
            jumpup: [
                [1, 3]
            ],
            prepjumpside: [
                [2, 3]
            ],
            jumpside: [
                [3, 3]
            ]
        },
        state: 0,
        is: function(a) {
            return figur.state === a
        },
        tick: function() {
            this.dragged || (this.animate && this.elem.e.css("background-position", getFrame(this)), !this.airborne && this.active && (this.is(this.ff.idle) && chance(this.alone, 80) || this.is(this.ff.walk) ? this.seekMouse() : this.alone++)), dbTxt(6, "time: " + this.alone), dbTxt(8, "direction: " + this.dir)
        },
        getLB: function() {
            return this.elem.getLeft() + this.fr_xMargin
        },
        getRB: function() {
            return this.elem.getRight() - this.fr_xMargin
        },
        getTB: function() {
            return this.elem.getTop() + this.fr_topMargin + $(document).scrollTop()
        },
        getBB: function() {
            return this.elem.getBottom() + $(document).scrollTop()
        },
        seekMouse: function() {
            var a = this.getLB(),
                b = this.getRB(),
                c = this.getTB();
            if (between(mouse.r.x, a, b)) mouse.r.y < c ? this.seek(0, 1, 0, 0) : (this.changeDir(0), this.alone = 0, this.hurt -= decf(this.hurt, .2));
            else {
                var d = mouse.r.x > b ? 1 : -1,
                    e = mouse.r.x > b ? mouse.r.x - b : a - mouse.r.x,
                    f = Math.atan2(c - mouse.r.y, e),
                    g = Math.PI / 2 - this.fov_angle;
                f < this.fov_angle ? this.is(this.ff.idle) ? this.seek(d, 0, e, d) : this.setWalk(d, 0) : f > g ? this.seek(0, 1, e, d) : this.seek(d, 1, e, d)
            }
        },
        mouseDistFactor: function() {
            return 1 + 2 * (mouse.r.x > this.getLB() ? mouse.r.x - this.getLB() : this.getLB() - mouse.r.x) / window.innerWidth
        },
        seek: function(a, b, c, d) {
            0 != a ? b ? this.prepJump(a, c, d) : this.setSeekHoriz(a) : b && (chance(this.alone, 100) ? this.prepJump(0, c, d) : this.setSeekUp())
        },
        setIdle: function() //THIS IS WHERE TO PUT IDLE ANIMATIONS!!
		{
            this.stop(), this.state = this.ff.idle, this.active = 1, this.xVelbase = 0, tickSpeed != tickSpeed_default && updateTicks(tickSpeed_default)
        },
        setSeekUp: function() {
            this.stop(), this.state = this.ff.seek, this.xVelbase = 0, this.alone -= decf(this.alone, 5), queue("figur.setIdle()", this.ff.seek.length + 1, 0)
        },
        setSeekHoriz: function(a) {
            this.resetAnim(), this.state = this.ff.turn, this.dir = a, queue("figur.setWalk(" + a + ",1)", this.ff.turn.length, 0)
        },
        changeDir: function(a) {
            this.activevx = 0, this.xVelbase = 0, this.dir > a ? (updateTicks(tickSpeed_default / 2), this.framenum = 0, this.dir--, 0 == this.dir ? (dbTxt(5, "R > M"), this.state = this.ff.tocen, queue("figur.changeDir(" + a + ")", this.state.length, 0)) : -1 == this.dir && (dbTxt(5, "M > L"), this.state = this.ff.tosid, queue("figur.setWalk(" + a + ",1)", this.state.length, 0))) : this.dir < a ? (updateTicks(tickSpeed_default / 2), this.framenum = 0, this.dir++, 0 == this.dir ? (dbTxt(5, "L > M"), this.state = this.ff.tocen, queue("figur.changeDir(" + a + ")", this.state.length, 0)) : 1 == this.dir && (dbTxt(5, "M > R"), this.state = this.ff.tosid, queue("figur.setWalk(" + a + ",1)", this.state.length, 0))) : (updateTicks(tickSpeed_default), dbTxt(5, 0 != a ? "DONE TURNING" : "RETURNED"), 0 != a ? this.setWalk(a, 1) : this.setIdle())
        },
        setWalk: function(a, b) {
            return this.dir != a ? this.changeDir(a) : (updateTicks(tickSpeed_default), b && (this.framenum = 0), this.state = this.ff.walk, void(this.xVelbase = 1 * a * (this.alone / 40)))
        },
        sleep: function() {
            this.state = this.ff.sleep, this.active = 0, this.animate = 0, this.recoveryTime != 1 / 0 && queue("figur.rise()", 1 + this.recoveryTime, 0)
        },
        prepJump: function(a, b, c) {
            this.dir = c, this.activevx = 0, this.xVelbase = 0;
            var d = this.getTB(),
                e = this.elem.getHeight() - this.fr_topMargin,
                f = d - (mouse.r.y - e / 2),
                g = -Math.sqrt(2 * gravity * f);
            if (g *= 1 - .3 * Math.random(), g > this.maxAllowV && (g *= .8 - .4 * Math.random()), Math.abs(b) < .5) g < this.maxAllowV || chance(this.alone - 50, 500) ? (this.active = 0, dbTxt(13, "vert jump vy: " + g), this.state = 0 == a ? this.ff.prepjumpup : this.ff.prepjumpside, queue("figur.jump(0," + g + ")", 1 - Math.ceil(g / 10), 0)) : this.setSeekUp();
            else {
                this.dir = a;
                var h = c * (1 * b) / (-g / gravity);
                h > this.maxAllowV && (h *= .8 - .4 * Math.random());
                var i = Math.sqrt(g * g + h * h);
                g < this.maxAllowV && Math.abs(h) < this.maxAllowV || chance(this.alone - 50, 500) ? (this.state = 0 == a ? this.ff.prepjumpup : this.ff.prepjumpside, this.active = 0, dbTxt(13, "side jump vx: " + h + ", vy: " + g), queue("figur.jump(" + h + "," + g + ")", 1 + Math.ceil(i / 10), 0)) : this.state != this.ff.walk ? this.setSeekHoriz(a) : this.setWalk(a, 0)
            }
        },
        jump: function(a, b) {
            this.v.set(a, b), this.state = 0 == a ? this.ff.jumpup : this.ff.jumpside
        },
        beginfall: function() {
            var a = this.state,
                b = (this.is(this.ff.sleep) || this.down) && (a != this.ff.jumpside || a != this.ff.jumpup);
            this.state = this.ff.beginfall, this.framenum = b ? 3 : 0, this.v.x += this.xVelbase, this.xVelbase = 0, this.animate = 1, updateTicks(2 * tickSpeed_default / 3), queue("figur.fall()", this.state.length - this.framenum, 0)
        },
        fall: function() {
            this.state = this.ff.fall, this.framenum = randInt(this.ff.fall.length), this.setSprite(this.ff.fall[this.framenum]), this.animate = 0, this.active = 0, updateTicks(tickSpeed_default)
        },
        hitFloor: function() {
            var a = this.is(this.ff.beginfall);
            if (this.active = 0, updateTicks(tickSpeed_default), a && this.framenum < 3) {
                switch (updateTicks(tickSpeed_default / 2), this.state = this.ff.rise, this.framenum) {
                    case 2:
                        this.framenum = 0;
                        break;
                    case 1:
                        this.framenum = 3;
                        break;
                    case 0:
                        this.framenum = 5
                }
                queue("figur.setIdle()", this.state.length - this.framenum, 0)
            } else this.state = this.ff.floor, a ? this.framenum = 6 - this.framenum : this.framenum = 0, this.recoveryTime == 1 / 0 ? this.setSprite(this.ff.sleep) : (this.recoveryTime = (randInt(2) + this.v.y / 2 + this.hurt) / 2, this.v.y > 33 && (this.hurt += this.v.y / 15), this.hurt > 50 && this.die()), queue("figur.sleep()", this.state.length - this.framenum, -2 * tickSpeed / 3)
        },
        rise: function() {
            this.animate = 1, this.framenum = 0, this.state = this.ff.rise, queue("figur.setIdle()", this.state.length, 0)
        },
        stop: function() {
            this.resetAnim(), this.dir = 0
        },
        resetAnim: function() {
            this.framenum = 0, this.activevx = 0
        },
        mouseDown: function(a, b) {
            this.dragged = 1;
            var c = this.state;
            return this.isStanding() ? (this.setSprite(this.ff.dragged), this.down = 0) : c == this.ff.rise ? this.setSprite(this.ff.rise[2]) : c == this.ff.fall || c != this.ff.sleep && !this.down && c != this.ff.floor ? c == this.ff.fall ? this.setSprite(this.ff.fall[this.framenum]) : c == this.ff.beginfall ? this.framenum > 4 ? this.setSprite(this.ff.beginfall[5]) : this.framenum > 2 ? this.setSprite(this.ff.sleep[0]) : this.setSprite(this.ff.rise[2]) : this.setSprite(this.ff.rise[2]) : (this.setSprite(this.ff.sleep[0]), this.down = 1), c != this.ff.fall ? this.state = this.recoveryTime != 1 / 0 ? this.ff.dragged : this.ff.sleep : this.state = this.ff.fall, this.mOff.x = a - this.elem.e.cssNumber("left"), this.mOff.y = b - this.elem.e.cssNumber("top"), this.elem.e.removeClass("mass"), this.v.y = 0, dbTxt(11, this.mOff.x + "  ||  " + this.mOff.y), !1
        },
        mouseUp: function() {
            this.dragged && this.v.set(.8 * mouse.v.x, .8 * mouse.v.y), this.dragged = 0, this.elem.e.addClass("mass")
        },
        setSprite: function(a) {
            var b = new vec2(a[0], a[1]);
            b.mulV(this.dim), b.mul(-1, -1), this.elem.e.css("background-position", b.toPx())
        },
        isStanding: function() {
            var a = this.state,
                b = a == this.ff.idle || a == this.ff.seek || a == this.ff.turn || a == this.ff.tocen;
            return b |= a == this.ff.tosid || a == this.ff.walk || a == this.ff.dragged, b |= a == this.ff.prepjumpside || a == this.ff.prepjumpup || a == this.ff.jumpside, b |= a == this.ff.jumpup
        },
        state_name: function(a) {
            if (this.recoveryTime === 1 / 0) return "DEAD";
            switch (a) {
                case this.ff.idle:
                    return "IDLE";
                case this.ff.seek:
                    return "SEEK UPWARDS";
                case this.ff.turn:
                    return "SEEK SIDEWAYS";
                case this.ff.walk:
                    return "WALK";
                case this.ff.fall:
                    return "FALLING";
                case this.ff.floor:
                    return "HITTING THE FLOOR";
                case this.ff.sleep:
                    return "SLEEP";
                case this.ff.tosid:
                    return "TURNING TO SIDE";
                case this.ff.tocen:
                    return "TURNING TO CENTER";
                case this.ff.rise:
                    return "RISING";
                case this.ff.dragged:
                    return "DRAGGED";
                case this.ff.beginfall:
                    return "BEGIN FALL";
                case this.ff.prepjumpside:
                    return "PREPARE SIDE JUMP";
                case this.ff.jumpside:
                    return "SIDE JUMP";
                case this.ff.prepjumpup:
                    return "PREPARE VERTICAL JUMP";
                case this.ff.jumpup:
                    return "VERTICAL JUMP"
            }
        },
        dirsign: function(a) {
            this.dir = Math.sign(a)
        },
        forceflip: function(a) {
            1 == a ? $("#figure").removeClass("flip") : -1 == a && $("#figure").addClass("flip")
        },
        die: function() {
            if (this.setSprite(this.ff.sleep), this.recoveryTime != 1 / 0) switch (this.skin) {
                case 0:
                    alert("you are a monster."), $("#figure").text("DEAD.");
                    break;
                case 1:
                    alert("reimu's fed up with your nonsense.")
            }
            this.animate = 0, this.hurt = 1 / 0, this.recoveryTime = 1 / 0
        },
        ground: function(a) {
            var b = this.state;
            return b == this.ff.fall || b == this.ff.beginfall || b == this.ff.jumpside || b == this.ff.jumpup ? this.hitFloor() : b == this.ff.dragged && this.setIdle(), this.animate = 1, this.airborne = 0, this.v.y = 0, this.r.y = a, a
        },
        setskin: function(a) {
            switch (this.skin = a, a) {
                case 0:
                    this.elem.e.css("background", "url(https://111yp.github.io/web-snail/fig/fn0.png)");
                    break;
                case 1:
                    figur.elem.e.css("background", "url(https://111yp.github.io/web-snail/fig/fn0.png)")
            }
        }
    },
    texs_sm = 0;
$(document).ready(function() {
    figur.initialize(), 0 != window.fskin && figur.setskin(window.fskin), figur.beginfall(), $("#testbed").length && (DEBUG = !0), $(this).keydown(function(a) {
        var b = a.which;
        82 == b && 0 == texs_sm || 69 == b && 1 == texs_sm || 73 == b && 2 == texs_sm || 77 == b && 3 == texs_sm ? texs_sm++ : 85 == b && 4 == texs_sm ? figur.setskin(1) : texs_sm = 82 == b ? 1 : 0, 68 == b && (a.preventDefault(), $(".debug *").length && 68 == a.which && (DEBUG ? (DEBUG = 0, $(".debug *").text("")) : DEBUG = 1))
    })
}), document.onmousemove = function(a) {
    if (mouse.v.set(a.pageX - mouse.r.x, a.pageY - mouse.r.y), mouse.r.set(a.pageX, a.pageY), figur.dragged) {
        var b = Vector.diff(mouse.r, figur.mOff);
        figur.forceflip(trigger(mouse.v.x, 5)), $("#figure").css({
            top: b.y + "px",
            left: b.x + "px"
        }), b.y += $(document).scrollTop(), figur.r.setV(b), dbTxt(4, "DRAG @@ " + b.toString() + " X> " + figur.mOff.toString())
    }
    dbTxt(1, mouse.r.toString() + " ** " + mouse.v.toString())
}, document.onmousedown = function(a) {
    inBounds(figur, a.pageX, a.pageY) ? (dbTxt(4, "ON"), clearTimeout(queueEvent), figur.mouseDown(a.pageX, a.pageY)) : dbTxt(4, "OFF")
}, document.onmouseup = function(a) {
    dbTxt(4, "OFF"), figur.mouseUp()
};
var file = "https://111yp.github.io/web-snail/quotes.txt";
var list = [];
var textLength = 0;
$.get(file,function(txt){
    var lines = txt.split("\n");
    for (var i = 0, len = lines.length; i < len; i++) 
	{
		textLength = len;
		list.push(lines[i]);
    }
}); 
function generateText(){
	var text = list[Math.floor(Math.random() * Math.floor(textLength))];
    	var elem = document.createElement("generatedText");
    	elem.textContent = text;
    	elem.style.position = "absolute";
	elem.style.left = figur.elem.getLeft() + Math.round(Math.random()* 125) + "px";
    	elem.style.top = figur.r.y + "px";
	document.body.appendChild(elem);
	setTimeout(function(){
	$('generatedText').remove();
	}, 3000);
}
function doStuff() {
   generateText();
   setTimeout(doStuff, 5000);
}
setTimeout(doStuff, 5000);



