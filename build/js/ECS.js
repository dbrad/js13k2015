/// <reference path="game_objects.ts"/>
var Entity = (function () {
    function Entity() {
        this._count = 0;
        this.components = {};
        this.id = Entity.autoID++;
    }
    Entity.prototype.add = function (c) {
        if (!this.components[c.name])
            this._count++;
        this.components[c.name] = c;
        this[c.name] = this.components[c.name];
    };
    Entity.autoID = 0;
    return Entity;
})();
var PositionC = (function () {
    function PositionC(x, y) {
        this.name = "pos";
        this.x = x;
        this.y = y;
    }
    return PositionC;
})();
var AABBC = (function () {
    function AABBC(width, height) {
        this.name = "aabb";
        this.width = width;
        this.height = height;
    }
    return AABBC;
})();
var SpriteC = (function () {
    function SpriteC(image) {
        this.name = "sprite";
        this.redraw = true;
        this.image = image;
    }
    return SpriteC;
})();
var LevelC = (function () {
    function LevelC(level) {
        this.name = "level";
        this.level = level;
    }
    return LevelC;
})();
var LayerC = (function () {
    function LayerC(layer) {
        if (layer === void 0) { layer = 0; }
        this.name = "layer";
        this.layer = layer;
    }
    return LayerC;
})();
var AudioC = (function () {
    function AudioC(sound) {
        this.name = "audio";
        this.sound = new AudioPool(sound, 3);
    }
    return AudioC;
})();
var MovementC = (function () {
    function MovementC() {
        this.name = "movement";
        this.x = 0;
        this.y = 0;
    }
    return MovementC;
})();
var CollisionTypes;
(function (CollisionTypes) {
    CollisionTypes[CollisionTypes["ENTITY"] = 0] = "ENTITY";
    CollisionTypes[CollisionTypes["LEVEL"] = 1] = "LEVEL";
})(CollisionTypes || (CollisionTypes = {}));
var CollisionC = (function () {
    function CollisionC(type) {
        if (type === void 0) { type = CollisionTypes.LEVEL; }
        this.name = "collision";
        this.type = type;
    }
    return CollisionC;
})();
var PlayerC = (function () {
    function PlayerC() {
        this.name = "player";
        this.value = true;
    }
    return PlayerC;
})();
var CombatC = (function () {
    function CombatC() {
        this.name = "combat";
        this.alive = true;
    }
    return CombatC;
})();
var InputC = (function () {
    function InputC() {
        this.name = "input";
        this.value = true;
    }
    return InputC;
})();
var AIHeroC = (function () {
    function AIHeroC(path) {
        if (path === void 0) { path = []; }
        this.name = "aihero";
        this.movementCooldown = 1000;
        this.value = true;
        this.pathReady = true;
        this.AIPath = path;
    }
    return AIHeroC;
})();
