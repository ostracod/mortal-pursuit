
var spriteSize = 16;
var spriteScale = 5;
var spritesImageHasLoaded = false;
var spritesImage;
var spritesImageSize = 8;
var canvasPixelWidth;
var canvasPixelHeight
var frameNumber = 0;

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
    49: 40, // Goal 1.
    50: 41, // Goal 2.
    35: 52, // Wall.
    91: 48, // Left grass.
    61: 49, // Center grass.
    93: 50, // Right grass.
    79: 51 // Ground.
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
        pos.x * spriteScale,
        pos.y * spriteScale,
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

function ClientDelegate() {
    
}

ClientDelegate.prototype.initialize = function() {
    canvasPixelWidth = Math.floor(canvasWidth / spriteScale);
    canvasPixelHeight = Math.floor(canvasHeight / spriteScale);
    initializeSpriteSheet(function() {});
}

ClientDelegate.prototype.setLocalPlayerInfo = function(command) {
    
}

ClientDelegate.prototype.addCommandsBeforeUpdateRequest = function() {
    
}

ClientDelegate.prototype.timerEvent = function() {
    clearCanvas();
    var tempPos = new Pos(0, 0);
    while (tempPos.y < canvasPixelHeight) {
        var tempTile = getTile(tempPos);
        var tempSprite = null;
        // Enemy.
        if (tempTile == 88) {
            if (frameNumber % 16 < 8) {
                tempSprite = 32;
            } else {
                tempSprite = 33;
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
    frameNumber += 1;
}

ClientDelegate.prototype.keyDownEvent = function(keyCode) {
    if (focusedTextInput !== null) {
        return true;
    }
    
    return true;
}

ClientDelegate.prototype.keyUpEvent = function(keyCode) {
    
    return true;
}

clientDelegate = new ClientDelegate();


