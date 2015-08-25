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
                    this.eSpawns.push(Pt.from(x, y));
                }
            }
        }
    };
    return Level;
})();
