/// <reference path="ECS.ts"/>
function draw(ctx, e) {
    var offsetX = 0, offsetY = 0;
    if (e["level"]) {
        offsetX = e["level"].level.tilemap.position.x;
        offsetY = e["level"].level.tilemap.position.y;
    }
    ctx.drawImage(e["sprite"].image, 0, 0, e["aabb"].width, e["aabb"].height, e["position"].x * e["sprite"].image.width + offsetX, e["position"].y * e["sprite"].image.height + offsetY, e["aabb"].width, e["aabb"].height);
    e["sprite"].redraw = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
}
function input(e) {
    if (Input.Keyboard.wasDown(Input.Keyboard.KEY.D)) {
        e["movement"].x = 1;
    }
    if (Input.Keyboard.wasDown(Input.Keyboard.KEY.A)) {
        e["movement"].x = -1;
    }
    if (Input.Keyboard.wasDown(Input.Keyboard.KEY.W)) {
        e["movement"].y = -1;
    }
    if (Input.Keyboard.wasDown(Input.Keyboard.KEY.S)) {
        e["movement"].y = 1;
    }
}
function collision(e) {
    if (e["level"]) {
        var tile = e["level"].level.tilemap.getTile(e["position"].x + e["movement"].x, e["position"].y + e["movement"].y);
        if (!tile || !tile.walkable) {
            e["movement"].x = 0;
            e["movement"].y = 0;
        }
        else {
            var occupied = false;
            for (var _i = 0, _a = e["level"].level.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                occupied = occupied || ((entity["position"].x == (e["position"].x + e["movement"].x))
                    && (entity["position"].y == (e["position"].y + e["movement"].y)));
                if (occupied)
                    break;
            }
            if (occupied) {
                e["movement"].x = 0;
                e["movement"].y = 0;
            }
        }
    }
}
function movement(e) {
    if (e["movement"] && (e["movement"].x != 0 || e["movement"].y != 0)) {
        e["position"].x += e["movement"].x;
        e["position"].y += e["movement"].y;
        e["movement"].x = e["movement"].y = 0;
        e["sprite"].redraw = true;
    }
}