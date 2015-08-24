var Input;
(function (Input) {
    var Keyboard;
    (function (Keyboard) {
        (function (KEY) {
            KEY[KEY["A"] = 65] = "A";
            KEY[KEY["D"] = 68] = "D";
            KEY[KEY["W"] = 87] = "W";
            KEY[KEY["S"] = 83] = "S";
            KEY[KEY["ENTER"] = 13] = "ENTER";
            KEY[KEY["SPACE"] = 32] = "SPACE";
        })(Keyboard.KEY || (Keyboard.KEY = {}));
        var KEY = Keyboard.KEY;
        var _isDown = [];
        var _isUp = [];
        var _wasDown = [];
        for (var i = 0; i < 256; i++) {
            _isUp[i] = true;
        }
        function isDown(keyCode) {
            return (_isDown[keyCode]);
        }
        Keyboard.isDown = isDown;
        function wasDown(keyCode) {
            var result = _wasDown[keyCode];
            _wasDown[keyCode] = false;
            return (result);
        }
        Keyboard.wasDown = wasDown;
        function keyDown(event) {
            var keyCode = event.which;
            _isDown[keyCode] = true;
            if (_isUp[keyCode])
                _wasDown[keyCode] = true;
            _isUp[keyCode] = false;
        }
        Keyboard.keyDown = keyDown;
        function keyUp(event) {
            var keyCode = event.which;
            _isDown[keyCode] = false;
            _isUp[keyCode] = true;
        }
        Keyboard.keyUp = keyUp;
    })(Keyboard = Input.Keyboard || (Input.Keyboard = {}));
})(Input || (Input = {}));

