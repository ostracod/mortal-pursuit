
var Pos = require("./pos").Pos;

var playerEntityList = [];

function PlayerEntity(player) {
    this.player = player;
    this.pos = new Pos(16 * 3, 16 * 5 + 0.999);
    this.color = 0;
    this.direction = 1;
    this.isWalking = false;
    this.isDucking = false;
    this.velY = 0.2;
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

PlayerEntity.prototype.getIsDead = function() {
    return this.player.extraFields.isDead;
}

PlayerEntity.prototype.setIsDead = function(isDead) {
    console.log(this.getUsername());
    this.player.extraFields.isDead = isDead;
}


