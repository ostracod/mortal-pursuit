
var tempResource = require("./pos");
var Pos = tempResource.Pos;
var createPosFromJson = tempResource.createPosFromJson;
var tempResource = require("./playerEntity");
var PlayerEntity = tempResource.PlayerEntity;
var playerEntityList = tempResource.playerEntityList;

var gameUtils = require("ostracod-multiplayer").gameUtils;

function findPlayerEntityByPlayer(player) {
    var index = 0;
    while (index < playerEntityList.length) {
        var tempPlayerEntity = playerEntityList[index];
        if (tempPlayerEntity.player.username == player.username) {
            return index;
        }
        index += 1;
    }
    return -1;
}

function getPlayerEntityByPlayer(player) {
    var index = findPlayerEntityByPlayer(player);
    return playerEntityList[index];
}

function addSetRemotePlayerEntities(remotePlayerEntityList, commandList) {
    var tempDataList = [];
    var index = 0;
    while (index < remotePlayerEntityList.length) {
        var tempPlayerEntity = remotePlayerEntityList[index];
        tempDataList.push({
            username: tempPlayerEntity.getUsername(),
            score: tempPlayerEntity.getScore(),
            pos: tempPlayerEntity.pos.toJson(),
            color: tempPlayerEntity.color,
            direction: tempPlayerEntity.direction,
            isWalking: tempPlayerEntity.isWalking,
            isDucking: tempPlayerEntity.isDucking,
            velY: tempPlayerEntity.velY,
            isDead: tempPlayerEntity.isDead
        });
        index += 1;
    }
    commandList.push({
        commandName: "setRemotePlayerEntities",
        playerEntityList: tempDataList
    });
}

gameUtils.addCommandListener(
    "setLocalPlayerEntityState",
    true,
    function(command, player, commandList) {
        var tempPlayerEntity = getPlayerEntityByPlayer(player);
        tempPlayerEntity.pos = createPosFromJson(command.pos);
        tempPlayerEntity.color = command.color;
        tempPlayerEntity.direction = command.direction;
        tempPlayerEntity.isWalking = command.isWalking;
        tempPlayerEntity.isDucking = command.isDucking;
        tempPlayerEntity.velY = command.velY;
        tempPlayerEntity.isDead = command.isDead;
    }
);

gameUtils.addCommandListener(
    "getRemotePlayerEntities",
    true,
    function(command, player, commandList) {
        var tempPlayerEntityList = [];
        var index = 0;
        while (index < playerEntityList.length) {
            var tempPlayerEntity = playerEntityList[index];
            if (tempPlayerEntity.getUsername() != player.username) {
                tempPlayerEntityList.push(tempPlayerEntity);
            }
            index += 1;
        }
        addSetRemotePlayerEntities(tempPlayerEntityList, commandList);
    }
);

function GameDelegate() {
    
}

var gameDelegate = new GameDelegate();

module.exports = gameDelegate;

GameDelegate.prototype.playerEnterEvent = function(player) {
    new PlayerEntity(player);
}

GameDelegate.prototype.playerLeaveEvent = function(player) {
    var index = findPlayerEntityByPlayer(player);
    playerEntityList.splice(index, 1);
}

GameDelegate.prototype.persistEvent = function(done) {
    
    done();
}


