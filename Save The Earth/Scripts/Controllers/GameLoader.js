define(['jquery'], function ($) {
    'use strict';

    var allCookies = document.cookie,
        allSavedGames = getSavedGames(),
        cookieName = 'savedGame-';


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    /**
     * Gets the ID of the last saved game (cookie), if there are any. The method is used, so that the ID of the
     * new saved game can be determined.
     * @returns {number} the ID of the last saved game increased by one or returns 1 if there are no saved
     * games. The returned value will be the ID of the new saved game!!!
     */
    function getLastSavedGameID() {
        if (allSavedGames.length > 0) {
            // Get the last element (last saved game) from the allSavedGames[], because it will have the
            // largest ID.
            return allSavedGames[allSavedGames.length - 1].id + 1;
        }

        // There are no cookies (saved games)!
        return 1;
    }

    /**
     * Deletes saved game from the allSavedGames[] array and also deletes the cookie for the concrete game.
     * @param savedGameID - the ID of the saved game.
     */
    function deleteSavedGame(savedGameID) {
        var savedGameIndex = -1;

        $(allSavedGames).each(function (index) {
            if (allSavedGames[index].id === savedGameID) {
                savedGameIndex = index;
                return false; // Break the loop.
            }
        });

        if (savedGameIndex === -1) {
            alert('There is no such saved game!');
        }
        else {
            allSavedGames.splice(savedGameIndex, 1);
            document.cookie = 'savedGame-' + savedGameID + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
        }
    }


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    /**
     * Gets the all saved games (by using cookies), if there are any.
     * @returns {Array} all saved games
     */
    function getSavedGames() {
        var splitCookiesArray,
            parsedCookieValue,
            savedGames = [];

        if (allCookies.length > 0) {
            splitCookiesArray = allCookies.split('; ');

            $(splitCookiesArray).each(function (index) {
                // When the splitCookiesArray is split, the .split() method returns new array with
                // two elements - the name of the saved game (for example 'savedGame-4') and the object with
                // information about the given saved game. This object can be taken with .split('=')[1] and
                // then needs to be parsed and pushed in the savedGames[] array.
                parsedCookieValue = JSON.parse(splitCookiesArray[index].split('=')[1]);
                savedGames.push(parsedCookieValue);
            });
        }

        return savedGames;
    }

    return {
        getLastSavedGameID: getLastSavedGameID,
        deleteSavedGame: deleteSavedGame,
        allSavedGames: allSavedGames
    };
});