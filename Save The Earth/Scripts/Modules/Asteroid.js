define(['GlobalConstants', 'RandomGenerator'], function(GlobalConstants, RandomGenerator) {
    'use strict';

    var REQUIRED_HITS_FOR_SMALL_ASTEROID = 2,
        REQUIRED_HITS_FOR_MEDIUM_ASTEROID = 4,
        REQUIRED_HITS_FOR_BIG_ASTEROID = 8,
        START_SPRITE_Y = 5,
        STEP = 65,
        FIRST_INDEX_OF_ASTEROID = 0,
        LAST_INDEX_OF_ASTEROID = 5,
        asteroidsSprite = new Image(),
        destroyedAsteroidImage = new Image();

    asteroidsSprite.src = 'Images/GameImages/asteroids-sprite.png';
    destroyedAsteroidImage.src = 'Images/GameImages/explosion-sprite.png';


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function Asteroid(size, speed) {
        this._x = getRandomXPosition();
        this._y = -size;
        this._size = size;
        this._spriteX = 10;
        this._spriteY = START_SPRITE_Y + getRandomAsteroid();
        this._spriteWidth = 0;
        this._spriteHeight = 0;
        this._speed = speed;
        this._isDestroyed = false;
        this._numberOfHits = 0;
        this._explosionX = 0;
        this._explosionY = 0;
        this._explosionDuration = 0;

        determineSpriteSize.call(this);
    }

    Asteroid.prototype.getImage = function () {
        return asteroidsSprite;
    };

    Asteroid.prototype.getDestroyedImage = function () {
        return destroyedAsteroidImage;
    };

    Asteroid.prototype.getX = function() {
        return this._x;
    };

    Asteroid.prototype.getY = function() {
        return this._y;
    };

    Asteroid.prototype.setY = function (y) {
        this._y = y;
    };

    Asteroid.prototype.getSize = function() {
        return this._size;
    };

    Asteroid.prototype.getSpriteX = function () {
        return this._spriteX;
    };

    Asteroid.prototype.getSpriteY = function () {
        return this._spriteY;
    };

    Asteroid.prototype.getSpriteWidth = function () {
        return this._spriteWidth;
    };

    Asteroid.prototype.getSpriteHeight = function () {
        return this._spriteHeight;
    };

    Asteroid.prototype.getSpeed = function () {
        return this._speed;
    };

    Asteroid.prototype.increaseNumberOfHits = function () {
        this._numberOfHits += 1;
    };

    Asteroid.prototype.getIsDestroyed = function () {
        if ((this._numberOfHits === REQUIRED_HITS_FOR_SMALL_ASTEROID && this._size === GlobalConstants.asteroidTypes.size.small) ||
            (this._numberOfHits === REQUIRED_HITS_FOR_MEDIUM_ASTEROID && this._size === GlobalConstants.asteroidTypes.size.medium) ||
            (this._numberOfHits === REQUIRED_HITS_FOR_BIG_ASTEROID && this._size === GlobalConstants.asteroidTypes.size.large)) {

            this._isDestroyed = true;
        }

        return this._isDestroyed;
    };

    Asteroid.prototype.setIsDestroyed = function (isDestroyed) {
        this._isDestroyed = isDestroyed;
    };

    Asteroid.prototype.getExplosionDuration = function () {
        return this._explosionDuration;
    };

    Asteroid.prototype.increaseExplosionDuration = function () {
        this._explosionDuration += 1;
    };

    Asteroid.prototype.getExplosionX = function () {
        return this._explosionX;
    };

    Asteroid.prototype.setExplosionX = function (x) {
        this._explosionX = x;
    };

    Asteroid.prototype.getExplosionY = function () {
        return this._explosionY;
    };

    Asteroid.prototype.setExplosionY = function (y) {
        this._explosionY = y;
    };


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    function getRandomXPosition() {
        return RandomGenerator.getRandomNumber(STEP, GlobalConstants.canvas.width);
    }

    function getRandomAsteroid() {
        return STEP * RandomGenerator.getRandomNumber(FIRST_INDEX_OF_ASTEROID, LAST_INDEX_OF_ASTEROID);
    }

    /**
     * Determines asteroid's size by taking only first column of six asteroids from asteroids-sprite.png. The first asteroid
     * gets index 0 and the last asteroid - index 5.
     */
    function determineSpriteSize() {
        if (this._spriteY === START_SPRITE_Y + (STEP * FIRST_INDEX_OF_ASTEROID) ||
            this._spriteY === START_SPRITE_Y + (STEP * (FIRST_INDEX_OF_ASTEROID + 1)) ||
            this._spriteY === START_SPRITE_Y + (STEP * LAST_INDEX_OF_ASTEROID)) {

            this._spriteWidth = 40;
            this._spriteHeight = 40;
        }
        else if (this._spriteY === START_SPRITE_Y + (STEP * (FIRST_INDEX_OF_ASTEROID + 2))) {

            this._spriteWidth = 50;
            this._spriteHeight = 40;
        }
        else if (this._spriteY === START_SPRITE_Y + (STEP * (FIRST_INDEX_OF_ASTEROID + 3)) ||
            this._spriteY === START_SPRITE_Y + (STEP * (FIRST_INDEX_OF_ASTEROID + 4))) {

            this._spriteWidth = 40;
            this._spriteHeight = 45;
        }
    }

    return Asteroid;
});