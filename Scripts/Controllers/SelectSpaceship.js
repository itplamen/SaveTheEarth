define(['GlobalConstants', 'jquery'], function (GlobalConstants, $) {
    'use strict';

    var $container = $('#Container'),
        $leftArrow = $('#LeftArrow'),
        $rightArrow = $('#RightArrow'),
        spaceshipSliderImg = [],
        sliderIndex = 0;


    /* -------------------- PUBLIC FUNCTIONS -------------------- */

    function showSlider() {
        sliderIndex = 0;
        showSpaceshipAndFeatures();
        checkWhenToShowArrows();
    }

    function setSelectedSpaceship() {
        GlobalConstants.SELECTED_SPACESHIP = GlobalConstants.spaceships[sliderIndex];
    }


    /* -------------------- PRIVATE FUNCTIONS -------------------- */

    function showSpaceshipAndFeatures() {
        if (sliderIndex < 0 || sliderIndex >= GlobalConstants.spaceships.length) {
            throw new RangeError('Slider index is out of the range [0 - ' + GlobalConstants.spaceships.length - 1 + ']!')
        }

        $('#SpaceshipName').html(GlobalConstants.spaceships[sliderIndex].name);

        // Shows features
        $('#SpeedCurrentProgress').css('width', GlobalConstants.spaceships[sliderIndex].speed + '%');
        $('#SpeedPercentages').html(GlobalConstants.spaceships[sliderIndex].speed + '%');
        $('#DamageCurrentProgress').css('width', GlobalConstants.spaceships[sliderIndex].damage + '%');
        $('#DamagePercentages').html(GlobalConstants.spaceships[sliderIndex].damage + '%');
        $('#StrengthCurrentProgress').css('width', GlobalConstants.spaceships[sliderIndex].strength + '%');
        $('#StrengthPercentages').html(GlobalConstants.spaceships[sliderIndex].strength + '%');
        $('#SpecialAbility').html(GlobalConstants.spaceships[sliderIndex].specialAbility);
        $('#SpecialAbilityCurrentProgress').css('width', '100%');
        $('#SpecialAbilityPercentages').html('100%');

        // Shows current spaceship
        $container.css('background', 'url("' + GlobalConstants.spaceships[sliderIndex].imgSrc + '") no-repeat center');
    }

    function checkWhenToShowArrows() {
        if (sliderIndex === 0) {
            $leftArrow.hide();
            $rightArrow.show();
        }
        else if (sliderIndex === GlobalConstants.spaceships.length - 1) {
            $rightArrow.hide();
            $leftArrow.show();
        }
        else {
            $leftArrow.show();
            $rightArrow.show();
        }
    }


    /* -------------------- EVENTS -------------------- */

    $leftArrow.on('click', function () {
        sliderIndex -= 1;
        showSpaceshipAndFeatures();
        checkWhenToShowArrows();
    });

    $rightArrow.on('click', function () {
        sliderIndex += 1;
        showSpaceshipAndFeatures();
        checkWhenToShowArrows();
    });

    return {
        showSlider: showSlider,
        setSelectedSpaceship: setSelectedSpaceship
    };
});