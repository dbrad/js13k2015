/// <reference path="ECS.ts"/>

function draw(ctx: Context2D, e: Entity) {
    var offsetX: number = 0, offsetY: number = 0;
    if (e["level"]) {
        offsetX = e["level"].level.map.pos.x;
        offsetY = e["level"].level.map.pos.y;
    }
    ctx.drawImage(e["sprite"].image,
        0, 0, e["aabb"].width, e["aabb"].height,
        e["pos"].x * e["sprite"].image.width + offsetX,
        e["pos"].y * e["sprite"].image.height + offsetY,
        e["aabb"].width, e["aabb"].height);
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

function collision(e: Entity) {
    if (e["level"] && e["collision"]) {
        var tile = e["level"].level.map.getTile(
            e["pos"].x + e["movement"].x, e["pos"].y + e["movement"].y);
        if (!tile || !tile.walkable) {
            e["movement"].x = 0;
            e["movement"].y = 0;
        } else if (e["collision"].type == CollisionTypes.ENTITY) {
            var occupied: boolean = false;
            var o_entity: Entity;
            for (var entity of e["level"].level.entities) {
                occupied = occupied || ((entity["pos"].x == (e["pos"].x + e["movement"].x))
                    && (entity["pos"].y == (e["pos"].y + e["movement"].y))
                    && (entity["collision"]));
                if (occupied) {
                    o_entity = entity;
                    break;
                }
            }
            if (occupied) {
                e["movement"].x = 0;
                e["movement"].y = 0;
                if (e["combat"]) {
                    e["combat"].target = o_entity;
                    console.log(e["combat"].target);
                }
            }
        }
    }
}

function combat(e: Entity) {
    if (e["combat"] && e["combat"].target && e["combat"].target["combat"]) {
        if (!e["combat"].target["combat"].alive) {
            e["combat"].target = undefined;
        } else {
            // DO COMBAT!
        }
    } else { // Non-Combat Target
        e["combat"].target = undefined;
    }
}

function AIMovement(e: Entity) {
    if (e["combat"] && e["combat"].target) {
        return;
    } else if (e["aihero"] && e["aihero"].movementCooldown <= 0) {
        e["aihero"].movementCooldown += 1000;
        // Place Holder random movement
        if (e["movement"]) {
            if(((Math.random() * 2) | 0) === 0)
                e["movement"].x = ((Math.random() * 2) | 0) === 0 ? -1 : 1;
            else
                e["movement"].y = ((Math.random() * 2) | 0) === 0 ? -1 : 1;
        }
    }
    if (e["aihero"] && e["aihero"].pathReady) {
        // Follow A* path
    }
}

function movement(e: Entity) {
    if (e["movement"] && (e["movement"].x != 0 || e["movement"].y != 0)) {
        e["pos"].x += e["movement"].x;
        e["pos"].y += e["movement"].y;
        e["movement"].x = e["movement"].y = 0;
        e["sprite"].redraw = true;
    }
}

function movementSound(e: Entity) {
    if (e["audio"] && e["movement"] && (e["movement"].x != 0 || e["movement"].y != 0)) {
        e["audio"].sound.play();
    }
}
