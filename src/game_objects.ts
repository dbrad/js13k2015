class MetaTile extends VTile {
    x: number;
    y: number;
    xd: number;
    yd: number;
    value: number;

    parent: MetaTile;
    FVal: number = 0;
    GVal: number = 0;
    HVal: number = 0;

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
    eSpawns: Pt[] = [];
    AIPath: Pt[] = [];

    constructor(map: TileMap = new TileMap(Dm.from(25, 25), Pt.from(8, 32))) {
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

    getNbr(px: number, py: number, x: number, y: number, val: number): MetaTile {
        var tile = this.map.getTile(x, y);
        if (tile && tile.value === val) {
            tile.xd = (x - px);
            tile.yd = (y - py);
            return tile;
        }
        return undefined;
    }

    getNbrs(x: number, y: number, val: number): MetaTile[] {
        var result: MetaTile[] = [];
        var t1 = this.getNbr(x, y, x, y - 1, val);
        if (t1) result.push(t1);
        var t2 = this.getNbr(x, y, x, y + 1, val);
        if (t2) result.push(t2);
        var t3 = this.getNbr(x, y, x - 1, y, val);
        if (t3) result.push(t3);
        var t4 = this.getNbr(x, y, x + 1, y, val);
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

        var seed: Pt = Pt.from(getRandomInt(1, 23), getRandomInt(1, 23));
        if (seed.x % 2 == 0) seed.x -= 1;
        if (seed.y % 2 == 0) seed.y -= 1;
        var currentTile: MetaTile = this.map.getTile(seed.x, seed.y);
        currentTile.value = 0;
        this.map.setTile(currentTile.x, currentTile.y, 0);
        var walls: MetaTile[] = [];

        do {
            if (currentTile)
                walls = walls.concat(this.getNbrs(currentTile.x, currentTile.y, 1));
            var wallIndex: number = getRandomInt(0, walls.length - 1);
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

    generatePath(startX: number, startY: number, goalX: number, goalY: number): Pt[] {
        var path: Pt[] = [];
        var openList: MetaTile[] = [], closedList: MetaTile[] = [], nbrs: MetaTile[] = [];
        var current: MetaTile, ctile: MetaTile, parent: MetaTile;;

        openList.push(this.map.getTile(startX, startY));
        do {
            current = openList.pop();
            closedList.push(current);

            if (current.x === goalX && current.y === goalY) {
                ctile = current;
                break;
            }
            nbrs = this.getNbrs(current.x, current.y, 0);
            for (var nbr of nbrs) {
                if (this.tileInSet(nbr.x, nbr.y, closedList))
                    continue;
                var tile: MetaTile = this.getTileInSet(nbr.x, nbr.y, openList);
                if (tile === undefined) {
                    nbr.parent = current;
                    nbr.HVal = (Math.abs(goalX - nbr.x) + Math.abs(goalY - nbr.y));
                    nbr.GVal = current.GVal + 10;
                    nbr.FVal = nbr.HVal + nbr.GVal;
                    openList.push(nbr);
                } else {
                    var tempG: number = current.GVal + 10;
                    if (tempG < tile.GVal) {
                        tile.parent = current;
                        tile.GVal = current.GVal + 10;
                        tile.FVal = tile.HVal + tile.GVal;
                    }
                }
            }
            if (openList.length === 0) break;
            openList.sort(function(tileA: MetaTile, tileB: MetaTile) { return tileB.FVal - tileA.FVal; });
        } while (true);

        do {
            parent = ctile.parent;
            path.push(Pt.from(ctile.x - parent.x, ctile.y - parent.y));
            ctile = parent;
            if (ctile.x != startX && ctile.y != startY)
                this.eSpawns.push(Pt.from(ctile.x, ctile.y));
        } while (ctile.parent !== undefined)
        return path;
    }

    getTileInSet(x: number, y: number, arr: MetaTile[]): MetaTile {
        var result: MetaTile = undefined;
        for (var tile of arr) {
            if (tile.x === x && tile.y === y) {
                result = tile;
                break;
            }
        }
        return result;
    }

    tileInSet(x: number, y: number, arr: MetaTile[]): boolean {
        var result: boolean = false;
        for (var tile of arr) {
            result = result || (tile.x === x && tile.y === y);
            if (result === true)
                break;
        }
        return result;
    }

    setSpawns(): void {
        for (var y: number = 2; y <= 22; y++) {
            for (var x: number = 2; x <= 22; x++) {
                var tile = this.map.getTile(x, y);
                if (tile.value === 0) {
                   // this.eSpawns.push(Pt.from(x, y));
                }
            }
        }
    }
}
