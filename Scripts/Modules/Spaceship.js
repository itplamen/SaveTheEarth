define(['GlobalConstants', 'Ammunition', 'AudioPlayer', 'DrawManager', 'MoveManager', 'AmmunitionType',
    'underscore'], function(GlobalConstants, Ammunition, AudioPlayer, DrawManager, MoveManager, AmmunitionType) {

    'use strict';

    var FIRST_LASER_GUN_X_COORDINATE = 0,
        SECOND_LASER_GUN_X_COORDINATE = 65,
        SPACESHIP_SIZE = 120,
        NUCLEAR_BOMB_EXPLOSION_MAX_SIZE = 650,
        SQUADRON_FIRE_FRAMES = 20,
        DEAD_FRAMES_DURATION = 500,
        SHIELD_ACTIVATED_FRAMES_DURATION = 1000,
        INITIAL_NUCLEAR_EXPLOSION_SIZE = 1,
        numberOfSpecialAbilities = 3,
        squadronFireLasersDuration = 0,
        nuclearBombExplosionSize,
        nuclearBomb,
        firstSpaceshipSquadron,
        secondSpaceshipSquadron;

    function Spaceship(x, y) {
        this._x = x;
        this._y = y;
        this._width = SPACESHIP_SIZE;
        this._height = SPACESHIP_SIZE;
        this._startX = x;
        this._startY = y;
        this._speed = getStartSpeed();
        this._isMovingUp = false;
        this._isMovingDown = false;
        this._isMovingLeft = false;
        this._isMovingRight = false;
        this._isFireLasers = false;
        this._isFireMissile = false;
        this._isDead = false;
        this._lives = 3;
        this._isShootingLasers = false;
        this._isShootingRocket = false;
        this._numberOfShields = 2;
        this._numberOfMissiles = 2;
        this._lasers = [];
        this._missiles = [];
        this._isShieldActivated = false;
        this._fireLeftMissile = false;
        this._shieldAnimationFrame = 0;
        this._immortalAnimationFrame = 0;
        this._strength = GlobalConstants.SELECTED_SPACESHIP.strength;
        this._spaceshipImage = new Image();
        this._isSpecialAbilityActivated = false;

        setLaserGunsXCoordinate();
        this._spaceshipImage.src = GlobalConstants.SELECTED_SPACESHIP.imgSrc;
    }


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    Spaceship.prototype.getImage = function () {
        return this._spaceshipImage;
    };

    Spaceship.prototype.getX = function () {
        return this._x;
    };

    Spaceship.prototype.setX = function (x) {
        this._x = x;
    };

    Spaceship.prototype.getY = function () {
        return this._y;
    };

    Spaceship.prototype.setY = function (y) {
        this._y = y;
    };

    Spaceship.prototype.getWidth = function () {
        return this._width;
    };

    Spaceship.prototype.getHeight = function () {
        return this._height;
    };

    Spaceship.prototype.getSpeed = function () {
        return this._speed;
    };

    Spaceship.prototype.setSpeed = function (speed) {
        this._speed = speed;
    };

    Spaceship.prototype.increaseSpeed = function () {
        this._speed += 1;
    };

    Spaceship.prototype.getIsMovingUp = function () {
        return this._isMovingUp;
    };

    Spaceship.prototype.setIsMovingUp = function (isMovingUp) {
        this._isMovingUp = isMovingUp;
    };

    Spaceship.prototype.getIsMovingDown = function () {
        return this._isMovingDown;
    };

    Spaceship.prototype.setIsMovingDown = function (isMovingDown) {
        this._isMovingDown = isMovingDown;
    };

    Spaceship.prototype.getIsMovingLeft = function () {
        return this._isMovingLeft;
    };

    Spaceship.prototype.setIsMovingLeft = function (isMovingLeft) {
        this._isMovingLeft = isMovingLeft;
    };

    Spaceship.prototype.getIsMovingRight = function () {
        return this._isMovingRight;
    };

    Spaceship.prototype.setIsMovingRight = function (isMovingRight) {
        this._isMovingRight = isMovingRight;
    };

    Spaceship.prototype.setIsFireLasers = function (isFireLasers) {
        this._isFireLasers = isFireLasers;
    };

    Spaceship.prototype.setIsFireMissile = function (isFireMissile) {
        this._isFireMissile = isFireMissile;
    };

    /**
     * When the spaceship lost live, it becomes immortal and for the time of DEAD_FRAMES_DURATION the
     * spaceship cannot be destroyed.
     * @returns {boolean} true if so, otherwise - returns false.
     */
    Spaceship.prototype.getIsImmortal = function () {
        if (this._isDead && this._immortalAnimationFrame <= DEAD_FRAMES_DURATION) {
            this._immortalAnimationFrame += 1;
        }
        else {
            this._immortalAnimationFrame = 0;
            this._isDead = false;
        }

        return this._isDead;
    };

    Spaceship.prototype.getLives = function () {
        return this._lives;
    };

    Spaceship.prototype.setLives = function (lives) {
        this._lives = lives;
    };

    Spaceship.prototype.increaseLives = function () {
        this._lives += 1;
    };

    Spaceship.prototype.getNumberOfMissiles = function () {
        return this._numberOfMissiles;
    };

    Spaceship.prototype.setNumberOfMissiles = function (missiles) {
        this._numberOfMissiles = missiles;
    };

    Spaceship.prototype.increaseNumberOfMissiles = function () {
        this._numberOfMissiles += 2;
    };

    Spaceship.prototype.getFireLeftMissile = function () {
        return this._fireLeftMissile;
    };

    Spaceship.prototype.setFireLeftMissile = function (fireLeftMissile) {
        this._fireLeftMissile = fireLeftMissile;
    };

    Spaceship.prototype.getNumberOfShields = function () {
        return this._numberOfShields;
    };

    Spaceship.prototype.setNumberOfShields = function (shields) {
        this._numberOfShields = shields;
    };

    Spaceship.prototype.increaseNumberOfShields = function () {
        this._numberOfShields += 1;
    };

    Spaceship.prototype.setIsShieldActivated = function (isShieldActivated) {
        this._numberOfShields -= 1;
        this._isShieldActivated = isShieldActivated;
    };

    Spaceship.prototype.getStrength = function () {
        return this._strength;
    };

    /**
     * Sets the strength percentage. Use it only to load game!
     * @param strength
     */
    Spaceship.prototype.setStrength = function (strength) {
        this._strength = strength;
    };

    Spaceship.prototype.fireLasers = function (asteroids) {
        var asteroid,
            self = this;

        if (this._isFireLasers && !this._isShootingLasers) {
            this._isShootingLasers = true;
            this._lasers.push(new Ammunition(this._x + FIRST_LASER_GUN_X_COORDINATE, this._y, AmmunitionType.LASER),
                new Ammunition(this._x + SECOND_LASER_GUN_X_COORDINATE, this._y, AmmunitionType.LASER));

            AudioPlayer.playFireLasersSound();
        }
        else if (!this._isFireLasers) {
            this._isShootingLasers = false;
        }

        _.each(this._lasers, function (laser, index) {
            MoveManager.moveAmmunition(laser);
            DrawManager.drawAmmunition(laser.getImage(), laser.getX(), laser.getY());
            asteroid = getAsteroidIfItWasHit(asteroids, laser);

            if (laser.getY() <= 0) {
                self._lasers.shift();
            }
            else if (asteroid && !asteroid.getIsDestroyed()) {
                AudioPlayer.playHitAsteroidSound();
                asteroid.increaseNumberOfHits();
                self._lasers.splice(index, 1);
            }
        });
    };

    Spaceship.prototype.fireMissile = function (asteroids) {
        var asteroid,
            self = this;

        if (this._numberOfMissiles > 0 && this._isFireMissile && !this._isShootingRocket) {
            this._isShootingRocket = true;

            if (!this._fireLeftMissile) {
                this._missiles.push(new Ammunition(this._x + 8, this._y + 50, AmmunitionType.MISSILE));
                this._fireLeftMissile = true;
            }
            else {
                this._missiles.push(new Ammunition(this._x + 90, this._y + 50, AmmunitionType.MISSILE));
                this._fireLeftMissile = false;
            }

            AudioPlayer.playFireMissileSound();
            this._numberOfMissiles -= 1;
        }
        else if (!this._isFireMissile) {
            this._isShootingRocket = false;
        }

        _.each(this._missiles, function (missile, index) {
            MoveManager.moveAmmunition(missile);
            DrawManager.drawAmmunition(missile.getImage(), missile.getX(), missile.getY());
            asteroid = getAsteroidIfItWasHit(asteroids, missile);

            if (missile.getY() <= 0) {
                self._missiles.shift();
            }
            else if (asteroid) {
                asteroid.setIsDestroyed(true);
                self._missiles.splice(index, 1);
            }
        });
    };

    /**
     * Checks whether spaceship has crashed into asteroid and reduce the strength, if so.
     * @param asteroids - array with all current asteroids.
     * @returns {boolean} - true if spaceship has crashed, false if not.
     */
    Spaceship.prototype.hasCrashedIntoAsteroid = function (asteroids) {
        var asteroid = getElement.call(this, asteroids);

        if (asteroid && !asteroid.getIsDestroyed() && !this._isShieldActivated && !this._isDead) {
            this._strength -= asteroid.getSize() / 2;
            asteroid.setIsDestroyed(true);

            return true;
        }

        return false;
    };

    Spaceship.prototype.hasLostLife = function () {
        if (this._strength < 0) {
            this._lives -= 1;
            this._x = this._startX;
            this._y = this._startY;
            this._speed = getStartSpeed();
            this._isDead = true;
            this._strength = GlobalConstants.SELECTED_SPACESHIP.strength;

            return true;
        }

        return false;
    };

    /**
     * Checks whether spaceship has taken some bonus.
     * @param bonuses - array with all current bonuses.
     * @returns {*} the taken bonus or undefined.
     */
    Spaceship.prototype.checkForTakenBonus = function (bonuses) {
        var bonus = getElement.call(this, bonuses);

        if (bonus) {
            bonus.setIsTaken(true);
        }

        return bonus;
    };

    /**
     * Checks whether the shield is activated. If so, it will be activated for the time fo SHIELD_ACTIVATED_FRAMES_DURATION
     * and the spaceship could not be destroyed.
     */
    Spaceship.prototype.checkShield = function () {
        if (this._isShieldActivated && this._numberOfShields >= 0 && this._shieldAnimationFrame <= SHIELD_ACTIVATED_FRAMES_DURATION) {
            DrawManager.drawShield(this._x, this._y, this._width, this._height);

            this._shieldAnimationFrame += 1;

            if (this._shieldAnimationFrame === SHIELD_ACTIVATED_FRAMES_DURATION) {
                this._isShieldActivated = false;
                this._shieldAnimationFrame = 0;
            }
        }
    };

    Spaceship.prototype.getNumberOfSpecialAbilities = function () {
        return numberOfSpecialAbilities;
    };

    /**
     * Sets the number of special abilities. Use it only to load game!
     * @param specialAbilities
     */
    Spaceship.prototype.setNumberOfSpecialAbilities = function (specialAbilities) {
        numberOfSpecialAbilities = specialAbilities;
    };

    Spaceship.prototype.setIsSpecialAbilityActivated = function (isActivated) {
        if (!this._isSpecialAbilityActivated && numberOfSpecialAbilities > 0) {
            numberOfSpecialAbilities -= 1;
            this._isSpecialAbilityActivated = isActivated;
        }
    };

    Spaceship.prototype.useSpecialAbility = function (asteroids) {
        var selectedShip;

        if (this._isSpecialAbilityActivated) {
            selectedShip =_.find(GlobalConstants.spaceships, function (ship) {
                return GlobalConstants.SELECTED_SPACESHIP.id === ship.id;
            });

            if (!selectedShip) {
                throw new Error('Invalid spaceship! Check the ID of all spaceships or check the' +
                    'number of the spaceships!!!');
            }

            if (selectedShip.specialAbility === GlobalConstants.NUCLEAR_BOMB_SPECIAL_ABILITY) {
                useNuclearBombAbility.call(this, asteroids);
            }
            else if (selectedShip.specialAbility === GlobalConstants.SQUADRON_SPECIAL_ABILITY) {
                useSquadronAbility.call(this, asteroids);
            }
            else {
                throw new RangeError('Invalid special ability!');
            }
        }
    };


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    /**
     * If selected spaceship is Destiny, the x coordinate must be changed. Spaceship Destiny has a
     * different laser gun than other spaceships, so the x coordinate wont be the same.
     */
    function setLaserGunsXCoordinate() {
        if (GlobalConstants.SELECTED_SPACESHIP.id === GlobalConstants.spaceships[2].id) {
            FIRST_LASER_GUN_X_COORDINATE = 60
        }
        else {
            FIRST_LASER_GUN_X_COORDINATE = 48;
        }
    }

    /**
     * Calculates initial speed by restrict the speed to 1 number after decimal point.
     * @returns {number} initial speed.
     */
    function getStartSpeed() {
        return Math.round(GlobalConstants.SELECTED_SPACESHIP.speed / 1.4) / 10;
    }

    /**
     * The method helps to check whether spaceship has taken bonus or crashed with asteroid. If so, returns object,
     * otherwise returns undefined.
     * @param array can be asteroids[] or bonuses[].
     * @returns {object} element from the array or undefined.
     */
    function getElement(array) {
        var self = this;

        return _.find(array, function (element) {
            return self._x + self._width >= element.getX() &&
                self._x <= element.getX() + element.getSize() &&
                self._y + self._height >= element.getY() &&
                self._y <= element.getY() + element.getSize();
        });
    }

    /**
     * The method helps to check if asteroid has been hit from laser or missile.
     * @param {array[]} asteroids - current asteroids.
     * @param {Ammunition} ammunition - can be laser or missile.
     * @returns {object} asteroid (if it was hit) or undefined.
     */
    function getAsteroidIfItWasHit(asteroids, ammunition) {
        return _.find(asteroids, function (asteroid) {
            return ammunition.getX() >= asteroid.getX() && ammunition.getX() <=  asteroid.getX() + asteroid.getSize() &&
                ammunition.getY() >= asteroid.getY() && ammunition.getY() <= asteroid.getY() + asteroid.getSize();
        });
    }

    function useNuclearBombAbility(asteroids) {
        if (!nuclearBomb) {
            nuclearBomb = new Ammunition(this._x + FIRST_LASER_GUN_X_COORDINATE, this._y, AmmunitionType.NUCLEAR_BOMB);
            nuclearBombExplosionSize = INITIAL_NUCLEAR_EXPLOSION_SIZE;
        }

        if (nuclearBomb.getY() >= GlobalConstants.canvas.height / 2) {
            DrawManager.drawAmmunition(nuclearBomb.getImage(), nuclearBomb.getX(), nuclearBomb.getY());
            MoveManager.moveAmmunition(nuclearBomb);
        }
        else {
            // It means that the nucle
            if (nuclearBombExplosionSize === INITIAL_NUCLEAR_EXPLOSION_SIZE) {
                AudioPlayer.playNuclearExplosionSound();
            }

            DrawManager.drawNuclearBombExplosion(nuclearBomb.getX(), nuclearBomb.getY(), asteroids, nuclearBombExplosionSize);
            MoveManager.moveNuclearBombExplosion(nuclearBomb, asteroids);
            nuclearBombExplosionSize += 5;
        }

        if (nuclearBomb.getX() < -NUCLEAR_BOMB_EXPLOSION_MAX_SIZE &&
            nuclearBomb.getY() < -NUCLEAR_BOMB_EXPLOSION_MAX_SIZE &&
            nuclearBombExplosionSize > GlobalConstants.canvas.width + NUCLEAR_BOMB_EXPLOSION_MAX_SIZE &&
            nuclearBombExplosionSize > GlobalConstants.canvas.height + NUCLEAR_BOMB_EXPLOSION_MAX_SIZE) {

            nuclearBomb = undefined;
            this._isSpecialAbilityActivated = false;
        }
    }

    function useSquadronAbility(asteroids) {
        if (!firstSpaceshipSquadron && !secondSpaceshipSquadron) {

            firstSpaceshipSquadron = new Spaceship(100, 470);
            secondSpaceshipSquadron = new Spaceship(600, 470);

            firstSpaceshipSquadron.setLives(1);
            secondSpaceshipSquadron.setLives(1);

            firstSpaceshipSquadron.setNumberOfMissiles(0);
            secondSpaceshipSquadron.setNumberOfMissiles(0);

            firstSpaceshipSquadron.setIsMovingLeft(true);
            secondSpaceshipSquadron.setIsMovingLeft(true);

            firstSpaceshipSquadron._spaceshipImage.src = GlobalConstants.spaceships[5].imgSrc;
            secondSpaceshipSquadron._spaceshipImage.src = GlobalConstants.spaceships[5].imgSrc;
        }

        if (firstSpaceshipSquadron) {
            manageSquadron(firstSpaceshipSquadron, asteroids);

            if (firstSpaceshipSquadron.getLives() <= 0) {
                firstSpaceshipSquadron = undefined;
            }
        }

        if (secondSpaceshipSquadron) {
            manageSquadron(secondSpaceshipSquadron, asteroids);

            if (secondSpaceshipSquadron.getLives() <= 0) {
                secondSpaceshipSquadron = undefined;
            }
        }

        if (squadronFireLasersDuration === SQUADRON_FIRE_FRAMES) {
            if (firstSpaceshipSquadron) {
                firstSpaceshipSquadron.setIsFireLasers(true);
                firstSpaceshipSquadron._isShootingLasers = false;
            }

            if (secondSpaceshipSquadron) {
                secondSpaceshipSquadron.setIsFireLasers(true);
                secondSpaceshipSquadron._isShootingLasers = false;
            }

            squadronFireLasersDuration = 0;
        }

        squadronFireLasersDuration += 1;

        if (!firstSpaceshipSquadron && !secondSpaceshipSquadron) {
            this._isSpecialAbilityActivated = false;
        }
    }

    function manageSquadron(spaceshipSquadron, asteroids) {
        spaceshipSquadron.hasCrashedIntoAsteroid(asteroids);

        if (spaceshipSquadron.getX() <= 0) {
            spaceshipSquadron.setIsMovingRight(true);
            spaceshipSquadron.setIsMovingLeft(false);
        }
        else if (spaceshipSquadron.getX() >= GlobalConstants.canvas.width - spaceshipSquadron.getWidth()) {
            spaceshipSquadron.setIsMovingRight(false);
            spaceshipSquadron.setIsMovingLeft(true);
        }

        spaceshipSquadron.fireLasers(asteroids);

        DrawManager.drawSpaceship(spaceshipSquadron);
        MoveManager.moveSpaceship(spaceshipSquadron);

        if (spaceshipSquadron.getStrength() < 0) {
            spaceshipSquadron.setLives(spaceshipSquadron.getLives() - 1);
        }
    }

    return Spaceship;
});

