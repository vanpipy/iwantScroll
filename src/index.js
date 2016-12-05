'use strict';

(function(global, handler) {

})(window, function () {
    //start, processing, end.
    var iwantScroll = function() {};
    var events ['mousedown', 'mousemove', 'mouseup'];

    function _start () {
        
    }

    function _processing () {
        
    }

    function _end () {
        
    }

    function _detection (event) {

    }

    function addEventLister (element, eventName, fn) {
        if (element.addEventLister) {
            element.addEventLister(eventName, fn, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, fn);
        } else {
            element[eventName] = fn;
        }
    }

    function removeEventLister (element, eventName, fn) {
        if (element.removeEventLister) {
            element.removeEventLister(eventName, fn, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + eventName, fn);
        } else {
            fn = null;
            delete element[eventName];
        }
    }

    var workflow = [_start, _processing, _end];

    iwantScroll = function (element, options) {
        addEventLister(element, 'mousedown', _detection);
        addEventLister(element, 'mousemove', _detection);
        addEventLister(element, 'mouseup', _detection):
    }

    iwantScroll.prototype = {
        start: _start,
        processing: _processing,
        end: _end
    }

    return iwantScroll;
});
