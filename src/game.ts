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
    private hEntity: Entity;
    private entities: Entity[] = [];
    World: Level;

    makeGEntity(x: number, y: number, sprite: HTMLCanvasElement, colType: CollisionTypes): Entity {
        var e: Entity = new Entity();
        e.add(new PositionC(x, y));
        e.add(new AABBC(8, 8));
        e.add(new MovementC());
        e.add(new CollisionC(colType));
        e.add(new LevelC(this.World));
        e.add(new SpriteC(sprite));
        return e;
    }

    init(): void {
        console.log("Initializing...");
        /** Initalize Player and World */
        SSC.storeSheet(new SpriteSheet("sheet", "pieces", 8, 0, new Dm(5, 1)));
        SSC.storeSheet(new SpriteSheet("sheet", "board", 8, 0, new Dm(5, 1), new Pt(40, 0)));
        SSC.storeSheet(new SpriteSheet("sheet", "numbers", 8, 0, new Dm(10, 1), new Pt(0, 8)));
        SSC.storeSheet(new SpriteSheet("sheet", "alpha", 8, 0, new Dm(10, 3), new Pt(0, 16)));

        Level.defaultTileSet = new TileSet(SSC.spriteSheet("board"));
        // Full screen is 32 x 30
        this.World = new Level();

        { // Player Ghost
            var e: Entity = this.pEntity = this.makeGEntity(1, 1,
                SSC.spriteSheet("pieces").sprites[0], CollisionTypes.WORLD);
            e.add(new InputC(true));
            e.add(new HauntC());
            e.add(new PlayerC());
            e.add(new AudioC('gblip.wav'));
            this.World.entities.push(e);
        }


        { // AI Hero
            var e: Entity = this.hEntity = this.makeGEntity(1, this.World.map.size.height - 2,
                SSC.spriteSheet("pieces").sprites[1], CollisionTypes.ENTITY);
            e.add(new AudioC('hstep.wav'));
            e.add(new CombatC());
            e.add(new AIHeroC(this.World.AIPath));
            this.World.entities.push(e);
        }

        // Weak Monsters
        for (var i: number = 0; i < 5; i++) {
            var pos: Pt = this.World.eSpawns.splice(getRandomInt(0, this.World.eSpawns.length - 1), 1)[0];
            var e: Entity = this.makeGEntity(pos.x, pos.y,
                SSC.spriteSheet("pieces").sprites[2], CollisionTypes.ENTITY);
            e.add(new InputC(false));
            e.add(new CombatC());
            e.add(new AudioC('gblip.wav'));
            this.World.entities.push(e);
        }

        // Strong Monsters
        for (var i: number = 0; i < 5; i++) {
            var pos: Pt = this.World.eSpawns.splice(getRandomInt(0, this.World.eSpawns.length - 1), 1)[0];
            var e: Entity = this.makeGEntity(pos.x, pos.y,
                SSC.spriteSheet("pieces").sprites[3], CollisionTypes.ENTITY);
            e.add(new InputC(false));
            e.add(new CombatC());
            e.add(new AudioC('gblip.wav'));
            this.World.entities.push(e);
        }

        // Boss Monster
        {
            var e: Entity = this.makeGEntity(23, 1,
                SSC.spriteSheet("pieces").sprites[4], CollisionTypes.ENTITY);
            e.add(new BossC());
            this.World.entities.push(e);
        }

        this.state = "MainMenu";
    }

    /** Update */
    private state: string;
    update(delta: number): void {
        switch (this.state) {
            case "MainMenu":
                this.state = "GameMaze";
                break;
            case "GameMaze":
                // Pause delta handling

                if (this.deltaPaused > 0) {
                    delta -= this.deltaPaused;
                    if (delta < 0) delta = 0;
                    this.deltaPaused = 0;
                }

                for (var e of this.World.entities) {
                    combat(e);
                    AIMovement(e, delta);
                    input(e, delta);
                    haunt(e)

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
    }

    /** Draw */
    change: boolean = true;
    redraw: boolean = true;
    clearScreen: boolean = true;
    draw(): void {
        switch (this.state) {
            case "MainMenu":
                break;
            case "GameMaze":
                if (this.clearScreen) {
                    this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
                    this.clearScreen = false;
                }
                for (var entity of this.entities) {
                    if (entity["sprite"].redraw) {
                        draw(this.ctx, entity);
                    }
                }

                for (var entity of this.World.entities) {
                    if (entity["sprite"] && entity["sprite"].redraw === true)
                        this.redraw = true;
                }
                if (this.redraw || this.change) {
                    this.World.map.draw(this.ctx);
                    for (var entity of this.World.entities) {
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

    private timePaused: number = 0;
    private deltaPaused: number = 0;
    pause(): void {
        if (this.state === "GameMaze") {
            this.state = "GamePause";
            this.change = true;
            this.timePaused = performance.now();
        }
    }
    unpause(): void {
        if (this.state === "GamePause") {
            this.state = "GameMaze";
            this.change = this.clearScreen = true;
            this.deltaPaused = performance.now() - this.timePaused;
            this.timePaused = 0;
        }
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
    window.onkeydown = Input.KB.keyDown;
    window.onkeyup = Input.KB.keyUp;

    var game = new Game(<HTMLCanvasElement>document.getElementById("gameCanvas"));
    ImageCache.Loader.add("sheet", "sheet.png");
    ImageCache.Loader.load(function() {
        game.init();
        window.onblur = game.pause.bind(game);
        window.onfocus = game.unpause.bind(game);
        game.run();
    })
};
