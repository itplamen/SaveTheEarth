define(['GlobalConstants', 'RandomGenerator'], function(GlobalConstants, RandomGenerator) {
    'use strict';

    var START_Y = -50,
        size = 30,
        speed = 0.5;


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function Bonus(ID) {
        this._x = getRandomX.call(this);
        this._y = START_Y;
        this._displayTime = 0;
        this._name = getNameByID(ID);
        this._image = createBonusImage.call(this);
        this._isShown = false;
        this._isTaken = false;
    }

    Bonus.prototype.getImage = function () {
        return this._image;
    };

    Bonus.prototype.getX = function () {
        return this._x;
    };

    Bonus.prototype.getY = function () {
        return this._y;
    };

    Bonus.prototype.setY = function (y) {
        this._y = y;
    };

    Bonus.prototype.getSize = function () {
        return size;
    };

    Bonus.prototype.getSpeed = function () {
        return speed;
    };

    Bonus.prototype.getDisplayTime = function () {
        return this._displayTime;
    };

    Bonus.prototype.setDisplayTime = function (displayTime) {
        this._displayTime = displayTime;
    };

    Bonus.prototype.getName = function () {
        return this._name;
    };

    Bonus.prototype.getIsShown = function () {
        return this._isShown;
    };

    Bonus.prototype.setIsShown = function (isShown) {
        this._isShown = isShown;
    };

    Bonus.prototype.getIsTaken = function () {
        return this._isTaken;
    };

    Bonus.prototype.setIsTaken = function (isTaken) {
        this._isTaken = isTaken;
    };


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    function getRandomX() {
        return RandomGenerator.getRandomNumber(size, GlobalConstants.canvas.width);
    }

    function getNameByID(ID) {
        var bonusName = '';

        switch (ID) {
            case GlobalConstants.bonuses.live.id:
                bonusName = GlobalConstants.bonuses.live.name;
                break;
            case GlobalConstants.bonuses.speed.id:
                bonusName = GlobalConstants.bonuses.speed.name;
                break;
            case GlobalConstants.bonuses.points.id:
                bonusName = GlobalConstants.bonuses.points.name;
                break;
            case GlobalConstants.bonuses.missile.id:
                bonusName = GlobalConstants.bonuses.missile.name;
                break;
            case GlobalConstants.bonuses.shield.id:
                bonusName = GlobalConstants.bonuses.shield.name;
                break;
            default:
                throw new Error('Invalid bonus ID!');
        }

        return bonusName;
    }

    function createBonusImage() {
        var image = new Image();
        image.src = 'Images/GameImages/Bonuses/' + this._name + '-bonus.png';
        return image;
    }

    return Bonus;
});