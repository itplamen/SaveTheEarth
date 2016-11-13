(function () {
    'use strict';

    require.config({
        waitSeconds : 30,
        baseUrl: './Scripts',
        paths: {
            'jquery': 'Libraries/jquery-2.1.3.min',
            'underscore': 'Libraries/underscore',
            'Actions': 'Helper/Actions',
            'Keys': 'Helper/Keys',
            'GlobalConstants': 'Helper/GlobalConstants',
            'RandomGenerator': 'Helper/RandomGenerator',
            'AudioPlayer': 'Controllers/AudioPlayer',
            'InfoBoard': 'Modules/InfoBoard',
            'DrawManager': 'Controllers/DrawManager',
            'MoveManager': 'Controllers/MoveManager',
            'Background': 'Modules/Background',
            'TextInfo': 'Modules/TextInfo',
            'Bonus': 'Modules/Bonus',
            'Ammunition': 'Modules/Ammunition',
            'Spaceship': 'Modules/Spaceship',
            'Asteroid': 'Modules/Asteroid',
            'GameEngine': 'Controllers/GameEngine',
            'Ranking': 'Controllers/Ranking',
            'Menu': 'Controllers/Menu',
            'SelectSpaceship': 'Controllers/SelectSpaceship',
            'GameLoader': 'Controllers/GameLoader',
            'Message': 'Modules/Message',
            'AmmunitionType': 'Modules/AmmunitionType'
        }
    });

    require(['AudioPlayer', 'Menu'], function (AudioPlayer, Menu) {
        AudioPlayer.playMenuBackgroundMusic();
        AudioPlayer.audioPlayerControllers();

        Menu.loadMenu();
    });
}());