var Level = (function () {
    function Level(map) {
        if (map === void 0) { map = new TileMap(Dimension.from(30, 25), Point.from(8, 32)); }
        this.map = map;
        this.map.setTileSet(Level.defaultTileSet);
        this.generateLevel();
        this.entities = [];
    }
    Level.prototype.generateLevel = function () {
        for (var i = 0; i < (30 * 25); i++) {
            this.map.tiles[i] = 0;
        }
        for (var i = 0; i < 30; i++) {
            this.map.tiles[i] = this.map.tiles[this.map.tiles.length - 1 - i] = 1;
        }
        for (var i = 1; i < 24; i++) {
            this.map.tiles[this.map.size.width * i] = this.map.tiles[(this.map.size.width * (i + 1)) - 1] = 1;
        }
    };
    return Level;
})();
