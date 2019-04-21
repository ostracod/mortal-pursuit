
var spriteSize = 16;
var spriteScale = 5;
var spritesImageHasLoaded = false;
var spritesImage;
var spritesImageSize = 8;
var canvasPixelWidth;
var canvasPixelHeight
var frameNumber = 0;
var playerList = [];
var localPlayer;
var collisionOffsetSet = [
    new Pos(1, 1),
    new Pos(14, 1),
    new Pos(1, 15),
    new Pos(14, 15),
];
var gravity = 0.185;

var tileData = [
    "...............",
    "...............",
    "...............",
    "...............",
    ".#...........#.",
    ".#.......X...#.",
    ".1...........2.",
    "====].[========",
    "OOOOOXOOOOOOOOO",
    "OOOOOOOOOOOOOOO",
];

var tileSet = {
    EMPTY: 46,
    ENEMY: 88,
    GOAL_1: 49,
    GOAL_2: 50,
    WALL: 35,
    LEFT_GRASS: 91,
    CENTER_GRASS: 61,
    RIGHT_GRASS: 93,
    GROUND: 79
}

var tileSpriteMap = {};
tileSpriteMap[tileSet.GOAL_1] = 48;
tileSpriteMap[tileSet.GOAL_2] = 49;
tileSpriteMap[tileSet.WALL] = 60;
tileSpriteMap[tileSet.LEFT_GRASS] = 56;
tileSpriteMap[tileSet.CENTER_GRASS] = 57;
tileSpriteMap[tileSet.RIGHT_GRASS] = 58;
tileSpriteMap[tileSet.GROUND] = 59;

function drawSprite(pos, which) {
    if (!spritesImageHasLoaded) {
        return;
    }
    var tempClipX = (which % spritesImageSize) * spriteSize;
    var tempClipY = Math.floor(which / spritesImageSize) * spriteSize;
    context.imageSmoothingEnabled = false;
    context.drawImage(
        spritesImage,
        tempClipX,
        tempClipY,
        spriteSize,
        spriteSize,
        Math.floor(pos.x) * spriteScale,
        Math.floor(pos.y) * spriteScale,
        spriteSize * spriteScale,
        spriteSize * spriteScale
    );
}

function initializeSpriteSheet(done) {
    spritesImage = new Image();
    spritesImage.onload = function() {
        spritesImageHasLoaded = true;
        done();
    }
    spritesImage.src = "/images/sprites.png";
}

function getTile(pos) {
    var tempLine = tileData[Math.floor(pos.y / spriteSize)];
    return tempLine.charCodeAt(Math.floor(pos.x / spriteSize));
}

function Player(pos, color) {
    this.pos = pos;
    this.color = color;
    this.direction = 1;
    this.isWalking = false;
    this.isDucking = false;
    this.walkFrameCount = 0;
    this.isBlinking = false;
    this.blinkDelay = 0;
    this.maximumBlinkDelay = 20;
    this.velY = gravity;
    this.isOnGround = true;
    this.isDead = false;
    playerList.push(this);
}

Player.prototype.startWalking = function(direction) {
    if ((localPlayer.direction == direction && localPlayer.isWalking)
            || this.isDead) {
        return;
    }
    if (!localPlayer.isWalking) {
        this.walkFrameCount = 0;
    }
    this.direction = direction;
    this.isWalking = true;
}

Player.prototype.stopWalking = function(direction) {
    if (localPlayer.direction != direction || !localPlayer.isWalking) {
        return;
    }
    this.isWalking = false;
}

Player.prototype.jump = function() {
    if (!this.isOnGround || this.isDead) {
        return;
    }
    localPlayer.velY = -2.5;
}

Player.prototype.setColor = function(color) {
    if (this.color == color) {
        return;
    }
    this.color = color;
}

Player.prototype.die = function() {
    if (this.isDead) {
        return;
    }
    this.isDead = true;
    this.isWalking = false;
    this.deathDelay = 0;
}

Player.prototype.move = function(offsetX, offsetY) {
    var tempPos = new Pos(0, 0);
    while (Math.abs(offsetX) > 0 || Math.abs(offsetY) > 0) {
        var tempLastPosX = this.pos.x;
        var tempLastPosY = this.pos.y;
        if (offsetX > 0) {
            if (offsetX > 1) {
                this.pos.x += 1;
                offsetX -= 1;
            } else {
                this.pos.x += offsetX;
                offsetX = 0;
            }
        }
        if (offsetX < 0) {
            if (offsetX < -1) {
                this.pos.x -= 1;
                offsetX += 1;
            } else {
                this.pos.x += offsetX;
                offsetX = 0;
            }
        }
        if (offsetY > 0) {
            if (offsetY > 1) {
                this.pos.y += 1;
                offsetY -= 1;
            } else {
                this.pos.y += offsetY;
                offsetY = 0;
            }
        }
        if (offsetY < 0) {
            if (offsetY < -1) {
                this.pos.y -= 1;
                offsetY += 1;
            } else {
                this.pos.y += offsetY;
                offsetY = 0;
            }
        }
        var tempHasCollision = false;
        var index = 0;
        while (index < collisionOffsetSet.length) {
            var tempOffset = collisionOffsetSet[index];
            tempPos.x = this.pos.x + tempOffset.x;
            tempPos.y = this.pos.y + tempOffset.y;
            var tempTile = getTile(tempPos);
            if (tempTile != tileSet.EMPTY && tempTile != tileSet.ENEMY) {
                if (tempTile == tileSet.GOAL_1) {
                    this.setColor(0);
                }
                if (tempTile == tileSet.GOAL_2) {
                    this.setColor(1);
                }
                tempHasCollision = true;
            }
            index += 1;
        }
        if (tempHasCollision) {
            this.pos.x = tempLastPosX;
            this.pos.y = tempLastPosY;
            return true;
        }
    }
    return false;
}

