/// <reference path="input.ts"/>
/// <reference path="graphics.ts"/>
/// <reference path="tile.ts"/>
/// <reference path="game_objects.ts"/>
/// <reference path="ECS.ts"/>
/// <reference path="systems.ts"/>
var Game = (function () {
    function Game(screen) {
        this.entities = [];
        this.state = "MainMenu";
        this.change = true;
        this.clearScreen = true;
        this.then = performance.now();
        console.log("Setting up screen");
        this.screen = screen;
        this.ctx = screen.getContext('2d');
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
    }
    Game.prototype.init = function () {
        console.log("Initializing...");
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "pieces", 8, 0, new Dimension(1, 1)));
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "board", 8, 0, new Dimension(1, 1), new Point(0, 8)));
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "numbers", 8, 0, new Dimension(10, 1), new Point(0, 16)));
        Level.defaultTileSet = new TileSet(SpriteSheetCache.spriteSheet("board"));
        this.World = new Level();
        this.pEntity = new Entity();
        this.pEntity.addComponent(new InputComponent());
        this.pEntity.addComponent(new MovementComponent());
        this.pEntity.addComponent(new AudioComponent('boop3.wav'));
        this.pEntity.addComponent(new LevelComponent(this.World));
        this.pEntity.addComponent(new PositionComponent(1, 1));
        this.pEntity.addComponent(new AABBComponent(8, 8));
        this.pEntity.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("pieces").sprites[0]));
        for (var i = 0; i < 30; i++) {
            var temp = new Entity();
            temp.addComponent(new PositionComponent(i + 1, 3));
            temp.addComponent(new AABBComponent(8, 8));
            temp.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("numbers").sprites[i % 10]));
            this.entities.push(temp);
        }
        for (var i = 0; i < 15; i++) {
            var temp = new Entity();
            temp.addComponent(new PositionComponent(((Math.random() * 28) | 0) + 1, ((Math.random() * 23) | 0) + 1));
            temp.addComponent(new LevelComponent(this.World));
            temp.addComponent(new AABBComponent(8, 8));
            temp.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("pieces").sprites[0]));
            this.World.entities.push(temp);
        }
    };
    Game.prototype.update = function (delta) {
        switch (this.state) {
            case "MainMenu":
                this.state = "GameMaze";
                break;
            case "GameMaze":
                input(this.pEntity);
                if (this.pEntity["movement"].x != 0 || this.pEntity["movement"].y != 0)
                    collision(this.pEntity);
                movementSound(this.pEntity);
                movement(this.pEntity);
                break;
            case "GameMenu":
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
            case "GameMenu":
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
                if (this.pEntity["sprite"].redraw || this.change) {
                    this.World.map.draw(this.ctx);
                    draw(this.ctx, this.pEntity);
                    for (var _b = 0, _c = this.World.entities; _b < _c.length; _b++) {
                        var entity = _c[_b];
                        draw(this.ctx, entity);
                    }
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
        game.run();
    });
};
