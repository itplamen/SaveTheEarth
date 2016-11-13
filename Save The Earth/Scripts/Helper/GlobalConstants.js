define(function () {
    'use strict';

    var SPACESHIP_ROOT_SRC = 'Images/GameImages/Spaceships/',
        NUCLEAR_BOMB_SPECIAL_ABILITY = 'Bomb',
        SQUADRON_SPECIAL_ABILITY = 'Squadron',
        canvas = document.getElementById('CanvasContainer'),
        context = canvas.getContext('2d');

    return {
        NUCLEAR_BOMB_SPECIAL_ABILITY: NUCLEAR_BOMB_SPECIAL_ABILITY,
        SQUADRON_SPECIAL_ABILITY: SQUADRON_SPECIAL_ABILITY,
        SELECTED_SPACESHIP : {},
        canvas: canvas,
        context: context,
        spaceships: [{
            id: 1,
            imgSrc: SPACESHIP_ROOT_SRC + 'spaceship-orion.png',
            name: 'Orion',
            speed: 60,
            damage: 40,
            strength: 60,
            specialAbility: NUCLEAR_BOMB_SPECIAL_ABILITY,
            specialAbilityPower: 100
        }, {
            id: 2,
            imgSrc: SPACESHIP_ROOT_SRC + 'spaceship-andromeda.png',
            name: 'Andromeda',
            speed: 70,
            damage: 50,
            strength: 40,
            specialAbility: SQUADRON_SPECIAL_ABILITY,
            specialAbilityPower: 70
        }, {
            id: 3,
            imgSrc: SPACESHIP_ROOT_SRC + 'spaceship-destiny.png',
            name: 'Destiny',
            speed: 50,
            damage: 40,
            strength: 70,
            specialAbility: NUCLEAR_BOMB_SPECIAL_ABILITY,
            specialAbilityPower: 80
        }, {
            id: 4,
            imgSrc: SPACESHIP_ROOT_SRC + 'spaceship-enterprise.png',
            name: 'Enterprise',
            speed: 30,
            damage: 70,
            strength: 60,
            specialAbility: SQUADRON_SPECIAL_ABILITY,
            specialAbilityPower: 100
        }, {
            id: 5,
            imgSrc: SPACESHIP_ROOT_SRC + 'spaceship-falcon.png',
            name: 'Falcon',
            speed: 60,
            damage: 50,
            strength: 50,
            specialAbility: SQUADRON_SPECIAL_ABILITY,
            specialAbilityPower: 70
        }, {
            id: 6,
            imgSrc: SPACESHIP_ROOT_SRC + 'spaceship-challenger.png',
            name: 'Challenger',
            speed: 40,
            damage: 60,
            strength: 60,
            specialAbility: NUCLEAR_BOMB_SPECIAL_ABILITY,
            specialAbilityPower: 100
        }],
        asteroidTypes: {
            size: {
                small: 30,
                medium: 70,
                large: 100
            },
            speed: {
                slow: 0.5,
                normal: 1,
                fast: 5
            }
        },
        bonuses : {
            live: {
                id: 1,
                name: 'live'
            },
            speed: {
                id: 2,
                name: 'speed'
            },
            points: {
                id: 3,
                name: 'points'
            },
            missile: {
                id: 4,
                name: 'missile'
            },
            shield: {
                id: 5,
                name: 'shield'
            }
        }
    };
});