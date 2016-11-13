define(['GlobalConstants'], function (GlobalConstants) {
    'use strict';

    var ASTEROID_EXPLOSION_SPRITE_SIZE = 260,
        shockWaveImage = new Image(),
        shieldImage = new Image();

    shockWaveImage.src = 'Images/GameImages/shock-wave.png';
    shieldImage.src = 'Images/GameImages/shield.png';



    function drawAmmunition(ammunitionImage, x, y               ) {
        GlobalConstants.context.drawImage(ammunitionImage, x, y, ammunitionImage.width, ammunitionImage.height);
    }

    function drawBackground(background) {
        GlobalConstants.context.drawImage(background.getImage(), background.getSpriteX(), background.getSpriteY(),
            background.getSpriteWidth(), background.getSpriteHeight(), background.getX(), background.getY(),
            background.getWidth(), background.getHeight());
    }

    function drawSpaceship(spaceship) {
        if (spaceship.getIsImmortal()) {
            GlobalConstants.context.globalAlpha = 0.2;
        }

        GlobalConstants.context.drawImage(spaceship.getImage(), spaceship.getX(), spaceship.getY(), spaceship.getWidth(), spaceship.getHeight());
        GlobalConstants.context.globalAlpha = 1;
    }

    function drawShield(x, y, width, height) {
        GlobalConstants.context.drawImage(shieldImage, x - 25, y - 25, width + 50, height + 50);
    }

    function drawAsteroid(asteroid) {
        GlobalConstants.context.drawImage(asteroid.getImage(), asteroid.getSpriteX(), asteroid.getSpriteY(),
            asteroid.getSpriteWidth(), asteroid.getSpriteHeight(), asteroid.getX(), asteroid.getY(),
            asteroid.getSize(), asteroid.getSize());
    }

    function drawDestroyedAsteroid(asteroid) {
        GlobalConstants.context.drawImage(asteroid.getDestroyedImage(), asteroid.getExplosionX(), asteroid.getExplosionY(), ASTEROID_EXPLOSION_SPRITE_SIZE, ASTEROID_EXPLOSION_SPRITE_SIZE,
            asteroid.getX(), asteroid.getY(), asteroid.getSize() + 60, asteroid.getSize() + 60);

        if (asteroid.getExplosionDuration() % 2 === 0) {
            asteroid.setExplosionX(asteroid.getExplosionX() + ASTEROID_EXPLOSION_SPRITE_SIZE - 4);

            if (asteroid.getExplosionX() >= 2000) {
                asteroid.setExplosionX(0);
                asteroid.setExplosionY(asteroid.getExplosionY() + ASTEROID_EXPLOSION_SPRITE_SIZE);
            }

            if (asteroid.getExplosionY() >= 1250) {
                asteroid.setExplosionY(0);
            }
        }

        asteroid.increaseExplosionDuration();
    }

    function drawBonus(bonus) {
        GlobalConstants.context.drawImage(bonus.getImage(), bonus.getX(), bonus.getY(), bonus.getSize(), bonus.getSize());
    }

    // Draws levels and text info from taking points and bonuses.
    function drawText(font, fillStyle, text, x, y) {
        GlobalConstants.context.beginPath();
        GlobalConstants.context.font = font;
        GlobalConstants.context.fillStyle = fillStyle;
        GlobalConstants.context.fillText(text, x, y);
    }

    function drawNuclearBombExplosion(x, y, asteroids, nuclearBombExplosionSize) {
        for (var i = 0; i < asteroids.length; i+= 1) {
            if (!asteroids[i].getIsDestroyed() && asteroids[i].getY() >= y && (x + nuclearBombExplosionSize >= asteroids[i].getX())) {
                asteroids[i].setIsDestroyed(true);
            }
        }

        GlobalConstants.context.drawImage(shockWaveImage, x, y, nuclearBombExplosionSize, nuclearBombExplosionSize);
    }

    return {
        drawAmmunition: drawAmmunition,
        drawBackground: drawBackground,
        drawSpaceship: drawSpaceship,
        drawShield: drawShield,
        drawAsteroid: drawAsteroid,
        drawDestroyedAsteroid: drawDestroyedAsteroid,
        drawBonus: drawBonus,
        drawText: drawText,
        drawNuclearBombExplosion: drawNuclearBombExplosion
    };
});