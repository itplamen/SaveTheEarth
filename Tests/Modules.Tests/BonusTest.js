define(['Squire'], function (Squire) {
    'use strict';

    var injector = new Squire(),
        BonusConstructor;

    describe('Bonus', function () {
        before(function (done) {
            injector
                .require(['Bonus'], function (Bonus){
                    BonusConstructor = Bonus;
                    done();
                });
        });

        after(function () {
            injector.remove();
        });

        describe('#getNameByID()', function () {
            it('when create bonus with valid ID (2), expect to return valid name (name \'speed\')', function () {
                var validBonus = new BonusConstructor(2);
                expect(validBonus.getName()).to.equal('speed');
            });

            it('when create bonus with invalid ID (111), expect to throw exception', function () {
                expect(function () {
                    var invalidBonus = new BonusConstructor(111);
                }).to.throw(Error);
            });
        });
    });
});