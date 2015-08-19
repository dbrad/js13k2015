interface Context2D extends CanvasRenderingContext2D {
    mozImageSmoothingEnabled: boolean;
    imageSmoothingEnabled: boolean;
    webkitImageSmoothingEnabled: boolean;
}

class Point {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    static from(x: number, y: number) {
        return new Point(x, y);
    }
}

class Dimension {
    width: number;
    height: number;
    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }

    static from(width: number, height: number) {
        return new Dimension(width, height);
    }
}

/** An image with a size that can be drawn at a location. */
class Tile {
    texture: HTMLCanvasElement;
    size: Dimension;

    constructor(texture: HTMLCanvasElement) {
        this.texture = texture;
        this.size = new Dimension(texture.width, texture.height);
    }

    draw(ctx: any, x: number, y: number): void {
        ctx.drawImage(this.texture,
            0, 0, this.size.width, this.size.height,
            x, y, this.size.width, this.size.height);
    }
}

class SpriteSheet {
    private image: any;
    sprites: HTMLCanvasElement[] = [];

    name: string;
    gutter: number;
    offset: Point;
    subsheet: Dimension;
    tileSize: number;

    spritesPerRow: number;
    spritesPerCol: number;

    constructor(
        imageName: string, sheetName: string, tileSize: number, gutter: number = 0,
        subsheet: Dimension = new Dimension(0, 0), offset: Point = new Point(0, 0)) {

        this.name = sheetName;
        this.offset = offset;
        this.subsheet = subsheet;
        this.tileSize = tileSize;
        this.gutter = gutter;
        this.image = ImageCache.getTexture(imageName);
        this.storeSprites();
    }

    private storeSprites(callback: any = null) {
        this.spritesPerRow = ((this.subsheet.width === 0 || this.subsheet.height === 0) ? (this.image.width / this.tileSize) : this.subsheet.width);
        this.spritesPerCol = ((this.subsheet.width === 0 || this.subsheet.height === 0) ? (this.image.height / this.tileSize) : this.subsheet.height);

        var sprite: HTMLCanvasElement;
        for (var y = 0; y < this.spritesPerCol; y++) {
            for (var x = 0; x < this.spritesPerRow; x++) {
                sprite = this.sprites[x + (y * this.spritesPerRow)] = document.createElement('canvas');
                sprite.width = this.tileSize;
                sprite.height = this.tileSize;
                sprite.getContext('2d').drawImage(this.image,
                    ((this.tileSize + this.gutter) * x) + this.offset.x,
                    ((this.tileSize + this.gutter) * y) + this.offset.y,
                    this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);
            }
        }
    }
}
/** Global Caches */
interface SpriteSheetArray {
    [index: string]: SpriteSheet;
}
module SpriteSheetCache {
    var sheets: SpriteSheetArray = {};

    export function storeSheet(sheet: SpriteSheet): void {
        sheets[sheet.name] = sheet;
    }

    export function spriteSheet(name: string): SpriteSheet {
        return sheets[name];
    }
}


interface ImageArray {
    [index: string]: HTMLImageElement;
}
interface StringArray {
    [index: string]: string;
}
module ImageCache {
    var cache: ImageArray = {};
    export function getTexture(name: string): HTMLImageElement {
        return cache[name];
    }

    var toLoad: StringArray = {};
    var loadCount = 0;
    export module Loader {
        export function add(name: string, url: string): void {
            toLoad[name] = url;
            loadCount++;
        }

        export function load(callback: any): void {
            var async = { counter: 0, loadCount: 0, callback: callback };
            var done = function(async: any) { if ((async.counter++) === async.loadCount) { async.callback(); } };
            for (var img in toLoad) {
                cache[img] = new Image();
                cache[img].src = toLoad[img];
                cache[img].onload = done.bind(this, async);
                delete toLoad[img]
            }
            loadCount = 0;
        }
    }
}

class AudioPool {
    private pool: HTMLAudioElement[] = [];
    private index: number = 0;
    private maxSize: number;

    constructor(sound: string, maxSize: number = 1) {
        this.maxSize = maxSize
        for (var i: number = 0; i < this.maxSize; i++) {
            this.pool[i] = new Audio(sound);
            this.pool[i].load();
        }
    }

    play(): void {
        if (this.pool[this.index].currentTime == 0 || this.pool[this.index].ended) {
            this.pool[this.index].play();
        }
        this.index = (this.index + 1) % this.maxSize;
    }
}
