/// <reference path="input.ts"/>
/// <reference path="graphics.ts"/>
/// <reference path="tile.ts"/>
/// <reference path="game_objects.ts"/>
/// <reference path="ECS.ts"/>
/// <reference path="systems.ts"/>


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
    private entities: Entity[] = [];
    World: Level;
    testAudio: HTMLAudioElement = new Audio('blip.wav');

    init(): void {
        console.log("Initializing...");
        /** Initalize Player and World */
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "pieces", 8, 0, new Dimension(1, 1)));
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "board", 8, 0, new Dimension(1, 1), new Point(0, 8)));
        SpriteSheetCache.storeSheet(new SpriteSheet("sheet", "numbers", 8, 0, new Dimension(10, 1), new Point(0, 16)));

        Level.defaultTileSet = new TileSet(SpriteSheetCache.spriteSheet("board"));
        // Full screen is 32 x 30
        this.World = new Level();

        this.pEntity = new Entity();
        this.pEntity.addComponent(new InputComponent());
        this.pEntity.addComponent(new MovementComponent());
        this.pEntity.addComponent(new LevelComponent(this.World));
        this.pEntity.addComponent(new PositionComponent(0, 0));
        this.pEntity.addComponent(new AABBComponent(8, 8));
        this.pEntity.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("pieces").sprites[0]));

        for (var i: number = 0; i < 30; i++) {
            var temp = new Entity();
            temp.addComponent(new PositionComponent(i + 1, i % 4));
            temp.addComponent(new AABBComponent(8, 8));
            temp.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("numbers").sprites[i % 10]));
            this.entities.push(temp);
        }

        for (var i: number = 0; i < 25; i++) {
            var temp = new Entity();
            temp.addComponent(new PositionComponent(((Math.random() * 30) | 0), ((Math.random() * 25) | 0)));
            temp.addComponent(new LevelComponent(this.World));
            temp.addComponent(new AABBComponent(8, 8));
            temp.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("pieces").sprites[0]));
            this.World.entities.push(temp);
        }
        
        this.testAudio.play();
    }

    /** Update */
    update(delta: number): void {
        input(this.pEntity);
        if (this.pEntity["movement"].x != 0 || this.pEntity["movement"].y != 0) {
            collision(this.pEntity);
        }
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
        for (var entity of this.entities) {
            if (entity["sprite"].redraw) {
                draw(this.ctx, entity);
            }
        }

        if (this.pEntity["sprite"].redraw || this.change) {
            this.World.tilemap.draw(this.ctx);
            draw(this.ctx, this.pEntity);
            for (var entity of this.World.entities) {
                draw(this.ctx, entity);
            }
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
