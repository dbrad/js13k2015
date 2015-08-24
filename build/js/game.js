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
    Game.prototype.init = function () {
        console.log("Initializing...");
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "pieces", 8, 0, new Dm(10, 1)));
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "board", 8, 0, new Dm(10, 1), new Pt(0, 8)));
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "numbers", 8, 0, new Dm(10, 1), new Pt(0, 16)));
        Level.defaultTileSet = new TileSet(SpriteSheetCache.spriteSheet("board"));
        this.World = new Level();
        {
            var e = this.pEntity = new Entity();
            e.add(new InputC());
            e.add(new MovementC());
            e.add(new CollisionC(CollisionTypes.LEVEL));
            e.add(new AudioC('gblip.wav'));
            e.add(new LevelC(this.World));
            e.add(new PositionC(1, 1));
            e.add(new AABBC(8, 8));
            e.add(new SpriteC(SpriteSheetCache.spriteSheet("pieces").sprites[0]));
            this.pEntity = e;
            this.World.entities.push(this.pEntity);
        }
        {
            var e = this.hEntity = new Entity();
            e.add(new PositionC(1, this.World.map.size.height - 2));
            e.add(new MovementC());
            e.add(new AudioC('hstep.wav'));
            e.add(new CollisionC());
            e.add(new LevelC(this.World));
            e.add(new AABBC(8, 8));
            e.add(new SpriteC(SpriteSheetCache.spriteSheet("pieces").sprites[1]));
            e.add(new CombatC());
            e.add(new AIHeroC());
            this.hEntity = e;
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
                this.hEntity["aihero"].movementCooldown -= delta;
                combat(this.hEntity);
                AIMovement(this.hEntity);
                if (this.hEntity["movement"].x != 0 || this.hEntity["movement"].y != 0)
                    collision(this.hEntity);
                movementSound(this.hEntity);
                movement(this.hEntity);
                input(this.pEntity);
                if (this.pEntity["movement"].x != 0 || this.pEntity["movement"].y != 0)
                    collision(this.pEntity);
                movementSound(this.pEntity);
                movement(this.pEntity);
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
                if (this.pEntity["sprite"].redraw || this.hEntity["sprite"].redraw || this.change) {
                    this.World.map.draw(this.ctx);
                    for (var _b = 0, _c = this.World.entities; _b < _c.length; _b++) {
                        var entity = _c[_b];
                        draw(this.ctx, entity);
                    }
                    draw(this.ctx, this.pEntity);
                    this.change = false;
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
    window.onkeydown = Input.Keyboard.keyDown;
    window.onkeyup = Input.Keyboard.keyUp;
    var game = new Game(document.getElementById("gameCanvas"));
    ImageCache.Loader.add("sheet", "sheet.png");
    ImageCache.Loader.load(function () {
        game.init();
        window.onblur = game.pause.bind(game);
        window.onfocus = game.unpause.bind(game);
        game.run();
    });
};
