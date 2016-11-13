define(function () {
    'use strict';

    function BonusModule() {
        this._isTaken = false;
    }

    BonusModule.prototype.getX = function () {
        return 100;
    };

    BonusModule.prototype.getY = function () {
        return 100;
    };

    BonusModule.prototype.getSize = function () {
        return 30;
    };

    BonusModule.prototype.getIsTaken = function () {
        return this._isTaken;
    };

    BonusModule.prototype.setIsTaken = function (isTaken) {
        this._isTaken = isTaken;
    };

    return BonusModule;
});