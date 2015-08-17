/// <reference path="ECS.ts"/>
function draw(ctx, e) {
    var offsetX = 0, offsetY = 0;
    if (e["tilemap"]) {
        offsetX = e["tilemap"].tilemapRef.position.x;
        offsetY = e["tilemap"].tilemapRef.position.y;
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
    if (e["tilemap"]) {
        var tile = e["tilemap"].tilemapRef.getTile(e["position"].x + e["movement"].x, e["position"].y + e["movement"].y);
        if (!tile || !tile.walkable) {
            e["movement"].x = 0;
            e["movement"].y = 0;
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
