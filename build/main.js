var Input;
(function (Input) {
    var KB;
    (function (KB) {
        (function (KEY) {
            KEY[KEY["A"] = 65] = "A";
            KEY[KEY["D"] = 68] = "D";
            KEY[KEY["W"] = 87] = "W";
            KEY[KEY["S"] = 83] = "S";
            KEY[KEY["LEFT"] = 37] = "LEFT";
            KEY[KEY["RIGHT"] = 39] = "RIGHT";
            KEY[KEY["UP"] = 38] = "UP";
            KEY[KEY["DOWN"] = 40] = "DOWN";
            KEY[KEY["ENTER"] = 13] = "ENTER";
            KEY[KEY["SPACE"] = 32] = "SPACE";
        })(KB.KEY || (KB.KEY = {}));
        var KEY = KB.KEY;
        var _isDown = [];
        var _isUp = [];
        var _wasDown = [];
        for (var i = 0; i < 256; i++) {
            _isUp[i] = true;
        }
        function isDown(keyCode) {
            return (_isDown[keyCode]);
        }
        KB.isDown = isDown;
        function wasDown(keyCode) {
            var result = _wasDown[keyCode];
            _wasDown[keyCode] = false;
            return (result);
        }
        KB.wasDown = wasDown;
        function keyDown(event) {
            var keyCode = event.which;
            _isDown[keyCode] = true;
            if (_isUp[keyCode])
                _wasDown[keyCode] = true;
            _isUp[keyCode] = false;
        }
        KB.keyDown = keyDown;
        function keyUp(event) {
            var keyCode = event.which;
            _isDown[keyCode] = false;
            _isUp[keyCode] = true;
        }
        KB.keyUp = keyUp;
    })(KB = Input.KB || (Input.KB = {}));
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
function getRandomInt(min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    return ((Math.random() * (max - min + 1)) | 0) + min;
}
var SSC;
(function (SSC) {
    var sheets = {};
    function storeSheet(sheet) {
        sheets[sheet.name] = sheet;
    }
    SSC.storeSheet = storeSheet;
    function spriteSheet(name) {
        return sheets[name];
    }
    SSC.spriteSheet = spriteSheet;
})(SSC || (SSC = {}));
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
        this.FVal = 0;
        this.GVal = 0;
        this.HVal = 0;
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
        this.eSpawns = [];
        this.AIPath = [];
        this.map = map;
        this.map.setTileSet(Level.defaultTileSet);
        do {
            this.eSpawns = [];
            this.generateLevel();
            this.AIPath = this.generatePath(1, 23, 23, 1);
        } while (this.AIPath.length < 50);
        this.setSpawns();
        this.entities = [];
    }
    Level.prototype.getNbr = function (px, py, x, y, val) {
        var tile = this.map.getTile(x, y);
        if (tile && tile.value === val) {
            tile.xd = (x - px);
            tile.yd = (y - py);
            return tile;
        }
        return undefined;
    };
    Level.prototype.getNbrs = function (x, y, val) {
        var result = [];
        var t1 = this.getNbr(x, y, x, y - 1, val);
        if (t1)
            result.push(t1);
        var t2 = this.getNbr(x, y, x, y + 1, val);
        if (t2)
            result.push(t2);
        var t3 = this.getNbr(x, y, x - 1, y, val);
        if (t3)
            result.push(t3);
        var t4 = this.getNbr(x, y, x + 1, y, val);
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
        var seed = Pt.from(getRandomInt(1, 23), getRandomInt(1, 23));
        if (seed.x % 2 == 0)
            seed.x -= 1;
        if (seed.y % 2 == 0)
            seed.y -= 1;
        var currentTile = this.map.getTile(seed.x, seed.y);
        currentTile.value = 0;
        this.map.setTile(currentTile.x, currentTile.y, 0);
        var walls = [];
        do {
            if (currentTile)
                walls = walls.concat(this.getNbrs(currentTile.x, currentTile.y, 1));
            var wallIndex = getRandomInt(0, walls.length - 1);
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
    Level.prototype.generatePath = function (startX, startY, goalX, goalY) {
        var path = [];
        var openList = [], closedList = [], nbrs = [];
        var current, ctile, parent;
        ;
        openList.push(this.map.getTile(startX, startY));
        do {
            current = openList.pop();
            closedList.push(current);
            if (current.x === goalX && current.y === goalY) {
                ctile = current;
                break;
            }
            nbrs = this.getNbrs(current.x, current.y, 0);
            for (var _i = 0; _i < nbrs.length; _i++) {
                var nbr = nbrs[_i];
                if (this.tileInSet(nbr.x, nbr.y, closedList))
                    continue;
                var tile = this.getTileInSet(nbr.x, nbr.y, openList);
                if (tile === undefined) {
                    nbr.parent = current;
                    nbr.HVal = (Math.abs(goalX - nbr.x) + Math.abs(goalY - nbr.y));
                    nbr.GVal = current.GVal + 10;
                    nbr.FVal = nbr.HVal + nbr.GVal;
                    openList.push(nbr);
                }
                else {
                    var tempG = current.GVal + 10;
                    if (tempG < tile.GVal) {
                        tile.parent = current;
                        tile.GVal = current.GVal + 10;
                        tile.FVal = tile.HVal + tile.GVal;
                    }
                }
            }
            if (openList.length === 0)
                break;
            openList.sort(function (tileA, tileB) { return tileB.FVal - tileA.FVal; });
        } while (true);
        do {
            parent = ctile.parent;
            path.push(Pt.from(ctile.x - parent.x, ctile.y - parent.y));
            ctile = parent;
            if (ctile.x != startX && ctile.y != startY)
                this.eSpawns.push(Pt.from(ctile.x, ctile.y));
        } while (ctile.parent !== undefined);
        return path;
    };
    Level.prototype.getTileInSet = function (x, y, arr) {
        var result = undefined;
        for (var _i = 0; _i < arr.length; _i++) {
            var tile = arr[_i];
            if (tile.x === x && tile.y === y) {
                result = tile;
                break;
            }
        }
        return result;
    };
    Level.prototype.tileInSet = function (x, y, arr) {
        var result = false;
        for (var _i = 0; _i < arr.length; _i++) {
            var tile = arr[_i];
            result = result || (tile.x === x && tile.y === y);
            if (result === true)
                break;
        }
        return result;
    };
    Level.prototype.setSpawns = function () {
        for (var y = 2; y <= 22; y++) {
            for (var x = 2; x <= 22; x++) {
                var tile = this.map.getTile(x, y);
                if (tile.value === 0) {
                }
            }
        }
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
    function AABBC(w, h) {
        this.name = "aabb";
        this.w = w;
        this.h = h;
    }
    return AABBC;
})();
var SpriteC = (function () {
    function SpriteC(image) {
        this.name = "sprite";
        this.redraw = true;
        this.visable = true;
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
var AudioC = (function () {
    function AudioC(sound) {
        this.name = "audio";
        this.sound = new AudioPool(sound, 3);
    }
    return AudioC;
})();
var MovementC = (function () {
    function MovementC() {
        this.name = "mv";
        this.x = 0;
        this.y = 0;
    }
    return MovementC;
})();
var CollisionTypes;
(function (CollisionTypes) {
    CollisionTypes[CollisionTypes["ENTITY"] = 0] = "ENTITY";
    CollisionTypes[CollisionTypes["LEVEL"] = 1] = "LEVEL";
    CollisionTypes[CollisionTypes["WORLD"] = 2] = "WORLD";
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
var AIHeroC = (function () {
    function AIHeroC(path) {
        if (path === void 0) { path = []; }
        this.name = "aihero";
        this.movementCooldown = 5000;
        this.value = true;
        this.pathReady = true;
        this.AIPath = path;
    }
    return AIHeroC;
})();
var BossC = (function () {
    function BossC() {
        this.name = "boss";
        this.value = true;
    }
    return BossC;
})();
var CombatC = (function () {
    function CombatC() {
        this.name = "combat";
        this.alive = true;
    }
    return CombatC;
})();
var InputC = (function () {
    function InputC(enabled) {
        if (enabled === void 0) { enabled = true; }
        this.name = "input";
        this.enabled = true;
        this.cooldowns = [];
        this.enabled = enabled;
        this.cooldowns[0] = this.cooldowns[1] = this.cooldowns[2] = this.cooldowns[3] = 0;
    }
    return InputC;
})();
var HauntC = (function () {
    function HauntC() {
        this.name = "haunt";
        this.haunting = false;
    }
    return HauntC;
})();
var XPC = (function () {
    function XPC(xp) {
        if (xp === void 0) { xp = 0; }
        this.name = "xp";
        this.value = 0;
        this.value = xp;
    }
    return XPC;
})();
var LVLC = (function () {
    function LVLC(lvl) {
        if (lvl === void 0) { lvl = 1; }
        this.name = "lvl";
        this.value = lvl;
    }
    return LVLC;
})();
var HPC = (function () {
    function HPC(hp) {
        if (hp === void 0) { hp = 5; }
        this.name = "hp";
        this.value = hp;
    }
    return HPC;
})();

/// <reference path="ECS.ts"/>
function draw(ctx, e) {
    if (e["sprite"]) {
        var offsetX = 0, offsetY = 0;
        if (e["level"]) {
            offsetX = e["level"].level.map.pos.x;
            offsetY = e["level"].level.map.pos.y;
        }
        if (e["sprite"].visable === true) {
            ctx.drawImage(e["sprite"].image, 0, 0, e["aabb"].w, e["aabb"].h, e["pos"].x * e["sprite"].image.width + offsetX, e["pos"].y * e["sprite"].image.height + offsetY, e["aabb"].w, e["aabb"].h);
        }
        e["sprite"].redraw = false;
    }
}
function input(e, delta) {
    if (e["input"]) {
        for (var cd in e["input"].cooldowns) {
            e["input"].cooldowns[cd] -= delta;
        }
        if (e["mv"]) {
            if ((Input.KB.isDown(Input.KB.KEY.D) || Input.KB.isDown(Input.KB.KEY.RIGHT)) && e["input"].cooldowns[0] <= 0) {
                e["input"].cooldowns[0] = 166;
                e["mv"].x = 1;
            }
            if ((Input.KB.isDown(Input.KB.KEY.A) || Input.KB.isDown(Input.KB.KEY.LEFT)) && e["input"].cooldowns[1] <= 0) {
                e["input"].cooldowns[1] = 166;
                e["mv"].x = -1;
            }
            if ((Input.KB.isDown(Input.KB.KEY.W) || Input.KB.isDown(Input.KB.KEY.UP)) && e["input"].cooldowns[2] <= 0) {
                e["input"].cooldowns[2] = 166;
                e["mv"].y = -1;
            }
            if ((Input.KB.isDown(Input.KB.KEY.S) || Input.KB.isDown(Input.KB.KEY.DOWN)) && e["input"].cooldowns[3] <= 0) {
                e["input"].cooldowns[3] = 166;
                e["mv"].y = 1;
            }
            if (e["input"].enabled === false) {
                e["mv"].x = e["mv"].y = 0;
            }
        }
        if (e["player"]) {
            if (Input.KB.wasDown(Input.KB.KEY.SPACE)) {
                if (e["player"] && e["haunt"]) {
                    e["haunt"].haunting = !(e["haunt"].haunting);
                }
            }
        }
    }
}
function haunt(e) {
    if (e["haunt"] && e["level"]) {
        if (e["haunt"].haunting && !e["haunt"].haunted) {
            var success = false;
            for (var _i = 0, _a = e["level"].level.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                if (!entity["player"] && !entity["aihero"] && !entity["boss"]
                    && entity["pos"] && e["pos"]
                    && entity["pos"].x === e["pos"].x
                    && entity["pos"].y === e["pos"].y) {
                    e["haunt"].haunted = entity;
                    entity["input"].enabled = e["sprite"].redraw = success = true;
                    e["input"].enabled = e["sprite"].visable = false;
                }
            }
            if (!success) {
                e["haunt"].haunting = false;
            }
        }
        else if (!e["haunt"].haunting && e["haunt"].haunted) {
            e["pos"].x = e["haunt"].haunted["pos"].x;
            e["pos"].y = e["haunt"].haunted["pos"].y;
            e["haunt"].haunted["input"].enabled = e["haunt"].haunting = false;
            e["input"].enabled = e["sprite"].visable = e["sprite"].redraw = true;
            e["haunt"].haunted = undefined;
        }
        else if (e["haunt"].haunting && e["haunt"].haunted && e["haunt"].haunted["combat"] && !e["haunt"].haunted["combat"].alive) {
            e["haunt"].haunting = false;
        }
    }
}
function collision(e) {
    if (e["level"] && e["collision"]) {
        var tile = e["level"].level.map.getTile(e["pos"].x + e["mv"].x, e["pos"].y + e["mv"].y);
        if (e["collision"].type === CollisionTypes.WORLD) {
            if (!tile || tile.value === 2) {
                e["mv"].x = 0;
                e["mv"].y = 0;
            }
        }
        else if (e["collision"].type !== CollisionTypes.WORLD && (!tile || !tile.walkable)) {
            e["mv"].x = 0;
            e["mv"].y = 0;
        }
        else if (e["collision"].type === CollisionTypes.ENTITY) {
            var occupied = false;
            var o_entity;
            for (var _i = 0, _a = e["level"].level.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                occupied = occupied || ((entity["pos"].x == (e["pos"].x + e["mv"].x))
                    && (entity["pos"].y == (e["pos"].y + e["mv"].y))
                    && (entity["collision"])
                    && entity["collision"].type === CollisionTypes.ENTITY);
                if (occupied) {
                    o_entity = entity;
                    break;
                }
            }
            if (occupied) {
                e["mv"].x = 0;
                e["mv"].y = 0;
                if (e["combat"]) {
                    e["combat"].target = o_entity;
                    console.log(e["combat"].target);
                }
            }
        }
    }
}
function combat(e) {
    if (e["aihero"] && e["combat"]) {
        if (e["combat"].target && e["combat"].target["combat"]) {
            var target = e["combat"].target;
            if (!target["combat"].alive) {
                e["combat"].target = undefined;
            }
            else {
                target["combat"].alive = false;
                target["sprite"].visable = false;
                target["sprite"].redraw = true;
                target["collision"].type = CollisionTypes.WORLD;
            }
        }
        else {
            e["combat"].target = undefined;
        }
    }
}
function AIMovement(e, delta) {
    if (e["aihero"]) {
        e["aihero"].movementCooldown -= delta;
        if (e["combat"] && e["combat"].target) {
            return;
        }
        else if (e["aihero"].movementCooldown <= 0) {
            e["aihero"].movementCooldown += 2000;
            if (e["aihero"].AIPath.length > 0) {
                if (e["aihero"].nextMove === undefined)
                    e["aihero"].nextMove = e["aihero"].AIPath.pop();
                e["mv"].x = e["aihero"].nextMove.x;
                e["mv"].y = e["aihero"].nextMove.y;
            }
        }
    }
}
function movement(e) {
    if (e["mv"] && (e["mv"].x != 0 || e["mv"].y != 0)) {
        e["pos"].x += e["mv"].x;
        e["pos"].y += e["mv"].y;
        e["mv"].x = e["mv"].y = 0;
        if (e["aihero"]) {
            e["aihero"].nextMove = undefined;
        }
        e["sprite"].redraw = true;
    }
}
function movementSound(e) {
    if (e["audio"] && e["mv"] && (e["mv"].x != 0 || e["mv"].y != 0)) {
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
            var pos = this.World.eSpawns.splice(getRandomInt(0, this.World.eSpawns.length - 1), 1)[0];
            var e = this.makeGEntity(pos.x, pos.y, SSC.spriteSheet("pieces").sprites[2], CollisionTypes.ENTITY);
            e.add(new InputC(false));
            e.add(new CombatC());
            e.add(new AudioC('gblip.wav'));
            this.World.entities.push(e);
        }
        for (var i = 0; i < 5; i++) {
            var pos = this.World.eSpawns.splice(getRandomInt(0, this.World.eSpawns.length - 1), 1)[0];
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
