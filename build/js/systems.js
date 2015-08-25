/// <reference path="ECS.ts"/>
function draw(ctx, e) {
    if (e["sprite"]) {
        var offsetX = 0, offsetY = 0;
        if (e["level"]) {
            offsetX = e["level"].level.map.pos.x;
            offsetY = e["level"].level.map.pos.y;
        }
        if (e["sprite"].visable === true) {
            ctx.drawImage(e["sprite"].image, 0, 0, e["aabb"].w, e["aabb"].h, e["pos"].x * e["sprite"].image.width + offsetX, e["pos"].y * e["sprite"].image.height + offsetY, e["aabb"].w, e["aabb"].h);
        }
        e["sprite"].redraw = false;
    }
}
function input(e, delta) {
    if (e["input"]) {
        for (var cd in e["input"].cooldowns) {
            e["input"].cooldowns[cd] -= delta;
        }
        if (e["mv"]) {
            if ((Input.KB.isDown(Input.KB.KEY.D) || Input.KB.isDown(Input.KB.KEY.RIGHT)) && e["input"].cooldowns[0] <= 0) {
                e["input"].cooldowns[0] = 166;
                e["mv"].x = 1;
            }
            if ((Input.KB.isDown(Input.KB.KEY.A) || Input.KB.isDown(Input.KB.KEY.LEFT)) && e["input"].cooldowns[1] <= 0) {
                e["input"].cooldowns[1] = 166;
                e["mv"].x = -1;
            }
            if ((Input.KB.isDown(Input.KB.KEY.W) || Input.KB.isDown(Input.KB.KEY.UP)) && e["input"].cooldowns[2] <= 0) {
                e["input"].cooldowns[2] = 166;
                e["mv"].y = -1;
            }
            if ((Input.KB.isDown(Input.KB.KEY.S) || Input.KB.isDown(Input.KB.KEY.DOWN)) && e["input"].cooldowns[3] <= 0) {
                e["input"].cooldowns[3] = 166;
                e["mv"].y = 1;
            }
            if (e["input"].enabled === false) {
                e["mv"].x = e["mv"].y = 0;
            }
        }
        if (e["player"]) {
            if (Input.KB.wasDown(Input.KB.KEY.SPACE)) {
                if (e["player"] && e["haunt"]) {
                    e["haunt"].haunting = !(e["haunt"].haunting);
                }
            }
        }
    }
}
function haunt(e) {
    if (e["haunt"] && e["level"]) {
        if (e["haunt"].haunting && !e["haunt"].haunted) {
            var success = false;
            for (var _i = 0, _a = e["level"].level.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                if (!entity["player"] && !entity["aihero"] && !entity["boss"]
                    && entity["pos"] && e["pos"]
                    && entity["pos"].x === e["pos"].x
                    && entity["pos"].y === e["pos"].y) {
                    e["haunt"].haunted = entity;
                    entity["input"].enabled = e["sprite"].redraw = success = true;
                    e["input"].enabled = e["sprite"].visable = false;
                }
            }
            if (!success) {
                e["haunt"].haunting = false;
            }
        }
        else if (!e["haunt"].haunting && e["haunt"].haunted) {
            e["pos"].x = e["haunt"].haunted["pos"].x;
            e["pos"].y = e["haunt"].haunted["pos"].y;
            e["haunt"].haunted["input"].enabled = e["haunt"].haunting = false;
            e["input"].enabled = e["sprite"].visable = e["sprite"].redraw = true;
            e["haunt"].haunted = undefined;
        }
        else if (e["haunt"].haunting && e["haunt"].haunted && e["haunt"].haunted["combat"] && !e["haunt"].haunted["combat"].alive) {
            e["haunt"].haunting = false;
        }
    }
}
function collision(e) {
    if (e["level"] && e["collision"]) {
        var tile = e["level"].level.map.getTile(e["pos"].x + e["mv"].x, e["pos"].y + e["mv"].y);
        if (e["collision"].type === CollisionTypes.WORLD) {
            if (!tile || tile.value === 2) {
                e["mv"].x = 0;
                e["mv"].y = 0;
            }
        }
        else if (e["collision"].type !== CollisionTypes.WORLD && (!tile || !tile.walkable)) {
            e["mv"].x = 0;
            e["mv"].y = 0;
        }
        else if (e["collision"].type === CollisionTypes.ENTITY) {
            var occupied = false;
            var o_entity;
            for (var _i = 0, _a = e["level"].level.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                occupied = occupied || ((entity["pos"].x == (e["pos"].x + e["mv"].x))
                    && (entity["pos"].y == (e["pos"].y + e["mv"].y))
                    && (entity["collision"])
                    && entity["collision"].type === CollisionTypes.ENTITY);
                if (occupied) {
                    o_entity = entity;
                    break;
                }
            }
            if (occupied) {
                e["mv"].x = 0;
                e["mv"].y = 0;
                if (e["combat"]) {
                    e["combat"].target = o_entity;
                    console.log(e["combat"].target);
                }
            }
        }
    }
}
function combat(e) {
    if (e["aihero"] && e["combat"]) {
        if (e["combat"].target && e["combat"].target["combat"]) {
            var target = e["combat"].target;
            if (!target["combat"].alive) {
                e["combat"].target = undefined;
            }
            else {
                target["combat"].alive = false;
                target["sprite"].visable = false;
                target["sprite"].redraw = true;
                target["collision"].type = CollisionTypes.WORLD;
            }
        }
        else {
            e["combat"].target = undefined;
        }
    }
}
function AIMovement(e, delta) {
    if (e["aihero"]) {
        e["aihero"].movementCooldown -= delta;
        if (e["combat"] && e["combat"].target) {
            return;
        }
        else if (e["aihero"].movementCooldown <= 0) {
            e["aihero"].movementCooldown += 2000;
            if (e["aihero"].AIPath.length > 0) {
                if (e["aihero"].nextMove === undefined)
                    e["aihero"].nextMove = e["aihero"].AIPath.pop();
                e["mv"].x = e["aihero"].nextMove.x;
                e["mv"].y = e["aihero"].nextMove.y;
            }
        }
    }
}
function movement(e) {
    if (e["mv"] && (e["mv"].x != 0 || e["mv"].y != 0)) {
        e["pos"].x += e["mv"].x;
        e["pos"].y += e["mv"].y;
        e["mv"].x = e["mv"].y = 0;
        if (e["aihero"]) {
            e["aihero"].nextMove = undefined;
        }
        e["sprite"].redraw = true;
    }
}
function movementSound(e) {
    if (e["audio"] && e["mv"] && (e["mv"].x != 0 || e["mv"].y != 0)) {
        e["audio"].sound.play();
    }
}
