/// <reference path="graphics.ts"/>
/// <reference path="tile.ts"/>
/// <reference path="ECS.ts"/>
/// <reference path="systems.ts"/>

module Input {
    export module Keyboard {
        export enum KEY {
            A = 65,
            D = 68,
            W = 87,
            S = 83,
            ENTER = 13,
            SPACE = 32
        }

        var _isDown: boolean[] = [];
        var _isUp: boolean[] = [];
        var _wasDown: boolean[] = [];

        for (var i = 0; i < 256; i++) {
            _isUp[i] = true;
        }

        export function isDown(keyCode: KEY) {
            return (_isDown[keyCode]);
        }

        export function wasDown(keyCode: KEY) {
            var result = _wasDown[keyCode];
            _wasDown[keyCode] = false;
            return (result);
        }

        export function keyDown(event: any) {
            var keyCode = event.which;

            _isDown[keyCode] = true;
            if (_isUp[keyCode])
                _wasDown[keyCode] = true;

            _isUp[keyCode] = false;
        }

        export function keyUp(event: any) {
            var keyCode = event.which;
            _isDown[keyCode] = false;
            _isUp[keyCode] = true;
        }
    }
}

class Game {
    private _loopHandle: any;

    private ctx: Context2D;
    private screen: HTMLCanvasElement;

    constructor(screen: HTMLCanvasElement) {
        console.log("Setting up screen");
        /** Hook our game up to our canvas "Screen" */
        this.screen = screen;
        this.ctx = <Context2D>screen.getContext('2d');
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
    }

    private pEntity: Entity;
    World: TileMap;

    init(): void {
        console.log("Initializing...");
        /** Initalize Player and World */
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "pieces", 8, 0, new Dimension(1, 1)));
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "board", 8, 0, new Dimension(1, 1), new Point(0, 8)));
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "numbers", 8, 0, new Dimension(10, 1), new Point(0, 16)));

        this.pEntity = new Entity();
        this.pEntity.addComponent(new InputComponent());
        this.pEntity.addComponent(new MovementComponent());
        this.pEntity.addComponent(new PositionComponent(0, 0));
        this.pEntity.addComponent(new AABBComponent(8, 8));
        this.pEntity.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("pieces").sprites[0]));

        this.World = new TileMap(new Dimension(32,30));

        var tileSet = new TileSet(SpriteSheetCache.spriteSheet("board"));
        this.World.setTileSet(tileSet);
        this.World.generateTest();
    }

    /** Update */
    update(delta: number): void {
        input(this.pEntity);
        collision(this.pEntity, this.World);
        movement(this.pEntity);
    }

    /** Draw */
    change: boolean = true;
    clearScreen: boolean = true;
    draw(): void {
        if (this.clearScreen) {
            this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
            this.clearScreen = false;
        }
        if (this.pEntity["sprite"].redraw || this.change) {
            this.World.draw(this.ctx);
            draw(this.ctx, this.pEntity);
            this.change = false;
        }
    }

    /** Render/Main Game Loop */
    private then: number = performance.now();
    render(): void {
        var now = performance.now();
        var delta = (now - this.then);
        this.then = now;
        this.update(delta);
        this.draw();
        this._loopHandle = window.requestAnimationFrame(this.render.bind(this));
    }

    /** Start and Stop */
    run(): void {
        console.log("Game running");
        this._loopHandle = window.requestAnimationFrame(this.render.bind(this));
    }
    stop(): void {
        console.log("Game stopped")
        window.cancelAnimationFrame(this._loopHandle);
    }
}

function onResize() {
    var canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
    var scaleX = window.innerWidth / canvas.width;
    var scaleY = window.innerHeight / canvas.height;
    var scaleToFit = Math.min(scaleX, scaleY) | 0;
    scaleToFit = (scaleToFit <= 0) ? 1 : scaleToFit;
    var size = [canvas.width * scaleToFit, canvas.height * scaleToFit];

    var offset = this.offset = [(window.innerWidth - size[0]) / 2, (window.innerHeight - size[1]) / 2];

    var stage = <HTMLCanvasElement>document.getElementById("stage");
    var rule = "translate(" + offset[0] + "px, " + offset[1] + "px) scale(" + scaleToFit + ")";
    stage.style.transform = rule;
    stage.style.webkitTransform = rule;
}

window.onload = () => {
    onResize();
    window.addEventListener('resize', onResize, false);
    window.onkeydown = Input.Keyboard.keyDown;
    window.onkeyup = Input.Keyboard.keyUp;

    var game = new Game(<HTMLCanvasElement>document.getElementById("gameCanvas"));
    ImageCache.Loader.add("sheet", "sheet.png");
    ImageCache.Loader.load(function() {
        game.init();
        game.run();
    })
};
