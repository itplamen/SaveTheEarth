define(['Squire'], function (Squire) {
    'use strict';

    var injector = new Squire(),
        gameKeys;

    describe('Keys', function () {
        before(function (done) {
            injector
                .require(['Keys'], function (Keys) {
                    gameKeys = Keys;
                    done();
                });
        });

        after(function () {
            injector.remove();
        });

        describe('#saveChangedKey()', function () {
            it('when pass as argument invalid action (Example: Fire Bulletssss), expect to throw \"Invalid action!\" Error', function () {
                var invalidAction = 'Fire Bulletssss',
                    someKey = 'Q',
                    someKeyCode = 22;

                expect(function () {
                    gameKeys.saveChangedKey(invalidAction, someKey, someKeyCode);
                }).to.throw(Error);
            });

            it('when pass valid arguments, expect to save action, key and keyCode into playerKeys array', function () {
                var newKey = {
                        key: 'P',
                        keyCode: 111
                    },
                    action = 'Fire Lasers',
                    fireBulletsIndex = 4,
                    currentKey;

                gameKeys.saveChangedKey(action, newKey.key, newKey.keyCode);

                currentKey = {
                    key: gameKeys.getPlayerKeys()[fireBulletsIndex].firstKey,
                    keyCode: gameKeys.getPlayerKeys()[fireBulletsIndex].firstKeyCode
                };

                expect(currentKey.keyCode).to.equal(gameKeys.getPlayerKeys()[fireBulletsIndex].firstKeyCode);
            });
        });
    });
});