function draw(t,e){var i=0,n=0;e.level&&(i=e.level.level.tilemap.position.x,n=e.level.level.tilemap.position.y),t.drawImage(e.sprite.image,0,0,e.aabb.width,e.aabb.height,e.position.x*e.sprite.image.width+i,e.position.y*e.sprite.image.height+n,e.aabb.width,e.aabb.height),e.sprite.redraw=!1,t.mozImageSmoothingEnabled=!1,t.imageSmoothingEnabled=!1}function input(t){Input.Keyboard.wasDown(Input.Keyboard.KEY.D)&&(t.movement.x=1),Input.Keyboard.wasDown(Input.Keyboard.KEY.A)&&(t.movement.x=-1),Input.Keyboard.wasDown(Input.Keyboard.KEY.W)&&(t.movement.y=-1),Input.Keyboard.wasDown(Input.Keyboard.KEY.S)&&(t.movement.y=1)}function collision(t){if(t.level){var e=t.level.level.tilemap.getTile(t.position.x+t.movement.x,t.position.y+t.movement.y);if(e&&e.walkable){for(var i=!1,n=0,o=t.level.level.entities;n<o.length;n++){var s=o[n];if(i=i||s.position.x==t.position.x+t.movement.x&&s.position.y==t.position.y+t.movement.y)break}i&&(t.movement.x=0,t.movement.y=0)}else t.movement.x=0,t.movement.y=0}}function movement(t){!t.movement||0==t.movement.x&&0==t.movement.y||(t.position.x+=t.movement.x,t.position.y+=t.movement.y,t.movement.x=t.movement.y=0,t.sprite.redraw=!0)}function onResize(){var t=document.getElementById("gameCanvas"),e=window.innerWidth/t.width,i=window.innerHeight/t.height,n=0|Math.min(e,i);n=0>=n?1:n;var o=[t.width*n,t.height*n],s=this.offset=[(window.innerWidth-o[0])/2,(window.innerHeight-o[1])/2],h=document.getElementById("stage"),r="translate("+s[0]+"px, "+s[1]+"px) scale("+n+")";h.style.transform=r,h.style.webkitTransform=r}var Input;!function(t){var e;!function(t){function e(t){return s[t]}function i(t){var e=r[t];return r[t]=!1,e}function n(t){var e=t.which;s[e]=!0,h[e]&&(r[e]=!0),h[e]=!1}function o(t){var e=t.which;s[e]=!1,h[e]=!0}!function(t){t[t.A=65]="A",t[t.D=68]="D",t[t.W=87]="W",t[t.S=83]="S",t[t.ENTER=13]="ENTER",t[t.SPACE=32]="SPACE"}(t.KEY||(t.KEY={}));for(var s=(t.KEY,[]),h=[],r=[],a=0;256>a;a++)h[a]=!0;t.isDown=e,t.wasDown=i,t.keyDown=n,t.keyUp=o}(e=t.Keyboard||(t.Keyboard={}))}(Input||(Input={}));var __extends=this&&this.__extends||function(t,e){function i(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)},Context2D=function(t){function e(){t.apply(this,arguments)}return __extends(e,t),e}(CanvasRenderingContext2D),Point=function(){function t(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.x=t,this.y=e}return t.from=function(e,i){return new t(e,i)},t}(),Dimension=function(){function t(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.width=t,this.height=e}return t.from=function(e,i){return new t(e,i)},t}(),Tile=function(){function t(t){this.texture=t,this.size=new Dimension(t.width,t.height)}return t.prototype.draw=function(t,e,i){t.drawImage(this.texture,0,0,this.size.width,this.size.height,e,i,this.size.width,this.size.height)},t}(),SpriteSheet=function(){function t(t,e,i,n,o,s){void 0===n&&(n=0),void 0===o&&(o=new Dimension(0,0)),void 0===s&&(s=new Point(0,0)),this.sprites=[],this.name=e,this.offset=s,this.subsheet=o,this.tileSize=i,this.gutter=n,this.image=ImageCache.getTexture(t),this.storeSprites()}return t.prototype.storeSprites=function(t){void 0===t&&(t=null),this.spritesPerRow=0===this.subsheet.width||0===this.subsheet.height?this.image.width/this.tileSize:this.subsheet.width,this.spritesPerCol=0===this.subsheet.width||0===this.subsheet.height?this.image.height/this.tileSize:this.subsheet.height;for(var e,i=0;i<this.spritesPerCol;i++)for(var n=0;n<this.spritesPerRow;n++)e=this.sprites[n+i*this.spritesPerRow]=document.createElement("canvas"),e.width=this.tileSize,e.height=this.tileSize,e.getContext("2d").drawImage(this.image,(this.tileSize+this.gutter)*n+this.offset.x,(this.tileSize+this.gutter)*i+this.offset.y,this.tileSize,this.tileSize,0,0,this.tileSize,this.tileSize)},t}(),SpriteSheetCache;!function(t){function e(t){n[t.name]=t}function i(t){return n[t]}var n={};t.storeSheet=e,t.spriteSheet=i}(SpriteSheetCache||(SpriteSheetCache={}));var ImageCache;!function(t){function e(t){return i[t]}var i={};t.getTexture=e;var n,o={},s=0;!function(t){function e(t,e){o[t]=e,s++}function n(t){var e={counter:0,loadCount:0,callback:t},n=function(t){t.counter++===t.loadCount&&t.callback()};for(var h in o)i[h]=new Image,i[h].src=o[h],i[h].onload=n.bind(this,e),delete o[h];s=0}t.add=e,t.load=n}(n=t.Loader||(t.Loader={}))}(ImageCache||(ImageCache={}));var __extends=this&&this.__extends||function(t,e){function i(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)},VTile=function(t){function e(e,i){void 0===i&&(i=!0),t.call(this,e),this.walkable=i}return __extends(e,t),e}(Tile),TileSet=function(){function t(t){this.tiles=[],this.tileSize=t.tileSize;for(var e=0;e<t.sprites.length;e++)this.tiles.push(new VTile(t.sprites[e]))}return t}(),TileMap=function(){function t(t,e){void 0===t&&(t=new Dimension(1,1)),void 0===e&&(e=new Point(0,0)),this.cached=!1,this.size=t,this.position=e,this.tiles=[],this.cache=document.createElement("canvas")}return t.prototype.setTile=function(t,e,i){this.tiles[t+e*this.size.width]=i},t.prototype.getTile=function(t,e){if(t==this.size.width||0>t||e==this.size.height||0>e)return void 0;var i=this.tiles[t+e*this.size.width];return this.tileSet.tiles[i]},t.prototype.setTileSet=function(t){this.tileSet=t},t.prototype.generateTest=function(){for(var t=0;t<this.size.width*this.size.height;t++)this.tiles[t]=0},t.prototype.draw=function(t){var e=t;if(!this.cached){this.cache.width=8*this.size.width,this.cache.height=8*this.size.height;for(var t=this.cache.getContext("2d"),i=0;i<this.size.height;i++)for(var n=0;n<this.size.width;n++)this.getTile(n,i).draw(t,8*n,8*i);this.cached=!0}e.drawImage(this.cache,this.position.x,this.position.y)},t}(),Level=function(){function t(e){void 0===e&&(e=new TileMap(Dimension.from(30,25),Point.from(8,32))),this.tilemap=e,this.tilemap.setTileSet(t.defaultTileSet),this.tilemap.generateTest(),this.entities=[]}return t}(),Entity=function(){function t(){this._count=0,this.components={},this.id=t.autoID++}return t.prototype.addComponent=function(t){this.components[t.name]||this._count++,this.components[t.name]=t,this[t.name]=this.components[t.name]},t.autoID=0,t}(),PositionComponent=function(){function t(t,e){this.name="position",this.x=t,this.y=e}return t}(),AABBComponent=function(){function t(t,e){this.name="aabb",this.width=t,this.height=e}return t}(),SpriteComponent=function(){function t(t){this.name="sprite",this.redraw=!0,this.image=t}return t}(),LevelComponent=function(){function t(t){this.name="level",this.level=t}return t}(),LayerComponent=function(){function t(t){void 0===t&&(t=0),this.name="layer",this.layer=t}return t}(),MovementComponent=function(){function t(){this.name="movement",this.x=0,this.y=0}return t}(),PlayerComponent=function(){function t(){this.name="player",this.value=!0}return t}(),InputComponent=function(){function t(){this.name="input",this.value=!0}return t}(),Game=function(){function t(t){this.entities=[],this.testAudio=new Audio("blip.wav"),this.change=!0,this.clearScreen=!0,this.then=performance.now(),console.log("Setting up screen"),this.screen=t,this.ctx=t.getContext("2d"),this.ctx.mozImageSmoothingEnabled=!1,this.ctx.imageSmoothingEnabled=!1}return t.prototype.init=function(){console.log("Initializing..."),SpriteSheetCache.storeSheet(new SpriteSheet("sheet","pieces",8,0,new Dimension(1,1))),SpriteSheetCache.storeSheet(new SpriteSheet("sheet","board",8,0,new Dimension(1,1),new Point(0,8))),SpriteSheetCache.storeSheet(new SpriteSheet("sheet","numbers",8,0,new Dimension(10,1),new Point(0,16))),Level.defaultTileSet=new TileSet(SpriteSheetCache.spriteSheet("board")),this.World=new Level,this.pEntity=new Entity,this.pEntity.addComponent(new InputComponent),this.pEntity.addComponent(new MovementComponent),this.pEntity.addComponent(new LevelComponent(this.World)),this.pEntity.addComponent(new PositionComponent(0,0)),this.pEntity.addComponent(new AABBComponent(8,8)),this.pEntity.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("pieces").sprites[0]));for(var t=0;30>t;t++){var e=new Entity;e.addComponent(new PositionComponent(t+1,t%4)),e.addComponent(new AABBComponent(8,8)),e.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("numbers").sprites[t%10])),this.entities.push(e)}for(var t=0;25>t;t++){var e=new Entity;e.addComponent(new PositionComponent(30*Math.random()|0,25*Math.random()|0)),e.addComponent(new LevelComponent(this.World)),e.addComponent(new AABBComponent(8,8)),e.addComponent(new SpriteComponent(SpriteSheetCache.spriteSheet("pieces").sprites[0])),this.World.entities.push(e)}this.testAudio.play()},t.prototype.update=function(t){input(this.pEntity),(0!=this.pEntity.movement.x||0!=this.pEntity.movement.y)&&collision(this.pEntity),movement(this.pEntity)},t.prototype.draw=function(){this.clearScreen&&(this.ctx.clearRect(0,0,this.screen.width,this.screen.height),this.clearScreen=!1);for(var t=0,e=this.entities;t<e.length;t++){var i=e[t];i.sprite.redraw&&draw(this.ctx,i)}if(this.pEntity.sprite.redraw||this.change){this.World.tilemap.draw(this.ctx),draw(this.ctx,this.pEntity);for(var n=0,o=this.World.entities;n<o.length;n++){var i=o[n];draw(this.ctx,i)}this.change=!1}},t.prototype.render=function(){var t=performance.now(),e=t-this.then;this.then=t,this.update(e),this.draw(),this._loopHandle=window.requestAnimationFrame(this.render.bind(this))},t.prototype.run=function(){console.log("Game running"),this._loopHandle=window.requestAnimationFrame(this.render.bind(this))},t.prototype.stop=function(){console.log("Game stopped"),window.cancelAnimationFrame(this._loopHandle)},t}();window.onload=function(){onResize(),window.addEventListener("resize",onResize,!1),window.onkeydown=Input.Keyboard.keyDown,window.onkeyup=Input.Keyboard.keyUp;var t=new Game(document.getElementById("gameCanvas"));ImageCache.Loader.add("sheet","sheet.png"),ImageCache.Loader.load(function(){t.init(),t.run()})};