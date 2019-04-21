
var Pos = require("./pos").Pos;

var playerEntityList = [];

function PlayerEntity(player) {
    this.player = player;
    this.pos = new Pos(16 * 3, 16 * 5 + 0.999);
    playerEntityList.push(this);
}

module.exports = {
    PlayerEntity: PlayerEntity,
    playerEntityList: playerEntityList,
};

PlayerEntity.prototype.getUsername = function() {
    return this.player.username;
}

PlayerEntity.prototype.getScore = function() {
    return this.player.score;
}

PlayerEntity.prototype.setScore = function(score) {
    this.player.score = score;
}