var Pt = (function () {
    function Pt(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Pt.from = function (x, y) {
        return new Pt(x, y);
    };
    return Pt;
})();
var Dm = (function () {
    function Dm(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.width = width;
        this.height = height;
    }
    Dm.from = function (width, height) {
        return new Dm(width, height);
    };
    return Dm;
})();
var Tile = (function () {
    function Tile(texture) {
        this.texture = texture;
        this.size = new Dm(texture.width, texture.height);
    }
    Tile.prototype.draw = function (ctx, x, y) {
        ctx.drawImage(this.texture, 0, 0, this.size.width, this.size.height, x, y, this.size.width, this.size.height);
    };
    return Tile;
})();
var SpriteSheet = (function () {
    function SpriteSheet(imageName, sheetName, ts, gutter, ss, offset) {
        if (gutter === void 0) { gutter = 0; }
        if (ss === void 0) { ss = new Dm(0, 0); }
        if (offset === void 0) { offset = new Pt(0, 0); }
        this.sprites = [];
        this.name = sheetName;
        this.offset = offset;
        this.ss = ss;
        this.ts = ts;
        this.gutter = gutter;
        this.image = ImageCache.getTexture(imageName);
        this.storeSprites();
    }
    SpriteSheet.prototype.storeSprites = function (callback) {
        if (callback === void 0) { callback = null; }
        this.spritesPerRow = ((this.ss.width === 0 || this.ss.height === 0) ? (this.image.width / this.ts) : this.ss.width);
        this.spritesPerCol = ((this.ss.width === 0 || this.ss.height === 0) ? (this.image.height / this.ts) : this.ss.height);
        var sprite;
        for (var y = 0; y < this.spritesPerCol; y++) {
            for (var x = 0; x < this.spritesPerRow; x++) {
                sprite = this.sprites[x + (y * this.spritesPerRow)] = document.createElement('canvas');
                sprite.width = this.ts;
                sprite.height = this.ts;
                sprite.getContext('2d').drawImage(this.image, ((this.ts + this.gutter) * x) + this.offset.x, ((this.ts + this.gutter) * y) + this.offset.y, this.ts, this.ts, 0, 0, this.ts, this.ts);
            }
        }
    };
    return SpriteSheet;
})();
var SpriteSheetCache;
(function (SpriteSheetCache) {
    var sheets = {};
    function storeSheet(sheet) {
        sheets[sheet.name] = sheet;
    }
    SpriteSheetCache.storeSheet = storeSheet;
    function spriteSheet(name) {
        return sheets[name];
    }
    SpriteSheetCache.spriteSheet = spriteSheet;
})(SpriteSheetCache || (SpriteSheetCache = {}));
var ImageCache;
(function (ImageCache) {
    var cache = {};
    function getTexture(name) {
        return cache[name];
    }
    ImageCache.getTexture = getTexture;
    var toLoad = {};
    var loadCount = 0;
    var Loader;
    (function (Loader) {
        function add(name, url) {
            toLoad[name] = url;
            loadCount++;
        }
        Loader.add = add;
        function load(callback) {
            var async = { counter: 0, loadCount: 0, callback: callback };
            var done = function (async) { if ((async.counter++) === async.loadCount) {
                async.callback();
            } };
            for (var img in toLoad) {
                cache[img] = new Image();
                cache[img].src = toLoad[img];
                cache[img].onload = done.bind(this, async);
                delete toLoad[img];
            }
            loadCount = 0;
        }
        Loader.load = load;
    })(Loader = ImageCache.Loader || (ImageCache.Loader = {}));
})(ImageCache || (ImageCache = {}));
var AudioPool = (function () {
    function AudioPool(sound, maxSize) {
        if (maxSize === void 0) { maxSize = 1; }
        this.pool = [];
        this.index = 0;
        this.maxSize = maxSize;
        for (var i = 0; i < this.maxSize; i++) {
            this.pool[i] = new Audio(sound);
            this.pool[i].load();
        }
    }
    AudioPool.prototype.play = function () {
        if (this.pool[this.index].currentTime == 0 || this.pool[this.index].ended) {
            this.pool[this.index].play();
        }
        this.index = (this.index + 1) % this.maxSize;
    };
    return AudioPool;
})();

/// <reference path="graphics.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VTile = (function (_super) {
    __extends(VTile, _super);
    function VTile(texture, walkable) {
        if (walkable === void 0) { walkable = false; }
        _super.call(this, texture);
        this.walkable = walkable;
    }
    return VTile;
})(Tile);
var TileSet = (function () {
    function TileSet(sheet) {
        this.tiles = [];
        this.ts = sheet.ts;
        for (var i = 0; i < sheet.sprites.length; i++) {
            this.tiles.push(new VTile(sheet.sprites[i]));
        }
        this.tiles[0].walkable = true;
    }
    return TileSet;
})();
var TileMap = (function () {
    function TileMap(size, pos) {
        if (size === void 0) { size = new Dm(1, 1); }
        if (pos === void 0) { pos = new Pt(0, 0); }
        this.cached = false;
        this.size = size;
        this.pos = pos;
        this.tiles = [];
        this.cache = document.createElement('canvas');
    }
    TileMap.prototype.setTile = function (x, y, value) {
        this.tiles[x + (y * this.size.width)] = value;
    };
    TileMap.prototype.getTile = function (x, y) {
        if (x == this.size.width || x < 0 || y == this.size.height || y < 0)
            return undefined;
        var tileVal = this.tiles[x + (y * this.size.width)];
        return (new MetaTile(this.tileSet.tiles[tileVal], x, y, tileVal));
    };
    TileMap.prototype.setTileSet = function (set) {
        this.tileSet = set;
    };
    TileMap.prototype.draw = function (ctx) {
        var externalCTX = ctx;
        if (!this.cached) {
            this.cache.width = this.size.width * 8;
            this.cache.height = this.size.height * 8;
            ctx = this.cache.getContext('2d');
            for (var y = 0; y < this.size.height; y++) {
                for (var x = 0; x < this.size.width; x++) {
                    this.getTile(x, y).draw(ctx, x * 8, y * 8);
                }
            }
            this.cached = true;
        }
        externalCTX.drawImage(this.cache, this.pos.x, this.pos.y);
    };
    return TileMap;
})();

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MetaTile = (function (_super) {
    __extends(MetaTile, _super);
    function MetaTile(tile, x, y, value) {
        _super.call(this, tile.texture, tile.walkable);
        this.value = value;
        this.x = x;
        this.y = y;
        this.xd = 0;
        this.yd = 0;
    }
    return MetaTile;
})(VTile);
var Level = (function () {
    function Level(map) {
        if (map === void 0) { map = new TileMap(Dm.from(25, 25), Pt.from(8, 32)); }
        this.validEnemySpawns = [];
        this.map = map;
        this.map.setTileSet(Level.defaultTileSet);
        this.generateLevel();
        this.entities = [];
    }
    Level.prototype.getWall = function (px, py, x, y) {
        var tile = this.map.getTile(x, y);
        if (tile && tile.value === 1) {
            tile.xd = (x - px);
            tile.yd = (y - py);
            return tile;
        }
        return undefined;
    };
    Level.prototype.getWalls = function (x, y) {
        var result = [];
        var t1 = this.getWall(x, y, x, y - 1);
        if (t1)
            result.push(t1);
        var t2 = this.getWall(x, y, x, y + 1);
        if (t2)
            result.push(t2);
        var t3 = this.getWall(x, y, x - 1, y);
        if (t3)
            result.push(t3);
        var t4 = this.getWall(x, y, x + 1, y);
        if (t4)
            result.push(t4);
        return result;
    };
    Level.prototype.generateLevel = function () {
        for (var i = 0; i < (this.map.size.width * this.map.size.height); i++) {
            this.map.tiles[i] = 1;
        }
        for (var i = 0; i < this.map.size.width; i++) {
            this.map.tiles[i] = this.map.tiles[this.map.tiles.length - 1 - i] = 2;
        }
        for (var i = 1; i < this.map.size.height - 1; i++) {
            this.map.tiles[this.map.size.width * i] = this.map.tiles[(this.map.size.width * (i + 1)) - 1] = 2;
        }
        var seed = Pt.from(1, 1);
        var currentTile = this.map.getTile(seed.x, seed.y);
        currentTile.value = 0;
        this.map.setTile(currentTile.x, currentTile.y, 0);
        var walls = [];
        do {
            if (currentTile)
                walls = walls.concat(this.getWalls(currentTile.x, currentTile.y));
            var wallIndex = ((Math.random() * walls.length) | 0);
            var tileToCheck = walls[wallIndex];
            var nextTile = this.map.getTile(tileToCheck.x + tileToCheck.xd, tileToCheck.y + tileToCheck.yd);
            if (nextTile && (nextTile.value === 1)) {
                nextTile.value = 0;
                this.map.setTile(nextTile.x, nextTile.y, 0);
                tileToCheck.value = 0;
                this.map.setTile(tileToCheck.x, tileToCheck.y, 0);
                currentTile = this.map.getTile(nextTile.x, nextTile.y);
            }
            else {
                tileToCheck.value = 3;
                this.map.setTile(tileToCheck.x, tileToCheck.y, 3);
                currentTile = undefined;
            }
            walls = walls.filter(function (obj, index, array) { return (obj.value === 1); });
        } while (walls.length != 0);
    };
    Level.prototype.generatePath = function () {
    };
    Level.prototype.setSpawns = function () {
    };
    return Level;
})();

