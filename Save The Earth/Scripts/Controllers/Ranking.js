define(['underscore'], function () {
    'use strict';

    // Default ranking.
    var ranking = [{
        nickname: 'itplamen',
        points: 10000
    }, {
        nickname: 'doom_day',
        points: 5420
    }, {
        nickname: 'force14',
        points: 2650
    }, {
        nickname: 'john_j',
        points: 500
    }, {
        nickname: 'mari',
        points: 7390
    }, {
        nickname: 'ikd',
        points: 140
    }, {
        nickname: 'TNT',
        points: 2022
    }, {
        nickname: 'force',
        points: 1918
    }, {
        nickname: 'abc',
        points: 9550
    }, {
        nickname: 'joey',
        points: 4990
    }];

    initializeRanking();


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function getRanking() {
        return ranking;
    }

    /**
     * Adds nickname and points to ranking[] array and to local storage.
     * @param nickname
     * @param points
     */
    function addNicknameAndPointsToRanking(nickname, points) {
        ranking.push({
            nickname: nickname,
            points: points
        });

        localStorage.setItem(nickname, points);
    }


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    function initializeRanking() {
        var points,
            index = 0;

        if (localStorage.length === 0) {
            _.each(ranking, function (rank) {
                localStorage.setItem(rank.nickname, rank.points);
            });
        }
        else if (ranking.length < localStorage.length) {
            Object.keys(localStorage).forEach(function(nickname){
                if (!doesRankingContainNickname(nickname)) {
                    points = parseInt(localStorage.getItem(nickname), 10);
                    addNicknameAndPointsToRanking(nickname, points);
                }
            });
        }
    }

    function doesRankingContainNickname(nickname) {
        var findNickname = _.find(ranking, function (rank) {
            return rank.nickname === nickname;
        });

        if (findNickname) {
            return true;
        }

        return false;
    }

    return {
        getRanking: getRanking,
        addNicknameAndPointsToRanking: addNicknameAndPointsToRanking
    };
});