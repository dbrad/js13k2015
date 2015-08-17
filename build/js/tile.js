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
