/// <reference path="input.ts"/>
/// <reference path="graphics.ts"/>
/// <reference path="tile.ts"/>
/// <reference path="game_objects.ts"/>
/// <reference path="ECS.ts"/>
/// <reference path="systems.ts"/>
var Game = (function () {
    function Game(screen) {
        this.entities = [];
        this.change = true;
        this.redraw = true;
        this.clearScreen = true;
        this.then = performance.now();
        this.timePaused = 0;
        this.deltaPaused = 0;
        console.log("Setting up screen");
        this.screen = screen;
        this.ctx = screen.getContext('2d');
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
    }
    Game.prototype.makeGEntity = function (x, y, sprite, colType) {
        var e = new Entity();
        e.add(new PositionC(x, y));
        e.add(new AABBC(8, 8));
        e.add(new MovementC());
        e.add(new CollisionC(colType));
        e.add(new LevelC(this.World));
        e.add(new SpriteC(sprite));
        return e;
    };
    Game.prototype.init = function () {
        console.log("Initializing...");
        SSC.storeSheet(new SpriteSheet("sheet", "pieces", 8, 0, new Dm(5, 1)));
        SSC.storeSheet(new SpriteSheet("sheet", "board", 8, 0, new Dm(5, 1), new Pt(40, 0)));
        SSC.storeSheet(new SpriteSheet("sheet", "numbers", 8, 0, new Dm(10, 1), new Pt(0, 8)));
        SSC.storeSheet(new SpriteSheet("sheet", "alpha", 8, 0, new Dm(10, 3), new Pt(0, 16)));
        Level.defaultTileSet = new TileSet(SSC.spriteSheet("board"));
        this.World = new Level();
        {
            var e = this.pEntity = this.makeGEntity(1, 1, SSC.spriteSheet("pieces").sprites[0], CollisionTypes.WORLD);
            e.add(new InputC(true));
            e.add(new HauntC());
            e.add(new PlayerC());
            e.add(new AudioC('gblip.wav'));
            this.World.entities.push(e);
        }
        {
            var e = this.hEntity = this.makeGEntity(1, this.World.map.size.height - 2, SSC.spriteSheet("pieces").sprites[1], CollisionTypes.ENTITY);
            e.add(new AudioC('hstep.wav'));
            e.add(new CombatC());
            e.add(new AIHeroC(this.World.AIPath));
            this.World.entities.push(e);
        }
        for (var i = 0; i < 5; i++) {
            var pos = this.World.eSpawns.splice(getRandomInt((((this.World.eSpawns.length - 1) / 2) | 0), this.World.eSpawns.length - 1), 1)[0];
            var e = this.makeGEntity(pos.x, pos.y, SSC.spriteSheet("pieces").sprites[2], CollisionTypes.ENTITY);
            e.add(new InputC(false));
            e.add(new CombatC());
            e.add(new AudioC('gblip.wav'));
            this.World.entities.push(e);
        }
        for (var i = 0; i < 5; i++) {
            var pos = this.World.eSpawns.splice(getRandomInt(0, (((this.World.eSpawns.length - 1) / 2) | 0)), 1)[0];
            var e = this.makeGEntity(pos.x, pos.y, SSC.spriteSheet("pieces").sprites[3], CollisionTypes.ENTITY);
            e.add(new InputC(false));
            e.add(new CombatC());
            e.add(new AudioC('gblip.wav'));
            this.World.entities.push(e);
        }
        {
            var e = this.makeGEntity(23, 1, SSC.spriteSheet("pieces").sprites[4], CollisionTypes.ENTITY);
            e.add(new BossC());
            this.World.entities.push(e);
        }
        this.state = "MainMenu";
    };
    Game.prototype.update = function (delta) {
        switch (this.state) {
            case "MainMenu":
                this.state = "GameMaze";
                break;
            case "GameMaze":
                if (this.deltaPaused > 0) {
                    delta -= this.deltaPaused;
                    if (delta < 0)
                        delta = 0;
                    this.deltaPaused = 0;
                }
                for (var _i = 0, _a = this.World.entities; _i < _a.length; _i++) {
                    var e = _a[_i];
                    combat(e);
                    AIMovement(e, delta);
                    input(e, delta);
                    haunt(e);
                    if (e["mv"] && (e["mv"].x != 0 || e["mv"].y != 0))
                        collision(e);
                    movementSound(e);
                    movement(e);
                }
                break;
            case "GamePause":
                break;
            case "GameOver":
                this.state = "MainMenu";
                break;
            default:
                break;
        }
    };
    Game.prototype.draw = function () {
        switch (this.state) {
            case "MainMenu":
                break;
            case "GameMaze":
                if (this.clearScreen) {
                    this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
                    this.clearScreen = false;
                }
                for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
                    var entity = _a[_i];
                    if (entity["sprite"].redraw) {
                        draw(this.ctx, entity);
                    }
                }
                for (var _b = 0, _c = this.World.entities; _b < _c.length; _b++) {
                    var entity = _c[_b];
                    if (entity["sprite"] && entity["sprite"].redraw === true)
                        this.redraw = true;
                }
                if (this.redraw || this.change) {
                    this.World.map.draw(this.ctx);
                    for (var _d = 0, _e = this.World.entities; _d < _e.length; _d++) {
                        var entity = _e[_d];
                        draw(this.ctx, entity);
                    }
                    draw(this.ctx, this.pEntity);
                    this.change = false;
                    this.redraw = false;
                }
                break;
            case "GamePause":
                if (this.change) {
                    this.ctx.globalAlpha = 0.7;
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect(0, 0, this.screen.width, this.screen.height);
                    this.ctx.globalAlpha = 1.0;
                    this.ctx.font = "18px Verdana";
                    this.ctx.textAlign = "center";
                    this.ctx.fillStyle = "white";
                    this.ctx.fillText('PAUSED', ((this.screen.width / 2) | 0), ((this.screen.height / 2) | 0));
                    this.change = false;
                }
                break;
            case "GameOver":
                break;
            default:
                break;
        }
    };
    Game.prototype.render = function () {
        var now = performance.now();
        var delta = (now - this.then);
        this.then = now;
        this.update(delta);
        this.draw();
        this._loopHandle = window.requestAnimationFrame(this.render.bind(this));
    };
    Game.prototype.run = function () {
        console.log("Game running");
        this._loopHandle = window.requestAnimationFrame(this.render.bind(this));
    };
    Game.prototype.stop = function () {
        console.log("Game stopped");
        window.cancelAnimationFrame(this._loopHandle);
    };
    Game.prototype.pause = function () {
        if (this.state === "GameMaze") {
            this.state = "GamePause";
            this.change = true;
            this.timePaused = performance.now();
        }
    };
    Game.prototype.unpause = function () {
        if (this.state === "GamePause") {
            this.state = "GameMaze";
            this.change = this.clearScreen = true;
            this.deltaPaused = performance.now() - this.timePaused;
            this.timePaused = 0;
        }
    };
    return Game;
})();
function onResize() {
    var canvas = document.getElementById("gameCanvas");
    var scaleX = window.innerWidth / canvas.width;
    var scaleY = window.innerHeight / canvas.height;
    var scaleToFit = Math.min(scaleX, scaleY) | 0;
    scaleToFit = (scaleToFit <= 0) ? 1 : scaleToFit;
    var size = [canvas.width * scaleToFit, canvas.height * scaleToFit];
    var offset = this.offset = [(window.innerWidth - size[0]) / 2, (window.innerHeight - size[1]) / 2];
    var stage = document.getElementById("stage");
    var rule = "translate(" + offset[0] + "px, " + offset[1] + "px) scale(" + scaleToFit + ")";
    stage.style.transform = rule;
    stage.style.webkitTransform = rule;
}
window.onload = function () {
    onResize();
    window.addEventListener('resize', onResize, false);
    window.onkeydown = Input.KB.keyDown;
    window.onkeyup = Input.KB.keyUp;
    var game = new Game(document.getElementById("gameCanvas"));
    ImageCache.Loader.add("sheet", "sheet.png");
    ImageCache.Loader.load(function () {
        game.init();
        window.onblur = game.pause.bind(game);
        window.onfocus = game.unpause.bind(game);
        game.run();
    });
};
