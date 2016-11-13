define(['underscore'], function() {
    'use strict';

    // Returns a random number between min (included) and max (included).
    function getRandomNumber(min, max) {
        return _.random(min, max);
    }

    return {
        getRandomNumber: getRandomNumber
    };
});