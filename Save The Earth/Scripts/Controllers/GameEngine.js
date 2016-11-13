define(['Keys', 'GlobalConstants', 'RandomGenerator', 'Background', 'TextInfo', 'Bonus', 'Spaceship', 'Asteroid',
    'DrawManager', 'MoveManager', 'AudioPlayer', 'InfoBoard', 'Ranking', 'Message', 'GameLoader', 'jquery', 'underscore'],
    function(Keys, GlobalConstants, RandomGenerator, Background, TextInfo, Bonus, Spaceship, Asteroid, DrawManager,
             MoveManager, AudioPlayer, InfoBoard, Ranking, Message, GameLoader, $) {

    'use strict';

    var SPACESHIP_START_X = 350,
        SPACESHIP_START_Y = 470,
        SHOW_LEVEL_DURATION = 200,
        SHOW_DESTROYED_ASTEROID_DURATION = 80,
        SHOW_GAME_OVER_MESSAGE_AT_FRAME = 200,
        FONT = '20px Arial',
        GAME_OVER_TEXT_FONT = '50px Arial',
        FILL_STYLE = 'yellow',
        TEXT_X = 100,
        TEXT_Y = 100,
        NUMBER_OF_GAME_BONUSES = _.size(GlobalConstants.bonuses),
        PAUSE_GAME_TEXT = 'Pause',
        CONTINUE_GAME_TEXT = 'Continue',
        MINIMUM_LENGTH_OF_NICKNAME = 3,
        LEVEL_TEXT = 'Level ',
        $pauseContinueGameDivButton = $('<div id="PauseContinueGameDivButton"/>'),
        $saveGameDivButton = $('<div id="SaveGameDivButton" />'),
        $backToMenuDivButton = $('<div id="BackToMenuDivButton" />'),
        $pauseContinueGameText = $('<span class="divButton"/>').text(PAUSE_GAME_TEXT),
        firstBackground = new Background(0, 0, 1000, 1080, 0, 1080, 1000, 1082),
        secondBackground = new Background(0, 0, 1000, 1080, 0, 0, 1000, 1080),
        requestAnimFrame,
        spaceship,
        infoBoard,
        asteroids = [],
        bonuses = [],
        texts = [], // It will contains objects from TextInfo class
        numberOfAsteroidsToAdd,
        animationFrameID,
        animationFrame = 0,
        lastAnimationFrame = 0,
        addAsteroidDuration = 270,
        levelCounter = 0,
        levelFrame = 0,
        isLevelUpdated = false,
        levels = [],
        eventKeys = [],
        areKeysEnabled = true,
        gameOverAnimationFrame = 0,
        hasBattleEndBackgroundMusicStarted = false;

    requestAnimFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    window.addEventListener('keydown', keysPressed, false);
    window.addEventListener('keyup', keysReleased, false);


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function startGame() {
        var initInformation;

        spaceship = new Spaceship(SPACESHIP_START_X, SPACESHIP_START_Y);
        infoBoard = new InfoBoard();

        initInformation = {
            gameLevel: 1,
            points: 0,
            lives: spaceship.getLives(),
            numberOfMissiles: spaceship.getNumberOfMissiles(),
            numberOfShields: spaceship.getNumberOfShields(),
            numberOfSpecialAbilities: spaceship.getNumberOfSpecialAbilities(),
            strength: spaceship.getStrength()
        };

        initializeInfoBoard(initInformation);
        initializeLevels();
        initializeGameState();
    }

    function loadGame(game) {
        var initInformation,
            usedSpaceship;

        usedSpaceship = _.find(GlobalConstants.spaceships, function (spaceshipObj) {
            return spaceshipObj.id === game.selectedSpaceshipID;
        });

        if (!usedSpaceship) {
            throw new Error('Invalid spaceship ID!');
        }

        GlobalConstants.SELECTED_SPACESHIP = usedSpaceship;

        spaceship = new Spaceship(SPACESHIP_START_X, SPACESHIP_START_Y);
        spaceship.setLives(game.lives);
        spaceship.setNumberOfMissiles(game.numberOfMissiles);
        spaceship.setNumberOfShields(game.numberOfShields);
        spaceship.setNumberOfSpecialAbilities(game.numberOfSpecialAbilities);
        spaceship.setStrength(game.strength);
        spaceship.setSpeed(game.speed);
        spaceship.setFireLeftMissile(game.fireLeftMissile);

        infoBoard = new InfoBoard();

        initInformation = {
            points: game.points,
            lives: spaceship.getLives(),
            numberOfMissiles: spaceship.getNumberOfMissiles(),
            numberOfShields: spaceship.getNumberOfShields(),
            numberOfSpecialAbilities: spaceship.getNumberOfSpecialAbilities(),
            strength: spaceship.getStrength()
        };

        initializeLevels();

        // Set level
        $.each(levels, function (index) {
            if (levels[index].levelNumber === game.gameLevel) {
                levelCounter = levels[index].levelNumber;
                levelFrame = 1;
                animationFrame = levels[index].startAnimationFrame;
                lastAnimationFrame = animationFrame;
                return false; // Break the loop
            }
        });

        initializeInfoBoard(initInformation);
        initializeGameState();
    }


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    function isNicknameValid(nickname) {
        // Checks if nickname contains only spaces, for example nickname = '    ';
        if (!nickname.replace(/\s/g, '').length) {
            alert('Invalid data! Nickname cannot contain only spaces! Enter valid nickname!');
        }

        if (nickname.length === 0 || nickname.length < MINIMUM_LENGTH_OF_NICKNAME || nickname.isem) {
            alert('Invalid data! Nickname must contain at least ' + MINIMUM_LENGTH_OF_NICKNAME + ' characters!');
            return false;
        }

        return true;
    }

    /**
     * Disables buttons from the short game menu.
     * @param $divButton
     */
    function disableDivButton($divButton) {
        $divButton.css('pointer-events', 'none').css('opacity', '0.4');
    }

    /**
     * Enables buttons from the short game menu.
     * @param $divButton
     */
    function enableDivButton($divButton) {
        $divButton.css('pointer-events', 'visible').css('opacity', '1');
    }

    function initializeGameState() {
        $(GlobalConstants.canvas).css('display', 'inline-block');
        AudioPlayer.playGameBackgroundMusic();

        createMenuDuringGame();
        loop();
    }

    function keysPressed(event) {
        if (areKeysEnabled) {
            eventKeys[event.keyCode] = true;
            manageKeyPressed(event);
        }
    }

    function keysReleased(event) {
        if (areKeysEnabled) {
            eventKeys[event.keyCode] = false;
            manageKeyReleased(event);
        }
    }

    function manageKeyPressed(event) {
        if (event.keyCode === Keys.getPlayerKeys()[0].firstKeyCode || event.keyCode === Keys.getPlayerKeys()[0].secondKeyCode) {
            spaceship.setIsMovingUp(true);
            event.preventDefault();
        }

        if (event.keyCode === Keys.getPlayerKeys()[1].firstKeyCode || event.keyCode === Keys.getPlayerKeys()[1].secondKeyCode) {
            spaceship.setIsMovingDown(true);
            event.preventDefault();
        }

        if (event.keyCode === Keys.getPlayerKeys()[2].firstKeyCode || event.keyCode === Keys.getPlayerKeys()[2].secondKeyCode) {
            spaceship.setIsMovingLeft(true);
            event.preventDefault();
        }

        if (event.keyCode === Keys.getPlayerKeys()[3].firstKeyCode || event.keyCode === Keys.getPlayerKeys()[3].secondKeyCode) {
            spaceship.setIsMovingRight(true);
            event.preventDefault();
        }

        if (event.keyCode === Keys.getPlayerKeys()[4].firstKeyCode) {
            spaceship.setIsFireLasers(true);
            event.preventDefault();
        }

        if (event.keyCode === Keys.getPlayerKeys()[5].firstKeyCode) {
            if (spaceship.getNumberOfMissiles() > 0) {
                spaceship.setIsFireMissile(true);
                event.preventDefault();
            }
        }

        if (event.keyCode === Keys.getPlayerKeys()[6].firstKeyCode) {
            if (spaceship.getNumberOfShields() > 0) {
                spaceship.setIsShieldActivated(true);
                infoBoard.setShields(spaceship.getNumberOfShields());
                event.preventDefault();
            }
        }

        if (event.keyCode === Keys.getPlayerKeys()[7].firstKeyCode) {
            spaceship.setIsSpecialAbilityActivated(true);
            infoBoard.setSpecialAbilities(spaceship.getNumberOfSpecialAbilities());
        }
    }

    function manageKeyReleased(event) {
        if (event.keyCode === Keys.getPlayerKeys()[0].firstKeyCode || event.keyCode === Keys.getPlayerKeys()[0].secondKeyCode) {
            spaceship.setIsMovingUp(false);
            event.preventDefault();
        }

        if (event.keyCode === Keys.getPlayerKeys()[1].firstKeyCode || event.keyCode === Keys.getPlayerKeys()[1].secondKeyCode) {
            spaceship.setIsMovingDown(false);
            event.preventDefault();
        }

        if (event.keyCode === Keys.getPlayerKeys()[2].firstKeyCode || event.keyCode === Keys.getPlayerKeys()[2].secondKeyCode) {
            spaceship.setIsMovingLeft(false);
            event.preventDefault();
        }

        if (event.keyCode === Keys.getPlayerKeys()[3].firstKeyCode || event.keyCode === Keys.getPlayerKeys()[3].secondKeyCode) {
            spaceship.setIsMovingRight(false);
            event.preventDefault();
        }

        if (event.keyCode === Keys.getPlayerKeys()[4].firstKeyCode) {
            spaceship.setIsFireLasers(false);
            event.preventDefault();
        }

        if (event.keyCode === Keys.getPlayerKeys()[5].firstKeyCode) {
            spaceship.setIsFireMissile(false);
            infoBoard.setMissiles(spaceship.getNumberOfMissiles());
            event.preventDefault();
        }
    }

    /**
     * Creates menu during game with pause button, save button, home button ...
     */
    function createMenuDuringGame() {
        var $menuDuringGameDiv = $('<div id="MenuDuringGameDiv" class="buttonBox"/>');

        $saveGameDivButton.append('<span class="divButton">Save</span>');
        $backToMenuDivButton.append('<span class="divButton">Menu</span>');
        $pauseContinueGameDivButton.append($pauseContinueGameText);
        $menuDuringGameDiv.append($pauseContinueGameDivButton, $saveGameDivButton, $backToMenuDivButton);
        $('body').append($menuDuringGameDiv);
    }

    function initializeInfoBoard(initInformation) {
        infoBoard.setLevel(levelCounter);
        infoBoard.setPoints(initInformation.points);
        infoBoard.setLives(initInformation.lives);
        infoBoard.setMissiles(initInformation.numberOfMissiles);
        infoBoard.setShields(initInformation.numberOfShields);
        infoBoard.setSpecialAbilities(initInformation.numberOfSpecialAbilities);
        infoBoard.setStrength(initInformation.strength);
    }

    function initializeLevels () {
        var numberOfLevels = 20,
            startAnimationFrame = 1,
            endAnimationFrame = 2000,
            levelFramesToAdd = 2000;

        for (var count = 1; count <= numberOfLevels; count += 1) {
            levels.push({
                levelNumber: count,
                startAnimationFrame: startAnimationFrame,
                endAnimationFrame: endAnimationFrame
            });

            startAnimationFrame += levelFramesToAdd;
            endAnimationFrame += levelFramesToAdd;
        }
    }

    function loop() {
        GlobalConstants.context.clearRect(0, 0, GlobalConstants.canvas.width, GlobalConstants.canvas.height);

        DrawManager.drawBackground(firstBackground);
        DrawManager.drawBackground(secondBackground);
        MoveManager.moveBackground(firstBackground, secondBackground);

        manageLevel();
        manageAsteroid();
        manageBonus();

        // If the number of lives is zero (0), the user LOSE the game (GAME OVER)!
        // If animationFrame reaches the endAnimationFrame of the last level, the user WIN the game.
        if (spaceship.getLives() === 0 || animationFrame >= animationFrame >= levels[levels.length - 1].endAnimationFrame) {
            if (!hasBattleEndBackgroundMusicStarted) {
                AudioPlayer.playBattleEndBackgroundMusic();
                hasBattleEndBackgroundMusicStarted = true;
            }

            // Draw 'Game Over' text, else - draw 'You Win' text
            if (spaceship.getLives() === 0) {
                DrawManager.drawText(GAME_OVER_TEXT_FONT, FILL_STYLE, 'Game Over', (GlobalConstants.canvas.width / 2) - 130,
                        GlobalConstants.canvas.height / 2);
            }
            else {
                DrawManager.drawText(GAME_OVER_TEXT_FONT, FILL_STYLE, 'You Win', (GlobalConstants.canvas.width / 2) - 130,
                        GlobalConstants.canvas.height / 2);

            }

            gameOverAnimationFrame += 1;
            areKeysEnabled = false;
            disableDivButton($pauseContinueGameDivButton);
            disableDivButton($saveGameDivButton);
        }
        else {
            manageSpaceship();
        }

        if (gameOverAnimationFrame === SHOW_GAME_OVER_MESSAGE_AT_FRAME) {
            if (spaceship.getLives() === 0) {
                Message.showGameLost();
            }
            else {
                Message.showGameWon();
            }
        }

        if (spaceship.getLives() >= 0 && gameOverAnimationFrame !== SHOW_GAME_OVER_MESSAGE_AT_FRAME) {
            animationFrameID = requestAnimFrame(loop);
        }

        animationFrame += 1;
    }

    function manageSpaceship() {
        var takenBonus;

        MoveManager.moveSpaceship(spaceship);
        DrawManager.drawSpaceship(spaceship);

        spaceship.fireLasers(asteroids);
        spaceship.fireMissile(asteroids);

        takenBonus = spaceship.checkForTakenBonus(bonuses);

        if (takenBonus) {
            switch (takenBonus.getName()) {
                case GlobalConstants.bonuses.live.name:
                    spaceship.increaseLives();
                    infoBoard.setLives(spaceship.getLives());
                    break;
                case GlobalConstants.bonuses.speed.name:
                    spaceship.increaseSpeed();
                    break;
                case GlobalConstants.bonuses.points.name:
                    infoBoard.addPoints(100);
                    break;
                case GlobalConstants.bonuses.missile.name:
                    spaceship.increaseNumberOfMissiles();
                    infoBoard.setMissiles(spaceship.getNumberOfMissiles());
                    break;
                case GlobalConstants.bonuses.shield.name:
                    spaceship.increaseNumberOfShields();
                    infoBoard.setShields(spaceship.getNumberOfShields());
                    break;
                default:
                    throw new Error('Invalid taken bonus!')
            }
        }

        spaceship.checkShield();
        spaceship.useSpecialAbility(asteroids);

        if (spaceship.hasCrashedIntoAsteroid(asteroids)) {
            if (spaceship.hasLostLife()) {
                infoBoard.setLives(spaceship.getLives());
                spaceship.setX(SPACESHIP_START_X);
                spaceship.setY(SPACESHIP_START_Y);
            }

            infoBoard.setStrength(spaceship.getStrength());
        }
    }

    function manageLevel() {
        $.each(levels, function (index) {
            if (animationFrame === levels[index].startAnimationFrame) {
                isLevelUpdated = true;

                if (levels[index].levelNumber >= 1 && levels[index].levelNumber <= 2) {
                    // If level is first or second
                    numberOfAsteroidsToAdd = index + 1;
                }
                else if (levels[index].levelNumber >= 3 && levels[index].levelNumber <= 6) {
                    // If level is between third and sixth -> add 3 asteroids
                    numberOfAsteroidsToAdd = 3;
                }
                else if (levels[index].levelNumber >= 7 && levels[index].levelNumber <= 9) {
                    // If level is between seventh and ninth -> add 4 asteroids
                    numberOfAsteroidsToAdd = 4;
                }
                else if (levels[index].levelNumber >= 10 && levels[index].levelNumber <= 13) {
                    // If level is between tenth and thirteenth -> add 5 asteroids
                    numberOfAsteroidsToAdd = 5;
                }
                else if (levels[index].levelNumber >= 14 && levels[index].levelNumber <= 17) {
                    // If level is between fourteenth and seventeenth -> add 6 asteroids
                    numberOfAsteroidsToAdd = 6;
                }
                else if (levels[index].length >= 18 && levels[index].levelNumber <= 20) {
                    // If level is between eighteenth and twentieth -> add 7 asteroids
                    numberOfAsteroidsToAdd = 7;
                }
                else {
                    throw new RangeError('Invalid level! Level must be in range [1 - 20]!');
                }

                addBonus(levels[index], index + 1);
                return false; // breaks the jQuery .each() loop
            }
        });

        displayLevel();
        displayTextInfo();

        if (animationFrame === lastAnimationFrame + addAsteroidDuration) {
            // Adds asteroid at every addAsteroidDuration milliseconds.
            addAsteroidAtSpecificTime();
        }
    }

    function addBonus(currentLevel, numberOfBonusesToAdd) {
        var bonus,
            bonusID,
            index;

        for (index = 1; index <= numberOfBonusesToAdd; index += 1) {
            bonusID = RandomGenerator.getRandomNumber(1, NUMBER_OF_GAME_BONUSES);
            bonus = new Bonus(bonusID);
            bonus.setDisplayTime(RandomGenerator.getRandomNumber(currentLevel.startAnimationFrame, currentLevel.endAnimationFrame));
            bonuses.push(bonus);
        }
    }

    function displayLevel() {
        if (isLevelUpdated && levelFrame <= SHOW_LEVEL_DURATION) {
            if (levelFrame === 0) {
                levelCounter += 1;
                infoBoard.setLevel(levelCounter);
            }

            levelFrame += 1;
            DrawManager.drawText(FONT, FILL_STYLE, LEVEL_TEXT + levelCounter.toString(), TEXT_X, TEXT_Y);
        }
        else {
            levelFrame = 0;
            isLevelUpdated = false;
        }
    }

    function displayTextInfo() {
        _.each(texts, function (textInfo) {
            DrawManager.drawText(textInfo.getFont(), textInfo.getFillStyle(), textInfo.getText(), textInfo.getX(), textInfo.getY());
            MoveManager.moveTextInfo(textInfo);

            if (textInfo === GlobalConstants.canvas.height || !textInfo.getIsShown()) {
                texts.shift();
            }
        });
    }

    /**
     * Adds asteroids with medium size and speed and adds asteroids with random size and speed.
     */
    function addAsteroidAtSpecificTime() {
        var randomAsteroidSize,
            randomAsteroidSpeed;

        // Adds asteroid with random size and speed if the current level is bigger or equal to fourth level.
        if (animationFrame >= levels[3].startAnimationFrame) {
            randomAsteroidSize = getRandomAsteroidProperty(GlobalConstants.asteroidTypes.size);
            randomAsteroidSpeed = getRandomAsteroidProperty(GlobalConstants.asteroidTypes.speed);
            addAsteroid(numberOfAsteroidsToAdd - 2, randomAsteroidSize, randomAsteroidSpeed);
        }

        // Adds asteroid with medium size and normal speed.
        addAsteroid(numberOfAsteroidsToAdd, GlobalConstants.asteroidTypes.size.medium, GlobalConstants.asteroidTypes.speed.normal);
        lastAnimationFrame = animationFrame;
    }

    function getRandomAsteroidProperty(obj) {
        var objKeys = Object.keys(obj);
        return obj[objKeys[ objKeys.length * Math.random() << 0]];
    }

    function addAsteroid(numberOfAsteroids, size, speed) {
        for (var i = 0; i < numberOfAsteroids; i += 1) {
            asteroids.push(new Asteroid(size, speed));
        }
    }

    function manageAsteroid() {
        var pointsFromAsteroidDestruction = 0,
            index;

        for (index = 0; index < asteroids.length; index += 1) {
            if (asteroids[index].getY() >= GlobalConstants.canvas.height) {
                if (index === 0) {
                    asteroids.shift();
                }
                else {
                    asteroids.splice(index, 1);
                }

                // Prevents from asteroid blinking. Without this, when some asteroid reaches the end of the canvas,
                // the next asteroid will blink one time.
                index -= 1;
            }
            else if (!asteroids[index].getIsDestroyed()) {
                DrawManager.drawAsteroid(asteroids[index]);
                MoveManager.moveAsteroid(asteroids[index]);
            }
            else {
                if (asteroids[index].getExplosionDuration() ===  1) {
                    pointsFromAsteroidDestruction = getPointsFromAsteroidDestruction(asteroids[index]);
                    texts.push(new TextInfo(asteroids[index].getX(), asteroids[index].getY(), '+' + pointsFromAsteroidDestruction));

                    infoBoard.addPoints(pointsFromAsteroidDestruction);
                    AudioPlayer.playDestroyedAsteroidSound();
                }

                DrawManager.drawDestroyedAsteroid(asteroids[index]);

                if (asteroids[index].getExplosionDuration() > SHOW_DESTROYED_ASTEROID_DURATION) {
                    asteroids.splice(index, 1);

                    // Prevents from asteroid blinking when it is destroyed. Without this, when some asteroid is been
                    // destroyed, the next asteroid will blink one time.
                    index -= 1;
                }
            }
        }
    }

    function getPointsFromAsteroidDestruction(asteroid) {
        var points = 0;

        switch (asteroid.getSize()) {
            case GlobalConstants.asteroidTypes.size.small:
                points += 5;
                break;
            case GlobalConstants.asteroidTypes.size.medium:
                points += 10;
                break;
            case GlobalConstants.asteroidTypes.size.large:
                points += 15;
                break;
            default: throw new Error('Invalid asteroid size!');
        }

        switch (asteroid.getSpeed()) {
            case GlobalConstants.asteroidTypes.speed.slow:
                points += 5;
                break;
            case GlobalConstants.asteroidTypes.speed.normal:
                points += 10;
                break;
            case GlobalConstants.asteroidTypes.speed.fast:
                points += 15;
                break;
            default: throw new Error('Invalid asteroid speed!');
        }

        return points;
    }

    function manageBonus() {
        _.each(bonuses, function (bonus, index) {
            if (animationFrame === bonus.getDisplayTime()) {
                bonus.setIsShown(true);
            }

            if (bonus.getIsShown()) {
                DrawManager.drawBonus(bonus);
                MoveManager.moveBonus(bonus);
            }

            if (bonus.getIsTaken()) {
                texts.push(new TextInfo(bonus.getX(), bonus.getY(), bonus.getName()));
                bonuses.splice(index, 1);
            }
            if (bonus === GlobalConstants.canvas.height) {
                bonuses.shift();
            }
        });
    }

    /**
     * Saves games by using cookies. Creates new cookie for every saved game. The ID of the new saved game
     * can be determined with the method getLastSavedGameID();
     * @param nickname - the nickname of the player.
     */
    function saveGame(nickname) {
       var date = new Date(),
           validDays = 30,
           expires,
           path,
           cookieToSaveGame,
           saveGameID = GameLoader.getLastSavedGameID();

        date.setTime(date.getTime() + (validDays * 24 * 60 * 60 * 1000));
        expires = 'expires=' + date.toUTCString();
        path = 'path=/';
        cookieToSaveGame = {
            id: saveGameID,
            nickname: nickname,
            gameLevel: levelCounter,
            points: infoBoard.getPoints(),
            lives: spaceship.getLives(),
            numberOfMissiles: spaceship.getNumberOfMissiles(),
            numberOfShields: spaceship.getNumberOfShields(),
            numberOfSpecialAbilities: spaceship.getNumberOfSpecialAbilities(),
            strength: spaceship.getStrength(),
            selectedSpaceshipID: GlobalConstants.SELECTED_SPACESHIP.id,
            speed: spaceship.getSpeed(),
            fireLeftMissile: spaceship.getFireLeftMissile(),
            imageSrc: spaceship.getImage().src,
            date: new Date()
        };

        document.cookie = 'savedGame-' + saveGameID + '=' + JSON.stringify(cookieToSaveGame) + ';' + expires + ';' + path;
    }

        
    /* -------------------- EVENTS -------------------- */

    $pauseContinueGameDivButton.on('click', function () {
        if ($pauseContinueGameText.text() === PAUSE_GAME_TEXT) {
            cancelAnimationFrame(animationFrameID);
            $pauseContinueGameText.text(CONTINUE_GAME_TEXT);
            DrawManager.drawText(FONT, FILL_STYLE, 'GAME PAUSED', TEXT_X + 450, TEXT_Y);
        }
        else {
            requestAnimationFrame(loop);
            $pauseContinueGameText.text(PAUSE_GAME_TEXT);
        }
    });

    $saveGameDivButton.on('click', function () {
        areKeysEnabled = false;
        cancelAnimationFrame(animationFrameID);
        Message.showAskingForSaveGameMessage();
    });

    $backToMenuDivButton.click(function () {
        location.reload();
    });

    $('#SaveGameBtn').on('click', function () {
        var $nicknameTextField = $('#NicknameMessageTextField'),
            nickname = $nicknameTextField.val(),
            messageText;

        if (!isNicknameValid(nickname)) {
            $nicknameTextField.css('border', '2px solid red');
        }
        else {
            // Save username and points into the ranking list if the game is over
            if (spaceship.getLives() === 0 || levelCounter === 2) {
                Ranking.addNicknameAndPointsToRanking(nickname, infoBoard.getPoints());
                messageText = 'Your nickname and points were saved successfully in the ranking list!'
            }
            else {
                saveGame(nickname);
                messageText = 'Your game was saved successfully!';
            }

            Message.showGameSavedSuccessfully(messageText);
        }
    });

    $('#CancelBtn').click(function () {
        if (gameOverAnimationFrame !== SHOW_GAME_OVER_MESSAGE_AT_FRAME) {
            enableDivButton($pauseContinueGameDivButton);
            enableDivButton($saveGameDivButton);
            areKeysEnabled = true;
            requestAnimationFrame(loop);
        }
    });

    return {
        startGame: startGame,
        loadGame: loadGame
    };
});