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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Context2D = (function (_super) {
    __extends(Context2D, _super);
    function Context2D() {
        _super.apply(this, arguments);
    }
    return Context2D;
})(CanvasRenderingContext2D);
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Point.from = function (x, y) {
        return new Point(x, y);
    };
    return Point;
})();
var Dimension = (function () {
    function Dimension(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.width = width;
        this.height = height;
    }
    Dimension.from = function (width, height) {
        return new Dimension(width, height);
    };
    return Dimension;
})();
var Tile = (function () {
    function Tile(texture) {
        this.texture = texture;
        this.size = new Dimension(texture.width, texture.height);
    }
    Tile.prototype.draw = function (ctx, x, y) {
        ctx.drawImage(this.texture, 0, 0, this.size.width, this.size.height, x, y, this.size.width, this.size.height);
    };
    return Tile;
})();
var SpriteSheet = (function () {
    function SpriteSheet(imageName, sheetName, tileSize, gutter, subsheet, offset) {
        if (gutter === void 0) { gutter = 0; }
        if (subsheet === void 0) { subsheet = new Dimension(0, 0); }
        if (offset === void 0) { offset = new Point(0, 0); }
        this.sprites = [];
        this.name = sheetName;
        this.offset = offset;
        this.subsheet = subsheet;
        this.tileSize = tileSize;
        this.gutter = gutter;
        this.image = ImageCache.getTexture(imageName);
        this.storeSprites();
    }
    SpriteSheet.prototype.storeSprites = function (callback) {
        if (callback === void 0) { callback = null; }
        this.spritesPerRow = ((this.subsheet.width === 0 || this.subsheet.height === 0) ? (this.image.width / this.tileSize) : this.subsheet.width);
        this.spritesPerCol = ((this.subsheet.width === 0 || this.subsheet.height === 0) ? (this.image.height / this.tileSize) : this.subsheet.height);
        var sprite;
        for (var y = 0; y < this.spritesPerCol; y++) {
            for (var x = 0; x < this.spritesPerRow; x++) {
                sprite = this.sprites[x + (y * this.spritesPerRow)] = document.createElement('canvas');
                sprite.width = this.tileSize;
                sprite.height = this.tileSize;
                sprite.getContext('2d').drawImage(this.image, ((this.tileSize + this.gutter) * x) + this.offset.x, ((this.tileSize + this.gutter) * y) + this.offset.y, this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="graphics.ts"/>
var VTile = (function (_super) {
    __extends(VTile, _super);
    function VTile(texture, walkable) {
        if (walkable === void 0) { walkable = true; }
        _super.call(this, texture);
        this.walkable = walkable;
    }
    return VTile;
})(Tile);
var TileSet = (function () {
    function TileSet(sheet) {
        this.tiles = [];
        this.tileSize = sheet.tileSize;
        for (var i = 0; i < sheet.sprites.length; i++) {
            this.tiles.push(new VTile(sheet.sprites[i]));
        }
    }
    return TileSet;
})();
var TileMap = (function () {
    function TileMap(size, position) {
        if (size === void 0) { size = new Dimension(1, 1); }
        if (position === void 0) { position = new Point(0, 0); }
        this.cached = false;
        this.size = size;
        this.position = position;
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
        return this.tileSet.tiles[tileVal];
    };
    TileMap.prototype.setTileSet = function (set) {
        this.tileSet = set;
    };
    TileMap.prototype.generateTest = function () {
        for (var i = 0; i < (this.size.width * this.size.height); i++) {
            this.tiles[i] = 0;
        }
    };
    TileMap.prototype.draw = function (ctx) {
        var externalCTX = ctx;
        if (!this.cached) {
            this.cache.width = this.size.width * 8;
            this.cache.height = this.size.height * 8;
            var ctx = this.cache.getContext('2d');
            for (var y = 0; y < this.size.height; y++) {
                for (var x = 0; x < this.size.width; x++) {
                    this.getTile(x, y).draw(ctx, x * 8, y * 8);
                }
            }
            this.cached = true;
        }
        externalCTX.drawImage(this.cache, this.position.x, this.position.y);
    };
    return TileMap;
})();

var Level = (function () {
    function Level(tilemap) {
        if (tilemap === void 0) { tilemap = new TileMap(Dimension.from(30, 25), Point.from(8, 32)); }
        this.tilemap = tilemap;
        this.tilemap.setTileSet(Level.defaultTileSet);
        this.tilemap.generateTest();
        this.entities = [];
    }
    return Level;
})();

/// <reference path="game_objects.ts"/>
var Entity = (function () {
    function Entity() {
        this._count = 0;
        this.components = {};
        this.id = Entity.autoID++;
    }
    Entity.prototype.addComponent = function (c) {
        if (!this.components[c.name])
            this._count++;
        this.components[c.name] = c;
        this[c.name] = this.components[c.name];
    };
    Entity.autoID = 0;
    return Entity;
})();
var PositionComponent = (function () {
    function PositionComponent(x, y) {
        this.name = "position";
        this.x = x;
        this.y = y;
    }
    return PositionComponent;
})();
var AABBComponent = (function () {
    function AABBComponent(width, height) {
        this.name = "aabb";
        this.width = width;
        this.height = height;
    }
    return AABBComponent;
})();
var SpriteComponent = (function () {
    function SpriteComponent(image) {
        this.name = "sprite";
        this.redraw = true;
        this.image = image;
    }
    return SpriteComponent;
})();
var LevelComponent = (function () {
    function LevelComponent(level) {
        this.name = "level";
        this.level = level;
    }
    return LevelComponent;
})();
var LayerComponent = (function () {
    function LayerComponent(layer) {
        if (layer === void 0) { layer = 0; }
        this.name = "layer";
        this.layer = layer;
    }
    return LayerComponent;
})();
var MovementComponent = (function () {
    function MovementComponent() {
        this.name = "movement";
        this.x = 0;
        this.y = 0;
    }
    ;
    return MovementComponent;
})();
var PlayerComponent = (function () {
    function PlayerComponent() {
        this.name = "player";
        this.value = true;
    }
    return PlayerComponent;
})();
var InputComponent = (function () {
    function InputComponent() {
        this.name = "input";
        this.value = true;
    }
    return InputComponent;
})();

/// <reference path="ECS.ts"/>
function draw(ctx, e) {
    var offsetX = 0, offsetY = 0;
    if (e["level"]) {
        offsetX = e["level"].level.tilemap.position.x;
        offsetY = e["level"].level.tilemap.position.y;
    }
    ctx.drawImage(e["sprite"].image, 0, 0, e["aabb"].width, e["aabb"].height, e["position"].x * e["sprite"].image.width + offsetX, e["position"].y * e["sprite"].image.height + offsetY, e["aabb"].width, e["aabb"].height);
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
    if (e["level"]) {
        var tile = e["level"].level.tilemap.getTile(e["position"].x + e["movement"].x, e["position"].y + e["movement"].y);
        if (!tile || !tile.walkable) {
            e["movement"].x = 0;
            e["movement"].y = 0;
        }
        else {
            var occupied = false;
            for (var _i = 0, _a = e["level"].level.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                occupied = occupied || ((entity["position"].x == (e["position"].x + e["movement"].x))
                    && (entity["position"].y == (e["position"].y + e["movement"].y)));
                if (occupied)
                    break;
            }
            if (occupied) {
                e["movement"].x = 0;
                e["movement"].y = 0;
            }
        }
    }
}
function movement(e) {
    if (e["movement"] && (e["movement"].x != 0 || e["movement"].y != 0)) {
        e["position"].x += e["movement"].x;
        e["position"].y += e["movement"].y;
        e["movement"].x = e["movement"].y = 0;
        e["sprite"].redraw = true;
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
        this.testAudio = new Audio('blip.wav');
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
        this.pEntity.addComponent(new LevelComponent(this.World));
        this.pEntity.addComponent(new PositionComponent(0, 0));
        this.pEntity.addComponent(new AABBComponent(8, 8));
        this.pEntity.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("pieces").sprites[0]));
        for (var i = 0; i < 30; i++) {
            var temp = new Entity();
            temp.addComponent(new PositionComponent(i + 1, i % 4));
            temp.addComponent(new AABBComponent(8, 8));
            temp.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("numbers").sprites[i % 10]));
            this.entities.push(temp);
        }
        for (var i = 0; i < 25; i++) {
            var temp = new Entity();
            temp.addComponent(new PositionComponent(((Math.random() * 30) | 0), ((Math.random() * 25) | 0)));
            temp.addComponent(new LevelComponent(this.World));
            temp.addComponent(new AABBComponent(8, 8));
            temp.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("pieces").sprites[0]));
            this.World.entities.push(temp);
        }
        this.testAudio.play();
    };
    Game.prototype.update = function (delta) {
        input(this.pEntity);
        if (this.pEntity["movement"].x != 0 || this.pEntity["movement"].y != 0) {
            collision(this.pEntity);
        }
        movement(this.pEntity);
    };
    Game.prototype.draw = function () {
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
            this.World.tilemap.draw(this.ctx);
            draw(this.ctx, this.pEntity);
            for (var _b = 0, _c = this.World.entities; _b < _c.length; _b++) {
                var entity = _c[_b];
                draw(this.ctx, entity);
            }
            this.change = false;
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
