define(['AmmunitionType'], function(AmmunitionType) {
    'use strict';

    var LASER_IMAGE_SRC = 'Images/GameImages/laser.png',
        NUCLEAR_BOMB_IMAGE_SRC = 'Images/GameImages/nuclear-bomb.png',
        MISSILE_IMAGE_SRC = 'Images/GameImages/missile.png',
        LASER_SPEED = 10,
        NUCLEAR_BOMB_SPEED = 3,
        MISSILE_SPEED = 5,
        LASER_IMAGE_SIZE = 10,
        MISSILE_IMAGE_SIZE = 20,
        NUCLEAR_BOMB_IMAGE_SIZE = 20;


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function Ammunition(x, y, type) {
        this._x = x;
        this._y = y;
        this._type = type;
        this._speed = 0;
        this._image = new Image();

        determineSpeedAndImage.call(this)
    }

    Ammunition.prototype.getX = function() {
        return this._x;
    };

    Ammunition.prototype.setX = function (x) {
        this._x = x;
    };

    Ammunition.prototype.getY = function() {
        return this._y;
    };

    Ammunition.prototype.setY = function (y) {
        this._y = y;
    };

    Ammunition.prototype.getSpeed = function () {
        return this._speed;
    };

    Ammunition.prototype.getImage = function () {
        return this._image;
    };


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    function determineSpeedAndImage() {
        switch (this._type) {
            case AmmunitionType.LASER:
                this._speed = LASER_SPEED;
                this._image.width = LASER_IMAGE_SIZE;
                this._image.height = LASER_IMAGE_SIZE;
                this._image.src = LASER_IMAGE_SRC;
                break;
            case AmmunitionType.NUCLEAR_BOMB:
                this._speed = NUCLEAR_BOMB_SPEED;
                this._image.width = NUCLEAR_BOMB_IMAGE_SIZE + 10;
                this._image.height = NUCLEAR_BOMB_IMAGE_SIZE * 2;
                this._image.src = NUCLEAR_BOMB_IMAGE_SRC;
                break;
            case AmmunitionType.MISSILE:
                this._speed = MISSILE_SPEED;
                this._image.width = MISSILE_IMAGE_SIZE;
                this._image.height = MISSILE_IMAGE_SIZE * 2;
                this._image.src = MISSILE_IMAGE_SRC;
                break;
            default:
                throw new TypeError ('Invalid type of ammunition!');
        }
    }

    return Ammunition;
});