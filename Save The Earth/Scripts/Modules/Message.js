define(['jquery'], function ($) {
    'use strict';

    var WARNING_MESSAGE_TITLE = 'Warning',
        CONFIRM_MESSAGE_TITLE = 'Confirm',
        ERROR_MESSAGE_TITLE = 'Error',
        SUCCESS_MESSAGE_TITLE = 'Success',
        SAVE_GAME_MESSAGE_TITLE = 'Save Game',
        LOST_GAME_MESSAGE_TITLE = 'Lost Game',
        WON_GAME_MESSAGE_TITLE = 'Won Game',
        $messageBox = $('<div id="MessageBox"/>'),
        $messageBackground = $('<div id="MessageBackground"/>'),
        $messageTitle = $('<div id="MessageTitle"/>'),
        $messageDescription = $('<div id="MessageDescription"/>'),
        $messageButtons = $('<div id="MessageButtons"/>'),
        $yesMessageBtn = $('<button id="YesBtn" class="messageBtn">Yes</button>'),
        $noMessageBtn = $('<button id="NoBtn" class="messageBtn">No</button>'),
        $okMessageBtn = $('<button id="OKBtn" class="messageBtn">OK</button>'),
        $useDefaultKeysBtn = $('<button id="UseDefaultKeysBtn" class="messageBtn">Use default keys</button>'),
        $saveGameMessageBtn = $('<button id="SaveGameBtn" class="messageBtn">Save</button>'),
        $cancelBtn = $('<button id="CancelBtn" class="messageBtn">Cancel</button>'),
        $nicknameTextField = $('<input type="text" id="NicknameMessageTextField" placeholder="Enter nickname..." />');

    $messageButtons.append($okMessageBtn, $useDefaultKeysBtn, $yesMessageBtn, $noMessageBtn, $saveGameMessageBtn, $cancelBtn);
    $messageBox
        .hide()
        .append($messageBackground
            .append($messageTitle, $messageDescription, $nicknameTextField, $messageButtons));

    $('body').append($messageBox);

    $noMessageBtn
        .add($okMessageBtn)
        .add($cancelBtn)
        .add($yesMessageBtn)
        .add($useDefaultKeysBtn)
        .on('click', function () {
            $messageBox.hide();
        });

    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function showInvalidKeyMessage(invalidKey) {
        hideAllMessageComponents();
        $okMessageBtn.show();
        $messageBox.show();
        $messageTitle.html(ERROR_MESSAGE_TITLE);
        $messageDescription.html('Invalid key! You cannot use ' + invalidKey.key + ' key!');
    }

    function showAvailableKeyMessage(key, action) {
        hideAllMessageComponents();
        $yesMessageBtn.show();
        $noMessageBtn.show();
        $messageBox.show();
        $messageTitle.html(CONFIRM_MESSAGE_TITLE);
        $messageDescription.html('Are you sure you want to use key ' + key + ' for ' + action + ' action?');
    }

    function showKeyIsCurrentlyInUseMessage(key, action) {
        hideAllMessageComponents();
        $okMessageBtn.show();
        $messageBox.show();
        $messageTitle.html(WARNING_MESSAGE_TITLE);
        $messageDescription.html('The key ' + key + ' is currently in use for action ' + action + '! If you want to use this key, ' +
            'first you need to remove it from the current action, by set new key for the action ' + action + '!');
    }

    function showAskingForUsingDefaultKeysMessage() {
        hideAllMessageComponents();
        $messageBox.show();
        $useDefaultKeysBtn.show();
        $cancelBtn.show();
        $messageTitle.html(CONFIRM_MESSAGE_TITLE);
        $messageDescription.html('Are you sure you want to use default keys?');
    }

    function showYouAreUsingDefaultKeysMessage() {
        hideAllMessageComponents();
        $messageBox.show();
        $okMessageBtn.show();
        $messageTitle.html(WARNING_MESSAGE_TITLE);
        $messageDescription.html('No changes are made. You are using default keys!');
    }

    function showAskingForSaveGameMessage() {
        saveNicknameAndPointsMessage(SAVE_GAME_MESSAGE_TITLE, 'Are you sure you want to save your game?');
    }

    function showGameSavedSuccessfully(text) {
        hideAllMessageComponents();
        $messageBox.show();
        $okMessageBtn.show();
        $messageTitle.html(SUCCESS_MESSAGE_TITLE);
        $messageDescription.html(text);
    }

    function showGameLost() {
        saveNicknameAndPointsMessage(LOST_GAME_MESSAGE_TITLE, 'You LOSE. Enter nickname if you want to save your score!');
    }

    function showGameWon() {
        saveNicknameAndPointsMessage(WON_GAME_MESSAGE_TITLE, 'You WIN! Enter nickname if you want to save your score!');
    }


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    function hideAllMessageComponents() {
        $('.messageBtn').hide();
        $nicknameTextField.hide();
    }

    /**
     * Shows message when the user want to save his current game or when the game is lost or won by user. The method
     * is used from methods showAskingForSaveGameMessage(), showGameLost() and showGameWon().
     * @param messageTitle - title of the message
     * @param messageDescription - description of the message
     */
    function saveNicknameAndPointsMessage(messageTitle, messageDescription) {
        hideAllMessageComponents();
        $nicknameTextField.val('').show();
        $saveGameMessageBtn.show();
        $cancelBtn.show();
        $messageBox.show();
        $messageTitle.html(messageTitle);
        $messageDescription.html(messageDescription);
    }

    return {
        showInvalidKeyMessage: showInvalidKeyMessage,
        showAvailableKeyMessage: showAvailableKeyMessage,
        showKeyIsCurrentlyInUseMessage: showKeyIsCurrentlyInUseMessage,
        showAskingForUsingDefaultKeysMessage: showAskingForUsingDefaultKeysMessage,
        showYouAreUsingDefaultKeysMessage: showYouAreUsingDefaultKeysMessage,
        showAskingForSaveGameMessage: showAskingForSaveGameMessage,
        showGameSavedSuccessfully: showGameSavedSuccessfully,
        showGameLost: showGameLost,
        showGameWon: showGameWon
    };
});