/// <reference path="game_objects.ts"/>
var Entity = (function () {
    function Entity() {
        this._count = 0;
        this.components = {};
        this.id = Entity.autoID++;
    }
    Entity.prototype.add = function (c) {
        if (!this.components[c.name])
            this._count++;
        this.components[c.name] = c;
        this[c.name] = this.components[c.name];
    };
    Entity.autoID = 0;
    return Entity;
})();
var PositionC = (function () {
    function PositionC(x, y) {
        this.name = "pos";
        this.x = x;
        this.y = y;
    }
    return PositionC;
})();
var AABBC = (function () {
    function AABBC(width, height) {
        this.name = "aabb";
        this.width = width;
        this.height = height;
    }
    return AABBC;
})();
var SpriteC = (function () {
    function SpriteC(image) {
        this.name = "sprite";
        this.redraw = true;
        this.image = image;
    }
    return SpriteC;
})();
var LevelC = (function () {
    function LevelC(level) {
        this.name = "level";
        this.level = level;
    }
    return LevelC;
})();
var LayerC = (function () {
    function LayerC(layer) {
        if (layer === void 0) { layer = 0; }
        this.name = "layer";
        this.layer = layer;
    }
    return LayerC;
})();
var AudioC = (function () {
    function AudioC(sound) {
        this.name = "audio";
        this.sound = new AudioPool(sound, 3);
    }
    return AudioC;
})();
var MovementC = (function () {
    function MovementC() {
        this.name = "movement";
        this.x = 0;
        this.y = 0;
    }
    return MovementC;
})();
var CollisionTypes;
(function (CollisionTypes) {
    CollisionTypes[CollisionTypes["ENTITY"] = 0] = "ENTITY";
    CollisionTypes[CollisionTypes["LEVEL"] = 1] = "LEVEL";
})(CollisionTypes || (CollisionTypes = {}));
var CollisionC = (function () {
    function CollisionC(type) {
        if (type === void 0) { type = CollisionTypes.LEVEL; }
        this.name = "collision";
        this.type = type;
    }
    return CollisionC;
})();
var PlayerC = (function () {
    function PlayerC() {
        this.name = "player";
        this.value = true;
    }
    return PlayerC;
})();
var CombatC = (function () {
    function CombatC() {
        this.name = "combat";
        this.alive = true;
    }
    return CombatC;
})();
var InputC = (function () {
    function InputC() {
        this.name = "input";
        this.value = true;
    }
    return InputC;
})();
var AIHeroC = (function () {
    function AIHeroC() {
        this.name = "aihero";
        this.movementCooldown = 1000;
        this.value = true;
    }
    return AIHeroC;
})();

