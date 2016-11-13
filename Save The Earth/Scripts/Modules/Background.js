define(function () {
    'use strict';

    var image = new Image();
    image.src = 'Images/GameImages/space-background.jpg';


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function Background(spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height) {
        this._spriteX = spriteX;
        this._spriteY = spriteY;
        this._spriteWidth = spriteWidth;
        this._spriteHeight = spriteHeight;
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    Background.prototype.getImage = function () {
        return image;
    };

    Background.prototype.getSpriteX = function () {
        return this._spriteX;
    };

    Background.prototype.getSpriteY = function () {
        return this._spriteY;
    };

    Background.prototype.getSpriteWidth = function () {
        return this._spriteWidth;
    };

    Background.prototype.getSpriteHeight = function () {
        return this._spriteHeight;
    };

    Background.prototype.getX = function () {
        return this._x;
    };

    Background.prototype.setX = function (x) {
        this._x = x;
    };

    Background.prototype.getY = function () {
        return this._y;
    };

    Background.prototype.setY = function (y) {
        this._y = y;
    };

    Background.prototype.getWidth = function () {
        return this._width;
    };

    Background.prototype.getHeight = function () {
        return this._height;
    };

    return Background;
});