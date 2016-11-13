define(['Squire', 'AsteroidModule', 'BonusModule'], function (Squire, AsteroidModule, BonusModule) {
    'use strict';

    var EMPTY_ARRAY_SIZE = 0,
        TWO_LASERS_ELEMENTS = 2,
        injector = new Squire(),
        mocks = {
            GlobalConstants: {
                SELECTED_SPACESHIP: {},
                spaceships: [{}, {}, {}]
            },
            Ammunition: function () {
                this._x = 200;
                this._y = 400;
                this.getImage = function () {};
                this.getX = function () { return this._x; };
                this.getY = function () { return this._y; };
            },
            AudioPlayer: {
                playFireLasersSound: function () {},
                playHitAsteroidSound: function () {},
                playFireMissileSound: function () {}
            },
            DrawManager: {
                drawAmmunition: function () {}
            },
            MoveManager: {
                moveAmmunition: function () {}
            },
            AmmunitionType: {},
            _: {} // Mock the underscore library
        },
        spaceship;

    describe('Spaceship', function () {
        before(function (done) {
            injector
                .mock(mocks)
                .require(['Spaceship'], function(Spaceship){
                    spaceship = new Spaceship(10, 10);
                     done();
                });
        });

        after(function () {
            injector.remove();
        });

        describe('#getIsImmortal()', function () {
            it('when call method and spaceship is still alive, expect to return false', function () {
                expect(spaceship.getIsImmortal()).to.be.false;
            });

            it('when set the property _isDead to true, expect to return true (spaceship is immortal)', function () {
                spaceship._isDead = true;
                expect(spaceship.getIsImmortal()).to.be.true;
            });

            it('when the spaceship is dead, expect to return true and the spaceship to be immortal exactly for the time ' +
                'of DEAD_FRAMES_DURATION (500 animation frames)', function () {
                var DEAD_FRAMES_DURATION = 500;

                // Must set the _immortalAnimationFrame to 0, because when the _isDead was set to true in the previous test,
                // the __immortalAnimationFrame increased to 1. To measure exactly 500 animation frames,
                // the __immortalAnimationFrame must be 0.
                spaceship._immortalAnimationFrame = 0;
                spaceship._isDead = true;
                testImmortalDuration(DEAD_FRAMES_DURATION);

                expect(spaceship.getIsImmortal()).to.be.true;
            });

            it('when the spaceship is dead, expect to return false at frame 501 (the spaceship is immortal ' +
                'only for 500 animation frames)', function () {
                var DEAD_FRAMES_DURATION = 501;

                spaceship._immortalAnimationFrame = 0;
                spaceship._isDead = true;
                testImmortalDuration(DEAD_FRAMES_DURATION);

                expect(spaceship.getIsImmortal()).to.be.false;
            });
        });

        describe('#fireLasers()', function () {
            it('when the spaceship does not fire lasers, expect the _lasers[] array to be empty', function () {
                expect(spaceship._lasers.length).to.equal(EMPTY_ARRAY_SIZE);
            });

            it('when the spaceship fires lasers, expect to fire exactly 2 laser (_lasers[] array must contain 2 lasers)', function () {
                spaceship.setIsFireLasers(true);
                spaceship.fireLasers();
                expect(spaceship._lasers.length).to.equal(TWO_LASERS_ELEMENTS);
            });
            
            it('when the lasers reached the end of the game board (\'Y\' coordinate becomes <= 0), ' +
                'expect to be removed from the _lasers[] array (_lasers.length to be 0)', function () {

                spaceship._lasers[0]._y = 0;
                spaceship._lasers[1]._y = -1;

                spaceship.fireLasers();
                spaceship.fireLasers();

                expect(spaceship._lasers.length).to.equal(EMPTY_ARRAY_SIZE);
            });

            it('when the lasers hits asteroid, expect to be removed from the _lasers[] array', function () {
                var asteroids = [new AsteroidModule()];

                // Create two new lasers.
                spaceship._isShootingLasers = false;
                spaceship.fireLasers(asteroids);
                spaceship.fireLasers(asteroids);

                expect(spaceship._lasers.length).to.equal(EMPTY_ARRAY_SIZE);
            });

            it('when the desired number of lasers hit asteroid (depends of his size, for example for small size - 2 hits),' +
                'expect to destroy the asteroid', function () {
                var asteroids = [new AsteroidModule()];

                spaceship._isShootingLasers = false;
                spaceship.fireLasers(asteroids);
                spaceship.fireLasers(asteroids);

                expect(asteroids[0].getIsDestroyed()).to.be.true;
            });
        });
        
        describe('#fireMissile()', function () {
            it('when the spaceship does not fire missile, expect the _missiles[] array to be empty', function () {
                expect(spaceship._missiles.length).to.equal(EMPTY_ARRAY_SIZE);
            });

            it('when the number of missiles is even (for example 2, 4, 6 ...), expect to fire missile from the left side' +
                'of the spaceship', function () {
                spaceship.setIsFireMissile(true);
                spaceship.fireMissile();
                expect(spaceship._fireLeftMissile).to.be.true;
            });

            it('when the number of missiles is odd (for example 1, 3, 5 ...), expect to fire missile from the right side' +
                'of the spaceship', function () {
                spaceship._isShootingRocket = false;
                spaceship.setIsFireMissile(true);
                spaceship.fireMissile();
                expect(spaceship._fireLeftMissile).to.be.false;
            });

            it('when create missiles (for example 4) and fire the one of them, expect the number of missiles to be ' +
                'reduced by 1 (for example to be reduced to 3', function () {
                var numberOfMissiles = 4;

                spaceship.setNumberOfMissiles(numberOfMissiles);
                spaceship._isShootingRocket = false;
                spaceship.setIsFireMissile(true);
                spaceship.fireMissile();

                expect(spaceship.getNumberOfMissiles()).to.equal(numberOfMissiles - 1);
            });

            it('when missile reaches the end of the game board (\'Y\' coordinate becomes <= 0), ' +
                'expect to be removed from the _missiles[] array', function () {
                // From the previous test, the spaceship has 3 missiles.
                var numberOfMissiles = spaceship._missiles.length;

                spaceship._missiles[0]._y = 0;
                spaceship._missiles[1]._y = -1;

                spaceship.fireMissile();
                spaceship.fireMissile();

                expect(spaceship._missiles.length).to.be.equal(numberOfMissiles - 2);
            });

            it('when the missile hits asteroid, expect to be removed from the _missiles[] array', function () {
                var numberOfMissiles = spaceship._missiles.length,
                    asteroids = [new AsteroidModule()];

                spaceship.fireMissile(asteroids);
                expect(spaceship._missiles.length).to.equal(numberOfMissiles - 1);
            });

            it('when the missile hits asteroid (no matter size), expect to destroy the asteroid', function () {
                var asteroids = [new AsteroidModule()],
                    numberOfMissiles = 2;

                spaceship.setNumberOfMissiles(numberOfMissiles);
                spaceship._isShootingRocket = false;
                spaceship.setIsFireMissile(true);
                spaceship.fireMissile(asteroids);

                expect(asteroids[0]._isDestroyed).to.be.true;
            });
        });

        describe('#hasCrashedIntoAsteroid()', function () {
            it('when spaceship did not crashed into asteroid, expect to return false', function () {
                expect(spaceship.hasCrashedIntoAsteroid()).to.be.false;
            });
            
            it('when spaceship crashed into asteroid, expect to return true', function () {
                var asteroids = [new AsteroidModule()];

                spaceship.setX(asteroids[0].getX());
                spaceship.setY(asteroids[0].getY());

                expect(spaceship.hasCrashedIntoAsteroid(asteroids)).to.be.true;
            });

            it('when spaceship crashed into asteroid, expect to destroy the asteroid', function () {
                var asteroids = [new AsteroidModule()];

                spaceship.setX(asteroids[0].getX());
                spaceship.setY(asteroids[0].getY());
                spaceship.hasCrashedIntoAsteroid(asteroids);

                expect(asteroids[0].getIsDestroyed()).to.be.true;
            });

            it('when spaceship crashed into asteroid, expect to reduce the strength by half of the' +
                'asteroid size (strength -= asteroid.getSize() / 2)', function () {
                var asteroids = [new AsteroidModule()],
                    spaceshipStrength = 40;

                spaceship.setX(asteroids[0].getX());
                spaceship.setY(asteroids[0].getY());
                spaceship.setStrength(spaceshipStrength);
                spaceship.hasCrashedIntoAsteroid(asteroids);

                expect(spaceship.getStrength()).to.equal(spaceshipStrength - asteroids[0].getSize() / 2);
            });
        });

        describe('#hasLostLife()', function () {
            it('when spaceship did not lost life (strength >= 0), expect to return false', function () {
                spaceship.setStrength(10);
                expect(spaceship.hasLostLife()).to.be.false;
            });
            
            it('when strength is set to negative (for example - 1, strength < 0), expect to return true', function () {
                spaceship.setStrength(-1);
                expect(spaceship.hasLostLife()).to.be.true;
            });

            it('when spaceship crashed into asteroid and strength is negative, expect to return true', function () {
                var asteroids = [new AsteroidModule()];

                spaceship.setStrength(60);
                spaceship._isDead = false;
                spaceship.setX(asteroids[0].getX());
                spaceship.setY(asteroids[0].getY());
                spaceship.hasCrashedIntoAsteroid(asteroids);
                asteroids[0].setIsDestroyed(false);             // Set it to false, so that asteroid can be used again
                spaceship.hasCrashedIntoAsteroid(asteroids);    // Crashed twice

                expect(spaceship.hasLostLife()).to.be.true;
            });
        });

        describe('#checkForTakenBonus()', function () {
            it('when the spaceship did not take bonus, expect to return undefined', function () {
                expect(spaceship.checkForTakenBonus()).to.be.undefined;
            });
            
            it('when the spaceship take bonus, expect to return object', function () {
                var bonuses = [new BonusModule()];

                spaceship.setX(bonuses[0].getX());
                spaceship.setY(bonuses[0].getY());

                expect(spaceship.checkForTakenBonus(bonuses)).to.be.object;
            });

            it('when the spaceship take bonus, expect to return true and set the bonus as taken', function () {
                var bonuses = [new BonusModule()];

                spaceship.setX(bonuses[0].getX());
                spaceship.setY(bonuses[0].getY());
                spaceship.checkForTakenBonus(bonuses);

                expect(bonuses[0].getIsTaken()).to.be.true;
            });
        });
    });

    function testImmortalDuration(animationFrames) {
        for(var i = 1; i <= animationFrames; i += 1) {
            spaceship.getIsImmortal();
        }
    }
});