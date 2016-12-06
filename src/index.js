'use strict';

(function(global, handler) {
    global.iwantScroll = handler();
})(window, function () {
    var events = {
        mouse: ['mousedown', 'mousemove', 'mouseup'],
    };

    function isFunction (x) {
        return Object.prototype.toString.call(x) === '[object Function]';
    }

    function _start (callback) {
        console.log('start');
    }

    function _processing (callback) {
        console.log('processing');
    }

    function _end (callback) {
        console.log('end');
    }

    function _startHandler (Fn) {
        return function (event) {
            var _element = this;

            if (!_element._hasMouseMove) {
                _element._hasMouseMove = true;
                addEventListener(_element, 'mousemove', _processingHandler(Fn));
            }

            if (!_element._hasMouseUp) {
                _element._hasMouseUp = true;
                addEventListener(_element, 'mouseup', _endHandler(Fn));
            }

            Fn.start();
        }
    }

    function _processingHandler (Fn) {
        return function (event) {
            Fn.processing();
        }
    }

    function _endHandler (Fn) {
        return function (event) {
            Fn.end();
        }
    }

    function _init () {
        addEventListener(this._target, 'mousedown', _startHandler(this));
    }

    function addEventListener (element, eventName, fn) {
        if (element.addEventListener) {
            element.addEventListener(eventName, fn, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, fn);
        } else {
            element[eventName] = fn;
        }
    }

    function removeEventListener (element, eventName, fn) {
        if (element.removeEventListener) {
            element.removeEventListener(eventName, fn, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + eventName, fn);
        } else {
            fn = null;
            delete element[eventName];
        }
    }

    var iwantScroll = function (element, options) {
        this._target = element;
    };

    iwantScroll.prototype = {
        init: _init,
        start: _start,
        processing: _processing,
        end: _end
    };

    return iwantScroll;
});
