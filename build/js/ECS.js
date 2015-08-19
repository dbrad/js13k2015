/// <reference path="game_objects.ts"/>
var Entity = (function () {
    function Entity() {
        this._count = 0;
        this.components = {};
        this.id = Entity.autoID++;
    }
    Entity.prototype.addComponent = function (c) {
        if (!this.components[c.name])
            this._count++;
        this.components[c.name] = c;
        this[c.name] = this.components[c.name];
    };
    Entity.autoID = 0;
    return Entity;
})();
var PositionComponent = (function () {
    function PositionComponent(x, y) {
        this.name = "position";
        this.x = x;
        this.y = y;
    }
    return PositionComponent;
})();
var AABBComponent = (function () {
    function AABBComponent(width, height) {
        this.name = "aabb";
        this.width = width;
        this.height = height;
    }
    return AABBComponent;
})();
var SpriteComponent = (function () {
    function SpriteComponent(image) {
        this.name = "sprite";
        this.redraw = true;
        this.image = image;
    }
    return SpriteComponent;
})();
var LevelComponent = (function () {
    function LevelComponent(level) {
        this.name = "level";
        this.level = level;
    }
    return LevelComponent;
})();
var LayerComponent = (function () {
    function LayerComponent(layer) {
        if (layer === void 0) { layer = 0; }
        this.name = "layer";
        this.layer = layer;
    }
    return LayerComponent;
})();
var AudioComponent = (function () {
    function AudioComponent(sound) {
        this.name = "audio";
        this.sound = new AudioPool(sound, 3);
    }
    return AudioComponent;
})();
var MovementComponent = (function () {
    function MovementComponent() {
        this.name = "movement";
        this.x = 0;
        this.y = 0;
    }
    ;
    return MovementComponent;
})();
var PlayerComponent = (function () {
    function PlayerComponent() {
        this.name = "player";
        this.value = true;
    }
    return PlayerComponent;
})();
var InputComponent = (function () {
    function InputComponent() {
        this.name = "input";
        this.value = true;
    }
    return InputComponent;
})();
