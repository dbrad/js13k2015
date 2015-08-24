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

    add(c: Component): void {
        if (!this.components[c.name])
            this._count++;
        this.components[c.name] = c;
        this[c.name] = this.components[c.name]
    }
}

/** Components */
class PositionC implements Component {
    name: string = "pos";
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class AABBC implements Component {
    name: string = "aabb";
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

class SpriteC implements Component {
    name: string = "sprite";
    image: HTMLCanvasElement;
    redraw: boolean = true;

    constructor(image: HTMLCanvasElement) {
        this.image = image;
    }
}

class LevelC implements Component {
    name: string = "level";
    level: Level;

    constructor(level: Level) {
        this.level = level;
    }
}

class LayerC implements Component {
    name: string = "layer";
    layer: number;

    constructor(layer: number = 0) {
        this.layer = layer;
    }
}

class AudioC implements Component {
  name: string = "audio";
  sound: AudioPool;

  constructor(sound: string) {
      this.sound = new AudioPool(sound, 3);
  }
}

class MovementC implements Component {
    name: string = "movement";
    x: number = 0;
    y: number = 0;
}

enum CollisionTypes {
    ENTITY, LEVEL
}
class CollisionC implements Component {
    name: string = "collision";
    type: CollisionTypes;
    constructor(type: CollisionTypes = CollisionTypes.LEVEL) {
        this.type = type;
    }
}

class PlayerC implements Component {
    name: string = "player";
    value: boolean = true;
}

class CombatC implements Component {
    name: string = "combat";
    target: Entity;
    alive: boolean = true;
}

class InputC implements Component {
    name: string = "input";
    value: boolean = true;
}

class AIHeroC implements Component {
    name: string = "aihero";
    movementCooldown: number = 1000;
    value: boolean = true;
}
