define(['Actions'], function (Actions) {
    'use strict';

    var VALID_SPECIAL_KEYS = {
            space: {
                key: 'Space',
                code: 32
            },
            leftArrow: {
                key: 'Left Arrow',
                code: 37
            },
            upArrow: {
                key: 'Up Arrow',
                code: 38
            },
            rightArrow: {
                key: 'Right Arrow',
                code: 39
            },
            downArrow: {
                key: 'Down Arrow',
                code: 40
            },
            numpadZero: {
                key: 'Numpad 0',
                code: 96
            },
            numpadOne: {
                key: 'Numbpad 1',
                code: 97
            },
            numpadTwo: {
                key: 'Numpad 2',
                code: 98
            },
            numpadThree: {
                key: 'Numpad 3',
                code: 99
            },
            numpadFour: {
                key: 'Numpad 4',
                code: 100
            },
            numpadFive: {
                key: 'Numpad 5',
                code: 101
            },
            numpadSix: {
                key: 'Numpad 6',
                code: 102
            },
            numpadSeven: {
                key: 'Numpad 7',
                code: 103
            },
            numpadEight: {
                key: 'Numpad 8',
                code: 104
            },
            numpadNine: {
                key: 'Numpad 9',
                code: 105
            },
            multiply: {
                key: '*',
                code: 106
            },
            add: {
                key: '+',
                code: 107
            },
            subtract: {
                key: '-',
                code: 109
            },
            decimalPoint: {
                key: '.',
                code: 110
            },
            divide: {
                key: '/',
                code: 111
            },
            semicolon: {
                key: ';',
                code: 186
            },
            equal: {
                key: '=',
                code: 187
            },
            comma: {
                key: ',',
                code: 188
            },
            dash: {
                key: '-',
                code: 189
            },
            period: {
                key: '.',
                code: 190
            },
            forwardSlash: {
                key: '/',
                code: 191
            },
            openBracket: {
                key: '[',
                code: 219
            },
            backSlash: {
                key: '\\',
                code: 220
            },
            closeBracket: {
                key: ']',
                code: 221
            }
        },
        INVALID_KEYS = [{
            key: 'Backspace',
            code: 8
        }, {
            key: 'Tab',
            code: 9
        }, {
            key: 'Enter',
            code: 13
        }, {
            key: 'Shift',
            code: 16
        }, {
            key: 'Ctrl',
            code: 17
        }, {
            key: 'Alt',
            code: 18
        }, {
            key: 'Pause/Break',
            code: 19
        }, {
            key: 'Caps Lock',
            code: 20
        }, {
            key: 'Esc',
            code: 27
        }, {
            key: 'Page Up',
            code: 33
        }, {
            key: 'Page Down',
            code: 34
        }, {
            key: 'End',
            code: 35
        }, {
            key: 'Home',
            code: 36
        }, {
            key: 'Insert',
            code: 45
        }, {
            key: 'Delete',
            code: 46
        }, {
            key: 'Left Windows',
            code: 91
        }, {
            key: 'Right Window',
            code: 92
        }, {
            key: 'Select Key',
            code: 93
        }, {
            key: '/',
            code: 111
        }, {
            key: 'F1',
            code: 112
        }, {
            key: 'F2',
            code: 113
        }, {
            key: 'F3',
            code: 114
        }, {
            key: 'F4',
            code: 115
        }, {
            key: 'F5',
            code: 116
        }, {
            key: 'F6',
            code: 117
        }, {
            key: 'F7',
            code: 118
        }, {
            key: 'F8',
            code: 119
        }, {
            key: 'F9',
            code: 120
        }, {
            key: 'F10',
            code: 121
        }, {
            key: 'F11',
            code: 122
        }, {
            key: 'F12',
            code: 123
        }, {
            key: 'Num Lock',
            code: 144
        }, {
            key: 'Scroll Lock',
            code: 145
        }],
        playerKeys = getDefaultKeys();

    /**
     * For some game actions, like 'Move Up' or 'Move Down', the player has two options (two keys)!
     * @returns {Array} SHALLOW COPY (by using .slice() method) of the array with default keys.
     */
    function getDefaultKeys() {
        return [{
            firstKey: VALID_SPECIAL_KEYS.upArrow.key,
            secondKey: 'W',
            firstKeyCode: VALID_SPECIAL_KEYS.upArrow.code,
            secondKeyCode: 87
        }, {
            firstKey: VALID_SPECIAL_KEYS.downArrow.key,
            secondKey: 'S',
            firstKeyCode: VALID_SPECIAL_KEYS.downArrow.code,
            secondKeyCode: 83
        }, {
            firstKey: VALID_SPECIAL_KEYS.leftArrow.key,
            secondKey: 'A',
            firstKeyCode: VALID_SPECIAL_KEYS.leftArrow.code,
            secondKeyCode: 65
        }, {
            firstKey: VALID_SPECIAL_KEYS.rightArrow.key,
            secondKey: 'D',
            firstKeyCode: VALID_SPECIAL_KEYS.rightArrow.code,
            secondKeyCode: 68
        }, {
            firstKey: VALID_SPECIAL_KEYS.space.key,
            firstKeyCode: VALID_SPECIAL_KEYS.space.code
        }, {
            firstKey: 'Q',
            firstKeyCode: 81
        }, {
            firstKey: 'E',
            firstKeyCode: 69
        }, {
            firstKey: 'R',
            firstKeyCode: 82
        }].slice();
    }

    function saveChangedKey(action, key, code) {
        var index = Actions.PLAYER_GAME_ACTIONS.indexOf(action);

        if (index < 0) {
            throw new Error('Invalid action!');
        }

        playerKeys[index] = {
            firstKey: key,
            firstKeyCode: code
        };
    }

    /**
     * Restores keys to default.
     */
    function useDefaultKeys() {
        playerKeys = getDefaultKeys();
    }

    function getPlayerKeys() {
        return playerKeys;
    }

    return {
        VALID_SPECIAL_KEYS: VALID_SPECIAL_KEYS,
        INVALID_KEYS: INVALID_KEYS,
        saveChangedKey: saveChangedKey,
        useDefaultKeys: useDefaultKeys,
        getPlayerKeys: getPlayerKeys
    };
});