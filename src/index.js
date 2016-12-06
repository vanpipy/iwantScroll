'use strict';

(function(global, handler) {
    global.iwantScroll = handler();
})(window, function () {
    //start, processing, end.
    var iwantScroll = function() {};
    var events = ['mousedown', 'mousemove', 'mouseup'];

    function isFunction (x) {
        return Object.prototype.toString.call(x) === '[object Function]';
    }

    function _start (callback) {
        if (isFunction(callback)) {
            callback();
        }
        console.log('start');
    }

    function _processing (callback) {
        if (isFunction(callback)) {
            callback();
        }
        console.log('processing');
    }

    function _end (callback) {
        if (isFunction(callback)) {
            callback();
        }
        console.log('end');
    }

    function _detection (event) {
        workflow[ events.indexOf(event.type) ]();
    }

    function addEventLister (element, eventName, fn) {
        if (element.addEventListener) {
            element.addEventListener(eventName, fn, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, fn);
        } else {
            element[eventName] = fn;
        }
    }

    function removeEventLister (element, eventName, fn) {
        if (element.removeEventListener) {
            element.removeEventListener(eventName, fn, false);
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
        addEventLister(element, 'mouseup', _detection);
    };

    iwantScroll.prototype = {
        start: _start,
        processing: _processing,
        end: _end
    };

    return iwantScroll;
});
