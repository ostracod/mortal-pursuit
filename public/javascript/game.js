
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

var tileSpriteMap = {
    49: 48, // Goal 1.
    50: 49, // Goal 2.
    35: 60, // Wall.
    91: 56, // Left grass.
    61: 57, // Center grass.
    93: 58, // Right grass.
    79: 59 // Ground.
};

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
        Math.round(pos.x) * spriteScale,
        Math.round(pos.y) * spriteScale,
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
    playerList.push(this);
}

Player.prototype.startWalking = function(direction) {
    if (localPlayer.direction == direction && localPlayer.isWalking) {
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

Player.prototype.tick = function() {
    if (this.isWalking && !this.isDucking) {
        this.pos.x += this.direction;
        this.walkFrameCount += 1;
    }
    this.isBlinking = (this.blinkDelay < 4);
    this.blinkDelay += 1;
    if (this.blinkDelay > this.maximumBlinkDelay) {
        this.blinkDelay = 0;
        this.maximumBlinkDelay = 80 + Math.floor(Math.random() * 200);
    }
}

Player.prototype.draw = function() {
    var tempSprite;
    if (this.isDucking) {
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
    drawSprite(this.pos, tempSprite);
}

function ClientDelegate() {
    
}

ClientDelegate.prototype.initialize = function() {
    canvasPixelWidth = Math.floor(canvasWidth / spriteScale);
    canvasPixelHeight = Math.floor(canvasHeight / spriteScale);
    localPlayer = new Player(new Pos(spriteSize * 3, spriteSize * 6), 0);
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
        if (tempTile == 88) {
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


