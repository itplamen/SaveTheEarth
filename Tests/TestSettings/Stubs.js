define(['sinon', 'jquery'], function (sinon, $) {
    'use strict';

    function initializeAllStubs() {
        var canvas = document.createElement('canvas'),
            fakeContext = {},
            fakeJQuery = {};

        sinon.stub(canvas, 'getContext').withArgs('2d').returns(fakeContext);
        sinon.stub(document, 'getElementById').withArgs('CanvasContainer').returns(canvas);
        sinon.stub($).returns({});
     }

    return {
        initializeAllStubs: initializeAllStubs
    };
});