Player.prototype.tick = function() {
    if (this.isWalking && !(this.isDucking && this.isOnGround)) {
        this.move(this.direction * 1.9, 0);
        this.walkFrameCount += 1;
    }
    var tempResult = this.move(0, this.velY);
    var tempHasTouchedGround = false;
    if (tempResult) {
        if (this.velY > 0) {
            tempHasTouchedGround = true;
            this.pos.y = Math.round(this.pos.y / spriteSize) * spriteSize + 0.999;
        }
        this.velY = 0;
    }
    this.isOnGround = tempHasTouchedGround;
    this.velY += gravity;
    this.isBlinking = (this.blinkDelay < 4);
    this.blinkDelay += 1;
    if (this.blinkDelay > this.maximumBlinkDelay) {
        this.blinkDelay = 0;
        this.maximumBlinkDelay = 80 + Math.floor(Math.random() * 200);
    }
    var tempPos = this.pos.copy();
    tempPos.x += 8;
    tempPos.y += 8;
    var tempTile = getTile(tempPos);
    if (tempTile == tileSet.ENEMY) {
        this.die();
    }
    if (this.isDead) {
        this.deathDelay += 1;
        if (this.deathDelay > 150) {
            alert("You have died. Game over.");
            hasStopped = true;
            window.location = "menu";
        }
    }
}

Player.prototype.draw = function() {
    var tempSprite;
    if (this.isDead) {
        tempSprite = 32;
    } else {
        if (!this.isOnGround) {
            tempSprite = 2;
        } else if (this.isDucking) {
            tempSprite = 3;
        } else if (this.isWalking && this.walkFrameCount % 12 < 6) {
            tempSprite = 1;
        } else {
            tempSprite = 0;
        }
        if (this.direction < 0) {
            tempSprite += 4;
        }
        if (this.isBlinking) {
            tempSprite += 8;
        }
        tempSprite += this.color * 16;
    }
    drawSprite(this.pos, tempSprite);
}

function ClientDelegate() {
    
}

ClientDelegate.prototype.initialize = function() {
    canvasPixelWidth = Math.floor(canvasWidth / spriteScale);
    canvasPixelHeight = Math.floor(canvasHeight / spriteScale);
    localPlayer = new Player(new Pos(spriteSize * 3, spriteSize * 6 + 0.999), 0);
    initializeSpriteSheet(function() {});
}

ClientDelegate.prototype.setLocalPlayerInfo = function(command) {
    
}

ClientDelegate.prototype.addCommandsBeforeUpdateRequest = function() {
    
}

ClientDelegate.prototype.timerEvent = function() {
    var index = 0;
    while (index < playerList.length) {
        var tempPlayer = playerList[index];
        tempPlayer.tick();
        index += 1;
    }
    clearCanvas();
    var tempPos = new Pos(0, 0);
    while (tempPos.y < canvasPixelHeight) {
        var tempTile = getTile(tempPos);
        var tempSprite = null;
        // Enemy.
        if (tempTile == tileSet.ENEMY) {
            if (frameNumber % 20 < 10) {
                tempSprite = 40;
            } else {
                tempSprite = 41;
            }
        } else if (tempTile in tileSpriteMap) {
            tempSprite = tileSpriteMap[tempTile];
        }
        if (tempSprite !== null) {
            drawSprite(tempPos, tempSprite);
        }
        tempSprite += 1;
        if (tempSprite > 5) {
            tempSprite = 0;
        }
        tempPos.x += spriteSize;
        if (tempPos.x >= canvasPixelWidth) {
            tempPos.x = 0;
            tempPos.y += spriteSize;
        }
    }
    var index = 0;
    while (index < playerList.length) {
        var tempPlayer = playerList[index];
        tempPlayer.draw();
        index += 1;
    }
    frameNumber += 1;
}

ClientDelegate.prototype.keyDownEvent = function(keyCode) {
    if (focusedTextInput !== null) {
        return true;
    }
    if (keyCode == 65 || keyCode == 37) {
        localPlayer.startWalking(-1);
    }
    if (keyCode == 68 || keyCode == 39) {
        localPlayer.startWalking(1);
    }
    if (keyCode == 87 || keyCode == 38) {
        localPlayer.jump();
    }
    if (keyCode == 83 || keyCode == 40) {
        localPlayer.isDucking = true;
    }
    return true;
}

ClientDelegate.prototype.keyUpEvent = function(keyCode) {
    if (keyCode == 65 || keyCode == 37) {
        localPlayer.stopWalking(-1);
    }
    if (keyCode == 68 || keyCode == 39) {
        localPlayer.stopWalking(1);
    }
    if (keyCode == 83 || keyCode == 40) {
        localPlayer.isDucking = false;
    }
    return true;
}

clientDelegate = new ClientDelegate();


