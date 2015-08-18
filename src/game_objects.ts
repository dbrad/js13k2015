class Level {
    entities: Entity[];
    tilemap: TileMap;
    static defaultTileSet: TileSet;

    constructor(tilemap: TileMap = new TileMap(Dimension.from(30, 25), Point.from(8, 32))) {
        this.tilemap = tilemap;
        this.tilemap.setTileSet(Level.defaultTileSet);
        this.tilemap.generateTest();
        this.entities = [];
    }
}
