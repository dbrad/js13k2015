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
