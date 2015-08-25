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
    w: number;
    h: number;

    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
    }
}

class SpriteC implements Component {
    name: string = "sprite";
    image: HTMLCanvasElement;
    redraw: boolean = true;
    visable: boolean = true;

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

class AudioC implements Component {
    name: string = "audio";
    sound: AudioPool;

    constructor(sound: string) {
        this.sound = new AudioPool(sound, 3);
    }
}

class MovementC implements Component {
    name: string = "mv";
    x: number = 0;
    y: number = 0;
}

enum CollisionTypes {
    ENTITY, LEVEL, WORLD
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

class AIHeroC implements Component {
    name: string = "aihero";
    movementCooldown: number = 5000;
    value: boolean = true
    pathReady: boolean = true;
    AIPath: Pt[];
    nextMove: Pt;
    constructor(path: Pt[] = []) {
        this.AIPath = path;
    }
}

class BossC implements Component {
    name: string = "boss";
    value: boolean = true;
}

class CombatC implements Component {
    name: string = "combat";
    target: Entity;
    atk: number;
    hp: number;
    alive: boolean = true;
}

class InputC implements Component {
    name: string = "input";
    enabled: boolean = true;
    cooldowns: number[] = [];
    constructor(enabled: boolean = true) {
        this.enabled = enabled;
        this.cooldowns[0] = this.cooldowns[1] = this.cooldowns[2] = this.cooldowns[3] = 0;
    }
}

class HauntC implements Component {
    name: string = "haunt";
    haunting: boolean = false;
    haunted: Entity;
}

class XPC implements Component {
    name: string = "xp";
    value: number = 0;
    constructor(xp: number = 0) {
        this.value = xp;
    }
}

class LVLC implements Component {
    name: string = "lvl";
    value: number;
    constructor(lvl: number = 1) {
       this.value = lvl;
    } 
}

class HPC implements Component {
    name: string = "hp";
    value: number;
    constructor(hp: number = 5) {
        this.value = hp;
    }
}
