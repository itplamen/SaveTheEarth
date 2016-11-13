define(['GlobalConstants', 'jquery'], function (GlobalConstants, $) {
    'use strict';

    var BONUS_IMAGE_WIDTH = 40,
        BONUS_IMAGE_HEIGHT = 18,
        POINTS_BONUS_SRC = 'Images/GameImages/Bonuses/points-bonus.png',
        LIVE_BONUS_SRC = 'Images/GameImages/Bonuses/live-bonus.png',
        MISSILE_BONUS_SRC = 'Images/GameImages/Bonuses/missile-bonus.png',
        SHIELD_BONUS_SRC = 'Images/GameImages/Bonuses/shield-bonus.png',
        NUCLEAR_BOMB_SRC = 'Images/GameImages/Bonuses/nuclear-bomb-bonus.png',
        SQUADRON_SRC = 'Images/GameImages/Spaceships/spaceship-challenger.png',
        imagesSrc = [POINTS_BONUS_SRC, LIVE_BONUS_SRC, MISSILE_BONUS_SRC, SHIELD_BONUS_SRC],
        bonusImages = [new Image(), new Image(), new Image(), new Image(), new Image()];


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function InfoBoard() {
        this._$level = $('<p id="CurrentLevel">Level: <span></span></p>');
        this._$points = $('<p>Points: <span></span></p>');
        this._$lives = $('<p>Lives: <span></span></p>');
        this._$missiles = $('<p>Missiles: <span></span></p>');
        this._$shields = $('<p>Shields: <span></span></p>');
        this._$specialAbility = $('<p><span></span></p>');
        this._$strength = $('<p>Strength: <span></span></p>');
        this._playerPoints = 0;

        createImages();
        initializeInfoBoard.call(this);
    }

    InfoBoard.prototype.setLevel = function (level) {
        this._$level.children('span').html(level);
    };

    InfoBoard.prototype.getPoints = function () {
        return this._playerPoints;
    };

    InfoBoard.prototype.setPoints = function (points) {
        this._playerPoints = points;
        this._$points.children('span').html(this._playerPoints);
    };

    InfoBoard.prototype.addPoints = function (points) {
        this._playerPoints += points;
        this._$points.children('span').html(this._playerPoints);
    };

    InfoBoard.prototype.setLives = function (lives) {
        this._$lives.children('span').html(lives);
    };

    InfoBoard.prototype.setMissiles = function (missiles) {
        this._$missiles.children('span').html(missiles);
    };

    InfoBoard.prototype.setShields = function (shields) {
        this._$shields.children('span').html(shields);
    };

    InfoBoard.prototype.setSpecialAbilities = function (specialAbilities) {
        this._$specialAbility.children('span').html(specialAbilities);
    };

    InfoBoard.prototype.setStrength = function (strength) {
        this._$strength.children('span').html(strength + '%');
    };


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    function createImages() {
        if (GlobalConstants.SELECTED_SPACESHIP.specialAbility === GlobalConstants.NUCLEAR_BOMB_SPECIAL_ABILITY) {
            imagesSrc.push(NUCLEAR_BOMB_SRC);
        }
        else if (GlobalConstants.SELECTED_SPACESHIP.specialAbility === GlobalConstants.SQUADRON_SPECIAL_ABILITY) {
            imagesSrc.push(SQUADRON_SRC);
        }
        else {
            throw new RangeError('Invalid special ability!');
        }

        if (imagesSrc.length !== bonusImages.length) {
            throw new RangeError('Invalid length! Array bonusImagesSrc and array bonusImages must be with same length!');
        }

        $.each(bonusImages, function (index) {
            bonusImages[index].width = BONUS_IMAGE_WIDTH;
            bonusImages[index].height = BONUS_IMAGE_HEIGHT;
            bonusImages[index].src = imagesSrc[index];
        })
    }

    function initializeInfoBoard() {
        var $infoBoard = $('<div id="InfoBoard"/>');

        this._$points.append(bonusImages[0]);
        this._$lives.append(bonusImages[1]);
        this._$missiles.append(bonusImages[2]);
        this._$shields.append(bonusImages[3]);
        this._$specialAbility.prepend(GlobalConstants.SELECTED_SPACESHIP.specialAbility + ':');
        this._$specialAbility.append(bonusImages[4]);

        $infoBoard.append(this._$level, this._$points, this._$lives, this._$missiles,
            this._$shields, this._$specialAbility, this._$strength);
        $('body').prepend($infoBoard);
    }

    return InfoBoard;
});