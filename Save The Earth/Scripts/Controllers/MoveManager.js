define(['GlobalConstants'], function (GlobalConstants) {
    'use strict';

    var BACKGROUND_IMAGE_MAX_SIZE = 1080;


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    /**
     * Moves background from top to down.
     * @param firstBackground - first background image.
     * @param secondBackground - second background image
     */
    function moveBackground(firstBackground, secondBackground) {
        firstBackground.setY(firstBackground.getY() + 2);
        secondBackground.setY(secondBackground.getY() + 2);

        if (firstBackground.getY() >= BACKGROUND_IMAGE_MAX_SIZE) {
            firstBackground.setY(-BACKGROUND_IMAGE_MAX_SIZE);
        }
        else if (secondBackground.getY() >= BACKGROUND_IMAGE_MAX_SIZE) {
            secondBackground.setY(-BACKGROUND_IMAGE_MAX_SIZE);
        }
    }

    function moveSpaceship(spaceship) {
        if (spaceship.getIsMovingUp() && spaceship.getY() > 0) {
            spaceship.setY(spaceship.getY() - spaceship.getSpeed());
        }

        if (spaceship.getIsMovingDown() && spaceship.getY() < (GlobalConstants.canvas.height - spaceship.getHeight() - 10)) {
            spaceship.setY(spaceship.getY() + spaceship.getSpeed());
        }

        if (spaceship.getIsMovingLeft() && spaceship.getX() > 0) {
            spaceship.setX(spaceship.getX() - spaceship.getSpeed());
        }

        if (spaceship.getIsMovingRight() && spaceship.getX() < (GlobalConstants.canvas.width - spaceship.getWidth())) {
            spaceship.setX(spaceship.getX() + spaceship.getSpeed());
        }
    }

    /**
     * Moves all kinds of ammunition from down to top.
     * @param ammunition - can be laser, missile or nuclear bomb.
     */
    function moveAmmunition(ammunition) {
        ammunition.setY(ammunition.getY() - ammunition.getSpeed());
    }

    function moveAsteroid(asteroid) {
        asteroid.setY(asteroid.getY() + asteroid.getSpeed());
    }

    function moveBonus(bonus) {
        bonus.setY(bonus.getY() + bonus.getSpeed());
    }

    function moveTextInfo(textInfo) {
        if (textInfo.getDisplayTime() <= 50) {
            textInfo.setY(textInfo.getY() - textInfo.getSpeed());
            textInfo.increaseDisplayTime();

            if (textInfo.getDisplayTime() === 50) {
                textInfo.setIsShown(false);
            }
        }
    }

    function moveNuclearBombExplosion(nuclearBomb) {
        nuclearBomb.setX(nuclearBomb.getX() - nuclearBomb.getSpeed());
        nuclearBomb.setY(nuclearBomb.getY() - nuclearBomb.getSpeed());
    }

    return {
        moveBackground: moveBackground,
        moveSpaceship: moveSpaceship,
        moveAmmunition: moveAmmunition,
        moveAsteroid: moveAsteroid,
        moveBonus: moveBonus,
        moveTextInfo: moveTextInfo,
        moveNuclearBombExplosion: moveNuclearBombExplosion
    };
});