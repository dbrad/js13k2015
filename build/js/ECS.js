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
    function AABBC(w, h) {
        this.name = "aabb";
        this.w = w;
        this.h = h;
    }
    return AABBC;
})();
var SpriteC = (function () {
    function SpriteC(image) {
        this.name = "sprite";
        this.redraw = true;
        this.visable = true;
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
var AudioC = (function () {
    function AudioC(sound) {
        this.name = "audio";
        this.sound = new AudioPool(sound, 3);
    }
    return AudioC;
})();
var MovementC = (function () {
    function MovementC() {
        this.name = "mv";
        this.x = 0;
        this.y = 0;
    }
    return MovementC;
})();
var CollisionTypes;
(function (CollisionTypes) {
    CollisionTypes[CollisionTypes["ENTITY"] = 0] = "ENTITY";
    CollisionTypes[CollisionTypes["LEVEL"] = 1] = "LEVEL";
    CollisionTypes[CollisionTypes["WORLD"] = 2] = "WORLD";
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
var AIHeroC = (function () {
    function AIHeroC(path) {
        if (path === void 0) { path = []; }
        this.name = "aihero";
        this.movementCooldown = 5000;
        this.value = true;
        this.pathReady = true;
        this.AIPath = path;
    }
    return AIHeroC;
})();
var BossC = (function () {
    function BossC() {
        this.name = "boss";
        this.value = true;
    }
    return BossC;
})();
var CombatC = (function () {
    function CombatC() {
        this.name = "combat";
        this.alive = true;
    }
    return CombatC;
})();
var InputC = (function () {
    function InputC(enabled) {
        if (enabled === void 0) { enabled = true; }
        this.name = "input";
        this.enabled = true;
        this.cooldowns = [];
        this.enabled = enabled;
        this.cooldowns[0] = this.cooldowns[1] = this.cooldowns[2] = this.cooldowns[3] = 0;
    }
    return InputC;
})();
var HauntC = (function () {
    function HauntC() {
        this.name = "haunt";
        this.haunting = false;
    }
    return HauntC;
})();
var XPC = (function () {
    function XPC(xp) {
        if (xp === void 0) { xp = 0; }
        this.name = "xp";
        this.value = 0;
        this.value = xp;
    }
    return XPC;
})();
var LVLC = (function () {
    function LVLC(lvl) {
        if (lvl === void 0) { lvl = 1; }
        this.name = "lvl";
        this.value = lvl;
    }
    return LVLC;
})();
var HPC = (function () {
    function HPC(hp) {
        if (hp === void 0) { hp = 5; }
        this.name = "hp";
        this.value = hp;
    }
    return HPC;
})();
