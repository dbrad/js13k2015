/// <reference path="ECS.ts"/>
function draw(ctx, e) {
    var offsetX = 0, offsetY = 0;
    if (e["level"]) {
        offsetX = e["level"].level.map.pos.x;
        offsetY = e["level"].level.map.pos.y;
    }
    ctx.drawImage(e["sprite"].image, 0, 0, e["aabb"].width, e["aabb"].height, e["pos"].x * e["sprite"].image.width + offsetX, e["pos"].y * e["sprite"].image.height + offsetY, e["aabb"].width, e["aabb"].height);
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
        var tile = e["level"].level.map.getTile(e["pos"].x + e["movement"].x, e["pos"].y + e["movement"].y);
        if (!tile || !tile.walkable) {
            e["movement"].x = 0;
            e["movement"].y = 0;
        }
        else {
            var occupied = false;
            for (var _i = 0, _a = e["level"].level.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                occupied = occupied || ((entity["pos"].x == (e["pos"].x + e["movement"].x))
                    && (entity["pos"].y == (e["pos"].y + e["movement"].y)));
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
function combat(e) {
    if (e["combat"] && e["combat"].target) {
    }
}
function AIMovement(e) {
    if (e["aihero"] && e["aihero"].movementCooldown <= 0) {
        e["aihero"].movementCooldown += 500;
        if (e["movement"]) {
            if (((Math.random() * 2) | 0) === 0)
                e["movement"].x = ((Math.random() * 2) | 0) === 0 ? -1 : 1;
            else
                e["movement"].y = ((Math.random() * 2) | 0) === 0 ? -1 : 1;
        }
    }
    if (e["AIPath"] && e["AIPath"].ready) {
    }
}
function movement(e) {
    if (e["movement"] && (e["movement"].x != 0 || e["movement"].y != 0)) {
        e["pos"].x += e["movement"].x;
        e["pos"].y += e["movement"].y;
        e["movement"].x = e["movement"].y = 0;
        e["sprite"].redraw = true;
    }
}
function movementSound(e) {
    if (e["audio"] && e["movement"] && (e["movement"].x != 0 || e["movement"].y != 0)) {
        e["audio"].sound.play();
    }
}
