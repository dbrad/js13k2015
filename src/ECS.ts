/// <reference path="game_objects.ts"/>
/** ECS */
interface Component {
    name: string;
}
interface ComponentArray {
    [index: string]: Component;
}
class Entity {
    private static autoID = 0;
    private _count: number = 0;

    private id: number;
    components: ComponentArray = {};

    constructor() {
        this.id = Entity.autoID++;
    }

    addComponent(c: Component): void {
        if (!this.components[c.name])
            this._count++;
        this.components[c.name] = c;
        this[c.name] = this.components[c.name]
    }
}

/** Components */
class PositionComponent implements Component {
    name: string = "position";
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class AABBComponent implements Component {
    name: string = "aabb";
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

class SpriteComponent implements Component {
    name: string = "sprite";
    image: HTMLCanvasElement;
    redraw: boolean = true;

    constructor(image: HTMLCanvasElement) {
        this.image = image;
    }
}

class LevelComponent implements Component {
    name: string = "level";
    level: Level;

    constructor(level: Level) {
        this.level = level;
    }
}

class LayerComponent implements Component {
    name: string = "layer";
    layer: number;

    constructor(layer: number = 0) {
        this.layer = layer;
    }
}

class MovementComponent implements Component {
    name: string = "movement";
    x: number = 0;;
    y: number = 0;
}

class PlayerComponent implements Component {
    name: string = "player";
    value: boolean = true;
}

class InputComponent implements Component {
    name: string = "input";
    value: boolean = true;
}
