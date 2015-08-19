class Level {
    entities: Entity[];
    map: TileMap;
    static defaultTileSet: TileSet;

    constructor(map: TileMap = new TileMap(Dimension.from(30, 25), Point.from(8, 32))) {
        this.map = map;
        this.map.setTileSet(Level.defaultTileSet);
        this.generateLevel();
        this.entities = [];
    }

    generateLevel(): void {
		for (var i: number = 0; i < (30 * 25); i++) {
			this.map.tiles[i] = 0;
		}
		for (var i: number = 0; i < 30; i++) {
			this.map.tiles[i] = this.map.tiles[this.map.tiles.length - 1 - i] = 1;
		}
		for (var i: number = 1; i < 24; i++) {
			this.map.tiles[this.map.size.width * i] = this.map.tiles[(this.map.size.width * (i + 1)) - 1] = 1;
		}
    }
}
