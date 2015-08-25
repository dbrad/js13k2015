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
