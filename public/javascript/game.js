
var spriteSize = 16;
var spriteScale = 5;
var spritesImageHasLoaded = false;
var spritesImage;
var spritesImageSize = 8;

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

function ClientDelegate() {
    
}

ClientDelegate.prototype.initialize = function() {
    initializeSpriteSheet(function() {});
}

ClientDelegate.prototype.setLocalPlayerInfo = function(command) {
    
}

ClientDelegate.prototype.addCommandsBeforeUpdateRequest = function() {
    
}

ClientDelegate.prototype.timerEvent = function() {
    clearCanvas();
    var tempSprite = 0;
    var tempPos = new Pos(0, spriteSize);
    while (tempPos.x < canvasWidth) {
        drawSprite(tempPos, tempSprite);
        tempSprite += 1;
        if (tempSprite > 5) {
            tempSprite = 0;
        }
        tempPos.x += spriteSize;
    }
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


