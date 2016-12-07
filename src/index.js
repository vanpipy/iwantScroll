'use strict';

(function(global, handler) {
    global.iwantScroll = handler(global);
})(window, function (global) {
    var events = {
        mouse: ['mousedown', 'mousemove', 'mouseup'],
    };
    var statusSequence = ['start', 'processing', 'end'];
    var callbackString = 'callback';

    function isFunction (x) {
        return Object.prototype.toString.call(x) === '[object Function]';
    }

    //Supply a way to bind different function to mouse action.
    function _bind (statusName, callback) {
        this[statusName + callbackString] = callback;
    }

    function _start () {
        isFunction(this['start' + callbackString]) ? this['start' + callbackString]() : 0;
        console.log('start');
    }

    function _processing (callback) {
        isFunction(this['processing' + callbackString]) ? this['processing' + callbackString]() : 0;
        console.log('processing');
    }

    function _end (callback) {
        isFunction(this['end' + callbackString]) ? this['end' + callbackString]() : 0;
        console.log('end');

        removeMoveEvent(this._target, this);
    }

    function _startHandler (Fn) {
        Fn._processing_function = _processingHandler(Fn);

        return function (event) {
            var currentElement = this;

            if (!currentElement._hasMouseMove) {
                currentElement._hasMouseMove = true;

                /*
                 *Maybe the element draged is small and easy to lost the target,
                 *So bind the event to document or window is a better way to fix it.
                 */
                addEventListener(global, 'mousemove', Fn._processing_function);
            }

            if (!currentElement._hasMouseUp) {
                currentElement._hasMouseUp = true;
                addEventListener(global, 'mouseup', _endHandler(Fn));
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

    function removeMoveEvent (currentElement, currentFunc) {
        removeEventListener(global, 'mousemove', currentFunc._processing_function);
        currentElement._hasMouseMove = false;
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
        bind: _bind,
        start: _start,
        processing: _processing,
        end: _end
    };

    return iwantScroll;
});
