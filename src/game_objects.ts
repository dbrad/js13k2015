class MetaTile extends VTile {
    x: number;
    y: number;
    xd: number;
    yd: number;
    value: number;

    constructor(tile: VTile, x: number, y: number, value: number) {
        super(tile.texture, tile.walkable);
        this.value = value;
        this.x = x;
        this.y = y;
        this.xd = 0;
        this.yd = 0;
    }
}

class Level {
    entities: Entity[];
    map: TileMap;
    static defaultTileSet: TileSet;

    constructor(map: TileMap = new TileMap(Dimension.from(25, 25), Point.from(8, 32))) {
        this.map = map;
        this.map.setTileSet(Level.defaultTileSet);
        this.generateLevel();
        this.entities = [];
    }

    getWall(px, py, x, y): MetaTile {
        var tile = this.map.getTile(x, y);
        if (tile && tile.value === 1) {
            tile.xd = (x - px);
            tile.yd = (y - py);
            return tile;
        }
        return undefined;
    }

    getWalls(x: number, y: number): MetaTile[] {
        var result: MetaTile[] = [];
        var t1 = this.getWall(x, y, x, y - 1);
        if (t1) result.push(t1);
        var t2 = this.getWall(x, y, x, y + 1);
        if (t2) result.push(t2);
        var t3 = this.getWall(x, y, x - 1, y);
        if (t3) result.push(t3);
        var t4 = this.getWall(x, y, x + 1, y);
        if (t4) result.push(t4);
        return result;
    }

    generateLevel(): void {
        for (var i: number = 0; i < (this.map.size.width * this.map.size.height); i++) {
            this.map.tiles[i] = 1;
        }
        for (var i: number = 0; i < this.map.size.width; i++) {
            this.map.tiles[i] = this.map.tiles[this.map.tiles.length - 1 - i] = 2;
        }
        for (var i: number = 1; i < this.map.size.height - 1; i++) {
            this.map.tiles[this.map.size.width * i] = this.map.tiles[(this.map.size.width * (i + 1)) - 1] = 2;
        }

        var seed: Point = Point.from(1, 1);
        var currentTile: MetaTile = this.map.getTile(seed.x, seed.y);
        currentTile.value = 0;
        this.map.setTile(currentTile.x, currentTile.y, 0);
        var walls: MetaTile[] = [];

        do {
            if (currentTile)
                walls = walls.concat(this.getWalls(currentTile.x, currentTile.y));
            var wallIndex: number = ((Math.random() * walls.length) | 0);
            var tileToCheck: MetaTile = walls[wallIndex];            
            var nextTile: MetaTile = this.map.getTile(tileToCheck.x + tileToCheck.xd, tileToCheck.y + tileToCheck.yd);

            if (nextTile && (nextTile.value === 1)) {
                nextTile.value = 0;
                this.map.setTile(nextTile.x, nextTile.y, 0);
                tileToCheck.value = 0;
                this.map.setTile(tileToCheck.x, tileToCheck.y, 0);
                currentTile = this.map.getTile(nextTile.x, nextTile.y);
            } else {
                tileToCheck.value = 3;
                this.map.setTile(tileToCheck.x, tileToCheck.y, 3);
                currentTile = undefined;
            }

            walls = walls.filter(function(obj, index, array) { return (obj.value === 1); });
        } while (walls.length != 0)
    }
}
