/// <reference path="graphics.ts"/>
class VTile extends Tile {
    walkable: boolean;
    constructor(texture: HTMLCanvasElement, walkable: boolean = true) {
        super(texture);
        this.walkable = walkable;
    }
}

class TileSet {
    tiles: VTile[];
    tileSize: number;
    constructor(sheet: SpriteSheet) {
        this.tiles = [];
        this.tileSize = sheet.tileSize;
        for (var i: number = 0; i < sheet.sprites.length; i++) {
            this.tiles.push(new VTile(sheet.sprites[i]));
        }
    }
}

class TileMap {
    private cache: HTMLCanvasElement;
    private cached: boolean = false;
    tileSet: TileSet;
    tiles: number[];
    size: Dimension;
    position: Point;
    layer: number;

    constructor(size: Dimension = new Dimension(1, 1), position: Point = new Point(0, 0)) {
        this.size = size;
        this.position = position;
        this.tiles = [];
        this.cache = document.createElement('canvas');
    }

    setTile(x: number, y: number, value: number): void {
        this.tiles[x + (y * this.size.width)] = value;
    }
    getTile(x: number, y: number): VTile {
        if (x == this.size.width || x < 0 || y == this.size.height || y < 0)
            return undefined;
        var tileVal: number = this.tiles[x + (y * this.size.width)];
        return this.tileSet.tiles[tileVal];
    }

    setTileSet(set: TileSet): void {
        this.tileSet = set;
    }

    generateTest(): void {
        for (var i: number = 0; i < (this.size.width * this.size.height); i++) {
            this.tiles[i] = 0;
        }
    }

    draw(ctx: Context2D): void {
        var externalCTX = ctx;
        if (!this.cached) {
            this.cache.width = this.size.width * 8;
            this.cache.height = this.size.height * 8;
            ctx = <Context2D>this.cache.getContext('2d');
            for (var y: number = 0; y < this.size.height; y++) {
                for (var x: number = 0; x < this.size.width; x++) {
                    this.getTile(x, y).draw(ctx, x * 8, y * 8);
                }
            }
            this.cached = true;
        }
        externalCTX.drawImage(this.cache, this.position.x, this.position.y);
    }
}
