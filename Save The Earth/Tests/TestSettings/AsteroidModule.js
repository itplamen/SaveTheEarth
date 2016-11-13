define(function () {
    'use strict';

    var REQUIRED_HITS_FOR_SMALL_ASTEROID = 2;

    function AsteroidModule() {
        this._numberOfHits = 0;
        this._isDestroyed = false;
    }

    // The values of the asteroid must match with the coordinates of the mocked ammunition, so that the
    // lasers and missiles can hit the asteroid.
    AsteroidModule.prototype.getX = function () {
        return 200;
    };

    AsteroidModule.prototype.getY = function () {
        return 400;
    };

    // Small size of asteroid, required hits - 2
    AsteroidModule.prototype.getSize = function () {
        return 70;
    };

    AsteroidModule.prototype.getIsDestroyed = function () {
        if (this._numberOfHits === REQUIRED_HITS_FOR_SMALL_ASTEROID) {
            this._isDestroyed = true;
        }

        return this._isDestroyed;
    };

    AsteroidModule.prototype.setIsDestroyed = function (isDestroyed) {
        this._isDestroyed = isDestroyed
    };

    AsteroidModule.prototype.increaseNumberOfHits = function () {
        this._numberOfHits += 1;
    };

    return AsteroidModule;
});