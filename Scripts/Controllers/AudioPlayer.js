define(['jquery'], function ($) {
    'use strict';

    var MUTE_VOLUME_LEVEL = 0,
        FIRST_VOLUME_LEVEL = 0.2,
        SECOND_VOLUME_LEVEL = 0.6,
        THIRD_VOLUME_LEVEL = 1,
        currentVolumeLevel = THIRD_VOLUME_LEVEL,
        backgroundMusic = document.createElement('AUDIO'),
        playMusicText = 'Play',
        pauseMusicText = 'Pause Music',
        $playPauseButtonDiv = $('<div id="PlayPauseMusicButtonDiv"/>'),
        $volumeUpButtonDiv = $('<div id="VolumeUpButtonDiv" />'),
        $volumeDownButtonDiv = $('<div id="VolumeDownButtonDiv" />'),
        $volumeButtonDiv = $('<div id="VolumeButtonDiv" />'),
        $textUnderPlayButton = $('<p/>').text(pauseMusicText),
        $textUnderVolumeUpButton = $('<p/>').text('Volume Up'),
        $textUnderVolumeDownButton = $('<p/>').text('Volume Down'),
        $textUnderVolumeButton = $('<p/>').text('Volume'),
        playButtonImage = new Image(),
        pauseButtonImage = new Image(),
        volumeUpButtonImage = new Image(),
        volumeDownButtonImage = new Image(),
        volumeButtonImage = new Image(),
        volumeOffImage = new Image(),
        isMusicOn = true,
        volumeLevel = 0,
        audioPlayerImagesDirectory = 'Images/AudioPlayerImages/';

    playButtonImage.src = audioPlayerImagesDirectory + 'play-icon.png';
    pauseButtonImage.src = audioPlayerImagesDirectory + 'pause-icon.png';
    volumeUpButtonImage.src = audioPlayerImagesDirectory + 'volume-up.png';
    volumeDownButtonImage.src = audioPlayerImagesDirectory + 'volume-down.png';
    volumeButtonImage.src = audioPlayerImagesDirectory + 'Sound - On3.png';

    backgroundMusic.volume = FIRST_VOLUME_LEVEL;
    determinateWhichVolumeIconToDisplay();


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function playGameBackgroundMusic() {
        playBackgroundMusic('game-background-music.mp3');
    }

    function playMenuBackgroundMusic() {
        playBackgroundMusic('menu-background-music.mp3');
    }

    function playGameLostBackgroundMusic() {
        playBackgroundMusic('defeat-background-music.mp3');
    }

    function playBattleEndBackgroundMusic() {
        playBackgroundMusic('battle-end-background-music.mp3');
    }

    function audioPlayerControllers() {
        var $audioPlayer = $('<div/>');
        $audioPlayer.attr('id', 'AudioPlayer');

        $playPauseButtonDiv.append(pauseButtonImage, $textUnderPlayButton);
        $volumeDownButtonDiv.append(volumeDownButtonImage, $textUnderVolumeDownButton);
        $volumeUpButtonDiv.append(volumeUpButtonImage, $textUnderVolumeUpButton);
        $volumeButtonDiv.append(volumeButtonImage, $textUnderVolumeButton);

        $audioPlayer.append($playPauseButtonDiv, $volumeDownButtonDiv, $volumeUpButtonDiv, $volumeButtonDiv);
        $('body').append($audioPlayer);
    }

    function playFireLasersSound() {
        playSound('fire-lasers.mp3');
    }

    function playFireMissileSound() {
        playSound('fire-missile.mp3');
    }

    function playHitAsteroidSound() {
        playSound('hit-asteroid.mp3');
    }

    function playDestroyedAsteroidSound() {
        playSound('destroyed-asteroid.mp3');
    }

    function playNuclearExplosionSound() {
        playSound('nuclear-explosion.mp3');
    }


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    // Plays sounds like fire missiles, destroy asteroid, hit asteroid ...
    function playSound(soundSrc) {
        var sound = new Audio('Sounds/' + soundSrc);
        sound.play();
    }

    // Plays background music of menu and game.
    function playBackgroundMusic(musicSrc) {
        if (isMusicOn) {
            backgroundMusic.src = 'Sounds/' + musicSrc;
            backgroundMusic.loop = true;
            backgroundMusic.load();
            backgroundMusic.play();
        }
    }

    function determinateWhichVolumeIconToDisplay() {
        var volumeImageSrc;

        switch(backgroundMusic.volume) {
            case MUTE_VOLUME_LEVEL:
                volumeImageSrc = 'Sound - Mute.png';
                break;
            case FIRST_VOLUME_LEVEL:
                volumeImageSrc = 'Sound - On1.png';
                break;
            case SECOND_VOLUME_LEVEL:
                volumeImageSrc = 'Sound - On2.png';
                break;
            case THIRD_VOLUME_LEVEL:
                volumeImageSrc = 'Sound - On3.png';
                break;
            default:
                throw new Error('Invalid volume level !!!');
        }

        volumeButtonImage.src = audioPlayerImagesDirectory + volumeImageSrc;
    }


    /* -------------------- EVENTS -------------------- */

    $playPauseButtonDiv.on('click', function () {
        if (isMusicOn && backgroundMusic) {
            backgroundMusic.pause();
            pauseButtonImage.src = audioPlayerImagesDirectory + 'play-icon.png';
            $textUnderPlayButton.text(playMusicText);
            isMusicOn = false;
            backgroundMusic.volume = 0;
        }
        else {
            backgroundMusic.play();
            pauseButtonImage.src = audioPlayerImagesDirectory + 'pause-icon.png';
            $textUnderPlayButton.text(pauseMusicText);
            isMusicOn = true;
            backgroundMusic.volume = currentVolumeLevel;
        }

        determinateWhichVolumeIconToDisplay();
    });

    $volumeUpButtonDiv.on('click', function () {
        if (currentVolumeLevel < THIRD_VOLUME_LEVEL) {
            currentVolumeLevel += 0.4;
            currentVolumeLevel = currentVolumeLevel.toFixed(1);
            currentVolumeLevel = parseFloat(currentVolumeLevel);

            if (currentVolumeLevel > 1) {
                backgroundMusic.volume = 1;
            }
            else {
                backgroundMusic.volume = currentVolumeLevel;
            }

            determinateWhichVolumeIconToDisplay();
        }
    });

    $volumeDownButtonDiv.on('click', function () {
       if (currentVolumeLevel > 0) {
           currentVolumeLevel -= 0.4;
           currentVolumeLevel = currentVolumeLevel.toFixed(1);
           currentVolumeLevel = parseFloat(currentVolumeLevel);

           if (currentVolumeLevel < 0) {
               backgroundMusic.volume = 0;
           }
           else {
               backgroundMusic.volume = currentVolumeLevel;
           }

           determinateWhichVolumeIconToDisplay();
       }
    });

    return {
        audioPlayerControllers: audioPlayerControllers,
        playMenuBackgroundMusic: playMenuBackgroundMusic,
        playGameBackgroundMusic: playGameBackgroundMusic,
        playBattleEndBackgroundMusic: playBattleEndBackgroundMusic,
        playFireLasersSound : playFireLasersSound,
        playFireMissileSound: playFireMissileSound,
        playHitAsteroidSound: playHitAsteroidSound,
        playNuclearExplosionSound: playNuclearExplosionSound,
        playDestroyedAsteroidSound: playDestroyedAsteroidSound
    };
});