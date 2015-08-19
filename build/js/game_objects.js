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
