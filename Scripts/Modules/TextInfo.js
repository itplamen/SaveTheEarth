define(function() {
    'use strict';

    var speed = 2,
        font = '20px Arial',
        fillStyle = 'yellow';


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function TextInfo(x, y, text) {
        this._x = x;
        this._y = y;
        this._text = text;
        this._displayTime = 0;
        this._isShown = true;
    }

    TextInfo.prototype.getX = function () {
        return this._x;
    };

    TextInfo.prototype.setY = function (value) {
        this._y = value;
    };

    TextInfo.prototype.getY = function () {
        return this._y;
    };

    TextInfo.prototype.getText = function () {
        return this._text;
    };

    TextInfo.prototype.getSpeed = function () {
        return speed;
    };

    TextInfo.prototype.getFont = function () {
        return font;
    };

    TextInfo.prototype.getFillStyle = function () {
        return fillStyle;
    };

    TextInfo.prototype.increaseDisplayTime = function () {
        this._displayTime += 1;
    };

    TextInfo.prototype.getDisplayTime = function () {
        return this._displayTime;
    };

    TextInfo.prototype.setIsShown = function (isShown) {
        this._isShown = isShown;
    };

    TextInfo.prototype.getIsShown = function () {
        return this._isShown;
    };

    return TextInfo;
});