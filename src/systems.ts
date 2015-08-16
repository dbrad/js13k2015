/// <reference path="ECS.ts"/>

function draw(ctx: Context2D, e: Entity) {
    ctx.drawImage(e["sprite"].image,
        0, 0, e["aabb"].width, e["aabb"].height,
        e["position"].x * 8, e["position"].y * 8, e["aabb"].width, e["aabb"].height);
    e["sprite"].redraw = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
}

function input(e: Entity) {
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

function collision(e: Entity, world: TileMap) {
  var tile = world.getTile(e["position"].x + e["movement"].x, e["position"].y + e["movement"].y);
  if (!tile || !tile.walkable) {
      e["movement"].x = 0;
      e["movement"].y = 0;
  }
}

function movement(e: Entity) {
    if (e["movement"] && (e["movement"].x != 0 || e["movement"].y != 0)) {
        e["position"].x += e["movement"].x;
        e["position"].y += e["movement"].y;

        e["movement"].x = e["movement"].y = 0;
        e["sprite"].redraw = true;
    }
}
