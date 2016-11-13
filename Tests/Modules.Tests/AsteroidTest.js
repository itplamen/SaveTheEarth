define(['Squire'], function (Squire) {
    'use strict';

    var injector = new Squire(),
        asteroid;

    describe('Asteroid', function () {
        before(function (done) {
            injector
                .require(['GlobalConstants', 'Asteroid'], function(GlobalConstants, Asteroid){
                    asteroid = new Asteroid(GlobalConstants.asteroidTypes.size.medium, GlobalConstants.asteroidTypes.speed.normal);
                    done();
            });
        });

        after(function () {
            injector.remove();
        });

        describe('#getIsDestroyed()', function () {
            it('when call method, expect to return false', function () {
                expect(asteroid.getIsDestroyed()).to.be.false;
            });

            it('when set required hits for medium size asteroid to less than 4 (for example 3), expect to return false', function () {
                var numberOfHits = 3;

                for (var count = 1; count <= numberOfHits; count += 1) {
                    asteroid.increaseNumberOfHits();
                }

                expect(asteroid.getIsDestroyed()).to.be.false;
            });

            it('when set required hits for medium size asteroid to 4, expect to return true', function () {
                // From previous test, the asteroid's numbers of hits are 3. To become 4, increaseNumberOfHits() method
                // needs to be call once.
                asteroid.increaseNumberOfHits();
                expect(asteroid.getIsDestroyed()).to.be.true;
            });

            it('when set asteroid\'s method setIsDestroyed() to true, expect to return true', function () {
                asteroid.setIsDestroyed(true);
                expect(asteroid.getIsDestroyed()).to.be.true;
            });
        });
    });
});