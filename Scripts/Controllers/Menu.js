define(['GlobalConstants', 'Keys', 'Actions', 'GameEngine', 'Ranking', 'Message', 'SelectSpaceship', 'GameLoader', 'jquery',
    'underscore'], function (GlobalConstants, Keys, Actions, GameEngine, Ranking, Message, SelectSpaceship, GameLoader, $) {

    'use strict';

    var $menu = $('#Menu'),
        $welcomeScreen = $('#WelcomeScreen'),
        $optionsScreen = $('#OptionsScreen'),
        $rankingScreen = $('#RankingScreen'),
        $infoScreen = $('#InfoScreen'),
        $selectSpaceshipScreen = $('#SelectSpaceshipScreen'),
        $loadGameScreen = $('#LoadGameScreen'),
        $newGameBtn = $('#NewGame'),
        $continueGameBtn = $('#Continue'),
        $optionsBtn  = $('#Options'),
        $rankingBtn = $('#Ranking'),
        $infoBtn = $('#Info'),
        $yesMessageBtn = $('#YesBtn'),
        $currentKeys = $('#CurrentKeysDiv'),
        $changeCurrentKeys = $('#ChangeCurrentKeys'),
        $playerKeysTable = $('#PlayerKeysTable'),
        $playerKeysForChangeForm = $('#PlayerKeysForChange'),
        $changeBtn = $('#ChangeBtn'),
        $defaultBtn = $('#DefaultBtn'),
        $sortRanking = $('#SortRanking'),
        $leftArrowSlider = $('#LeftArrowSlider'),
        $rightArrowSlider = $('#RightArrowSlider'),
        $tableRanking = $('#RankingScreen table tbody'),
        $infoTabs = $('#InfoTabs ul li'),
        $homeBtn = $('<div id="Home" class="button"/>'),
        $homeImg = $('<img src="Images/MenuImages/home.png"/>'),
        $homeText = $('<p>Home</p>'),
        $startGameBtn = $('<span class="divButton">Start Game</span>'),
        $loadGameDivBtn = $('#LoadGameBtn'),
        $deleteGameDivBtn = $('#DeleteGame'),
        changeKeyTextFieldID = '',
        gameAction = '',
        gameKey = '',
        gameKeyCode = 0,
        hasGameStarted,
        hasPlayerChangedKey = false,
        sliderIndex = 0;

    $homeBtn.hide();
    $menu.prepend($homeBtn.append($homeImg, $homeText));

    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function loadMenu() {
        hasGameStarted = false;
        addRowsToCurrentKeysTable();
        createLabelsAndTextFieldsForChangingCurrentKeys();
        createRankingTable();
    }


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    /**
     * Add tr and td elements to the body of the table.
     */
    function addRowsToCurrentKeysTable() {
        var $tr = $('<tr/>'),
            $actionTD = $('<td/>'),
            $keyTD = $('<td/>'),
            documentFragment = document.createDocumentFragment();

        _.each(Keys.getPlayerKeys(), function () {
            $tr.append($actionTD, $keyTD);
            documentFragment.appendChild($tr[0].cloneNode(true));
        });

        $playerKeysTable.append(documentFragment);
    }

    function addActionsAndKeysIntoCurrentKeysTable() {
        var id = "#" + $playerKeysTable.attr('id'),
            actionsTd = $(id + ' tr td:nth-child(1)'),
            keysTd = $(id + ' tr td:nth-child(2)');

        if (Actions.PLAYER_GAME_ACTIONS.length !== Keys.getPlayerKeys().length) {
            throw new Error('PLAYER_GAME_ACTIONS and playerKeys must be with same length!');
        }

        _.each(Keys.getPlayerKeys(), function (objKey, index) {
            $(actionsTd[index]).html(Actions.PLAYER_GAME_ACTIONS[index]);
            $(keysTd[index]).html(objKey.firstKey);

            if (objKey.secondKey) {
                $(keysTd[index]).html($(keysTd[index]).html() + ' or ' + objKey.secondKey);
            }
        });
    }

    function createLabelsAndTextFieldsForChangingCurrentKeys() {
        var $label = $('<label/>'),
            $textField = $('<input type="text"/>'),
            $br = $('<br/>'),
            documentFragment = document.createDocumentFragment(),
            id = '';

        _.each(Actions.PLAYER_GAME_ACTIONS, function (action, actionIndex) {

            // This condition prevents from changing keys for Move Up, Down, Left and Right game actions!
            if (actionIndex > 3) {
                id = generateTextFieldID(action);
                $label.attr('for', id);
                $textField
                    .attr('id', id)
                    .attr('maxlength', 1);

                $(documentFragment).append($label[0].cloneNode(true), $textField[0].cloneNode(true), $br[0].cloneNode(true));
            }
        });

        $playerKeysForChangeForm.append(documentFragment);
    }

    function addActionsAndKeysIntoLabelsAndTextFields() {
        var $labels = $($playerKeysForChangeForm.selector + ' label'),
            $textFields = $($playerKeysForChangeForm.selector + ' input[type="text"]'),
            labelAndFieldIndex = 0;

        $textFields.val('');

        if (Actions.PLAYER_GAME_ACTIONS.length !== Keys.getPlayerKeys().length) {
            throw new Error('Actions and current VALID_SPECIAL_KEYS must be with same length!');
        }

        _.each(Keys.getPlayerKeys(), function (objKey, actionIndex) {
            // This condition prevents from changing buttons for Move Up, Down, Left and Right actions!
            if (actionIndex > 3) {
                $($labels[labelAndFieldIndex]).html(Actions.PLAYER_GAME_ACTIONS[actionIndex]);
                $($textFields[labelAndFieldIndex]).attr('placeholder', objKey.firstKey);

                if (objKey.secondKey) {
                    $($textFields[labelAndFieldIndex])
                        .attr('placeholder', $($textFields[labelAndFieldIndex])
                            .attr('placeholder') + ' or ' + objKey.secondKey);
                }

                labelAndFieldIndex += 1;
            }
        });
    }

    function generateTextFieldID(keyAction) {
        return 'InputKeyFor' + keyAction.replace(/ /g, '') + 'Action';
    }

    function createRankingTable() {
        var $tr = $('<tr/>'),
            $nickNameTd = $('<td/>'),
            $pointsTd = $('<td/>'),
            documentFragment = document.createDocumentFragment();

        _.each(Ranking.getRanking(), function () {
            $tr.append($nickNameTd, $pointsTd);
            documentFragment.appendChild($tr[0].cloneNode(true));
            $tableRanking.append(documentFragment);
        });

        $tableRanking.append(documentFragment);
    }

    function addNicknamesAndPointsIntoRankingTable(rankingTable) {
        var id = $tableRanking.selector,
            nicknamesTd = $(id + ' tr td:nth-child(1)'),
            pointsTd = $(id + ' tr td:nth-child(2)'),
            levelsTd = $(id + ' tr td:nth-child(3)'),
            ranking = rankingTable || Ranking.getRanking();

        _.each(ranking, function (rankObj, index) {
            $(nicknamesTd[index]).html(rankObj.nickname);
            $(pointsTd[index]).html(rankObj.points);
            $(levelsTd[index]).html(rankObj.level);
        });
    }

    function checkInputtedKey(textField, keyCode) {
        var actionIndex,
            currentlyInUseKey;

        gameKey = checkIfKeyIsInvalid(keyCode);

        if (gameKey) {
            Message.showInvalidKeyMessage(gameKey);
        }
        else {
            gameKey = checkIfKeyIsSpecial(keyCode);
            gameKeyCode = keyCode;

            if (!gameKey) {
                gameKey = String.fromCharCode(keyCode);
            }

            textField.val(gameKey);
            currentlyInUseKey = checkIfKeyCodeIsCurrentlyInUse(keyCode);

            if (currentlyInUseKey) {
                actionIndex = Keys.getPlayerKeys().indexOf(currentlyInUseKey);
                gameAction = Actions.PLAYER_GAME_ACTIONS[actionIndex];
                Message.showKeyIsCurrentlyInUseMessage(gameKey, gameAction);
            }
            else {
                changeKeyTextFieldID = textField.attr('id');
                gameAction = $playerKeysForChangeForm.find($('[for=' + changeKeyTextFieldID + ']')).html();
                Message.showAvailableKeyMessage(gameKey, gameAction);
            }
        }
    }

    /**
     * Checks if key exists.
     * @param keyCode - the code of the checked key.
     * @returns object with key and code properties if the keyCode exists in the INVALID_KEYS array
     * or returns undefined if keyCode does not exist in the array.
     */
    function checkIfKeyIsInvalid(keyCode) {
        return _.find(Keys.INVALID_KEYS, function (invalidKey) {
            return keyCode === invalidKey.code;
        });
    }

    /**
     * Checks if key is special, for example: Space, Left Arrow, Numpad 6 ...
     * @param keyCode - the code of the checked key.
     * @returns the name of the key if key exists in VALID_SPECIAL_KEYS array or undefined if key is not special.
     */
    function checkIfKeyIsSpecial(keyCode) {
        var specialKey = _.find(Keys.VALID_SPECIAL_KEYS, function (specialKey) {
            return keyCode === specialKey.code;
        });

        if (specialKey) {
            return specialKey.key
        }
    }

    /**
     * Checks if key is currently in use.
     * @param keyCode - the code of the checked key.
     * @returns object with key and code property if the keyCode exists in the array
     * or returns undefined if keyCode does not exist.
     */
    function checkIfKeyCodeIsCurrentlyInUse(keyCode) {
        return _.find(Keys.getPlayerKeys(), function (objKey) {
            return keyCode === objKey.firstKeyCode || keyCode === objKey.secondKeyCode;
        });
    }

    function checkWhenToShowArrowsFromSlider() {
        // If there is only one saved game - no need to show the arrows.
        if (GameLoader.allSavedGames.length === 1) {
            $leftArrowSlider.hide();
            $rightArrowSlider.hide();
        }
        else if (sliderIndex === 0) {
            $leftArrowSlider.hide();
            $rightArrowSlider.show();
        }
        else if (sliderIndex === GameLoader.allSavedGames.length - 1) {
            $rightArrowSlider.hide();
            $leftArrowSlider.show();
        }
        else {
            $leftArrowSlider.show();
            $rightArrowSlider.show();
        }
    }

    function showSavedGames() {
        var date = new Date(GameLoader.allSavedGames[sliderIndex].date);

        $('#DateOfSavedGame').html(date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear());
        $('#TimeOfSavedGame').html(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
        $('#Nickname').children('span').html(GameLoader.allSavedGames[sliderIndex].nickname);
        $('#Level').children('span').html(GameLoader.allSavedGames[sliderIndex].gameLevel);
        $('#Points').children('span').html(GameLoader.allSavedGames[sliderIndex].points);
        $('#Lives').children('span').html(GameLoader.allSavedGames[sliderIndex].lives);

        $('#UsedSpaceship').css('background', 'url("' + GameLoader.allSavedGames[sliderIndex].imageSrc + '") no-repeat center');
    }


    /* -------------------- EVENTS -------------------- */

    $('.button').on('click', function () {
        $welcomeScreen.hide();
        $optionsScreen.hide();
        $rankingScreen.hide();
        $infoScreen.hide();
        $selectSpaceshipScreen.hide();
        $loadGameScreen.hide();

        if ($welcomeScreen.is(':hidden')) {
            $homeBtn.show();
        }
    });

    $homeBtn.on('click', function () {
        $menu.children().hide();
        $welcomeScreen.show();
        $(this).hide();
    });

    $newGameBtn.on('click', function () {
        var $buttonBox =  $('<div class="buttonBox"/>').append($startGameBtn);

        $selectSpaceshipScreen.show();
        $selectSpaceshipScreen.append($buttonBox);
        SelectSpaceship.showSlider();
    });

    $continueGameBtn.click(function () {
        manageLoadGameScreen();
    });

    $optionsBtn.on('click', function () {
        $changeCurrentKeys.hide();
        $optionsScreen.show();
        $currentKeys.show();
        addActionsAndKeysIntoCurrentKeysTable();
    });

    $rankingBtn.on('click', function () {
        $rankingScreen.show();
        addNicknamesAndPointsIntoRankingTable();
    });

    $infoBtn.on('click', function () {
        $infoScreen.show();
    });

    $infoTabs.on('click', function () {
        var selectedTabClass = 'selectedTab',
            divId = $(this).children('a').attr('href'),
            othersDivs = $('#InfoTabs div').not(divId);

        $infoTabs.removeClass(selectedTabClass);

        if ($(divId).css('display') === 'none') {
            $(this).addClass(selectedTabClass);
        }

        $(othersDivs).hide();
        $(divId).slideToggle();

        if ($(divId).css('height') === '400px') {
            $(divId).css('overflow-y', 'auto');
        }
    });

    $loadGameDivBtn.click(function () {
        $menu.hide();
        hasGameStarted = true;
        GameEngine.loadGame();
    });

    $deleteGameDivBtn.click(function () {
        var savedGamedID = GameLoader.allSavedGames[sliderIndex].id;
        GameLoader.deleteSavedGame(savedGamedID);

        if (sliderIndex > 0) {
            sliderIndex -= 1;
        }

        manageLoadGameScreen();
    });

    $yesMessageBtn.on('click', function () {
        Keys.saveChangedKey(gameAction, gameKey, gameKeyCode);
        addActionsAndKeysIntoCurrentKeysTable();
        hasPlayerChangedKey = true;
    });

    $('#ChangeCurrentKeys form').on('keydown', 'input[type="text"]', function (event) {
        checkInputtedKey($(this), event.keyCode);
    });

    $changeBtn.on('click', function () {
        $currentKeys.hide();
        $changeCurrentKeys.show();
        addActionsAndKeysIntoLabelsAndTextFields();
    });

    $defaultBtn.on('click', function () {
        if (hasPlayerChangedKey) {
            Message.showAskingForUsingDefaultKeysMessage();
        }
        else {
            Message.showYouAreUsingDefaultKeysMessage();
        }
    });

    $sortRanking.change(function () {
        var sortBy = $(this).val(),
            newRanking =_.sortBy(Ranking.getRanking(), sortBy);

        if (sortBy !== 'nickname') {
            newRanking.reverse();
        }

        addNicknamesAndPointsIntoRankingTable(newRanking);
    });

    $('#UseDefaultKeysBtn').click(function () {
        Keys.useDefaultKeys();
    });

    $startGameBtn.on('click', function () {
        $menu.hide();
        hasGameStarted = true;
        SelectSpaceship.setSelectedSpaceship();
        GameEngine.startGame();
    });

    $leftArrowSlider.click(function () {
        sliderIndex -= 1;
        showSavedGames();
        checkWhenToShowArrowsFromSlider();
    });

    $rightArrowSlider.click(function () {
        sliderIndex += 1;
        showSavedGames();
        checkWhenToShowArrowsFromSlider();
    });

    $('#LoadGame').click(function () {
        $menu.hide();
        hasGameStarted = true;
        GameEngine.loadGame(GameLoader.allSavedGames[sliderIndex]);
    });

    function manageLoadGameScreen() {
        $loadGameScreen.show();

        if (GameLoader.allSavedGames.length === 0) {
            $('#LoadGameScreenContainer').hide();
            $loadGameScreen.append($('<h1 id="NoSavedGames">There are no saved games!</h1>'));
        }
        else {
            $('#LoadGameScreenContainer').show();
            showSavedGames();
            checkWhenToShowArrowsFromSlider();
        }
    }

    return {
        loadMenu: loadMenu
    };
});