/// <reference path="ECS.ts"/>
function draw(ctx, e) {
    var offsetX = 0, offsetY = 0;
    if (e["level"]) {
        offsetX = e["level"].level.map.pos.x;
        offsetY = e["level"].level.map.pos.y;
    }
    ctx.drawImage(e["sprite"].image, 0, 0, e["aabb"].width, e["aabb"].height, e["pos"].x * e["sprite"].image.width + offsetX, e["pos"].y * e["sprite"].image.height + offsetY, e["aabb"].width, e["aabb"].height);
    e["sprite"].redraw = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
}
function input(e) {
    if (Input.Keyboard.wasDown(Input.Keyboard.KEY.D)) {
        e["movement"].x = 1;
    }
    if (Input.Keyboard.wasDown(Input.Keyboard.KEY.A)) {
        e["movement"].x = -1;
    }
    if (Input.Keyboard.wasDown(Input.Keyboard.KEY.W)) {
        e["movement"].y = -1;
    }
    if (Input.Keyboard.wasDown(Input.Keyboard.KEY.S)) {
        e["movement"].y = 1;
    }
}
function collision(e) {
    if (e["level"] && e["collision"]) {
        var tile = e["level"].level.map.getTile(e["pos"].x + e["movement"].x, e["pos"].y + e["movement"].y);
        if (!tile || !tile.walkable) {
            e["movement"].x = 0;
            e["movement"].y = 0;
        }
        else if (e["collision"].type == CollisionTypes.ENTITY) {
            var occupied = false;
            var o_entity;
            for (var _i = 0, _a = e["level"].level.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                occupied = occupied || ((entity["pos"].x == (e["pos"].x + e["movement"].x))
                    && (entity["pos"].y == (e["pos"].y + e["movement"].y))
                    && (entity["collision"]));
                if (occupied) {
                    o_entity = entity;
                    break;
                }
            }
            if (occupied) {
                e["movement"].x = 0;
                e["movement"].y = 0;
                if (e["combat"]) {
                    e["combat"].target = o_entity;
                    console.log(e["combat"].target);
                }
            }
        }
    }
}
function combat(e) {
    if (e["combat"] && e["combat"].target && e["combat"].target["combat"]) {
        if (!e["combat"].target["combat"].alive) {
            e["combat"].target = undefined;
        }
        else {
        }
    }
    else {
        e["combat"].target = undefined;
    }
}
function AIMovement(e) {
    if (e["combat"] && e["combat"].target) {
        return;
    }
    else if (e["aihero"] && e["aihero"].movementCooldown <= 0) {
        e["aihero"].movementCooldown += 1000;
        if (e["movement"]) {
            if (((Math.random() * 2) | 0) === 0)
                e["movement"].x = ((Math.random() * 2) | 0) === 0 ? -1 : 1;
            else
                e["movement"].y = ((Math.random() * 2) | 0) === 0 ? -1 : 1;
        }
    }
    if (e["AIPath"] && e["AIPath"].ready) {
    }
}
function movement(e) {
    if (e["movement"] && (e["movement"].x != 0 || e["movement"].y != 0)) {
        e["pos"].x += e["movement"].x;
        e["pos"].y += e["movement"].y;
        e["movement"].x = e["movement"].y = 0;
        e["sprite"].redraw = true;
    }
}
function movementSound(e) {
    if (e["audio"] && e["movement"] && (e["movement"].x != 0 || e["movement"].y != 0)) {
        e["audio"].sound.play();
    }
}

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
