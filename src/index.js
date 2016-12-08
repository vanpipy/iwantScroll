
(function(global, handler) {
    global.iwantScroll = handler(global);
})(window, function (global) {
    //All elements which scroll event binded cache here.
    var scrollElementCollections = [];

    //Element under scrolling is only one when scrolling.
    var activeScrollElement = [];

    var statusSequence = ['start', 'move', 'end'];
    var callbackString = 'callback';

    var GLOBALMOVEER = '_hasMouseMove';
    var GLOBALEND = '_hasMouseUp';

    function appendActiveScroll (object) {
        activeScrollElement[0] = object;
    }

    function getActiveScroll () {
        return activeScrollElement[0] || {};
    }

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

    function _move () {
        isFunction(this['move' + callbackString]) ? this['move' + callbackString]() : 0;
        console.log('move');
    }

    function _end () {
        isFunction(this['end' + callbackString]) ? this['end' + callbackString]() : 0;
        console.log('end');

        removeMoveEvent(this._target, getActiveScroll().fn);
    }

    function _startHandler (Fn) {
        Fn._move_function = _moveHandler(Fn);

        return function (event) {
            var currentElement = this;

            globalMoveListener(Fn, currentElement);
            globalEndListener(Fn);

            Fn.start();
        };
    }

    function _moveHandler (Fn) {
        return function (event) {
            Fn.move();
        };
    }

    function _endHandler (Fn) {
        return function (event) {
            Fn.end();
        };
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

    function removeMoveEvent (currentElement, currentFunc) {
        removeEventListener(global, 'mousemove', getActiveScroll().fn);
        modifyGlobalStatus(GLOBALMOVEER, false);
    }

    function modifyGlobalStatus (statusName, status) {
        global[statusName] = status;
    }

    function getGlobalStatus (statusName) {
        return global[statusName];
    }

    function globalMoveListener (currentFunc, currentElement) {
        if (!getGlobalStatus(GLOBALMOVEER)) {
            /*
             *Maybe the element draged is small and easy to lost the target,
             *So bind the event to document or window is a better way to fix it.
             */
            var _handler = _moveHandler(currentFunc);
            addEventListener(global, 'mousemove', _handler);
            modifyGlobalStatus(GLOBALMOVEER, true);
            appendActiveScroll({
                elem: currentElement,
                fn: _handler
            });
        }
    }

    function globalEndListener (currentFunc) {
        if (!getGlobalStatus(GLOBALEND)) {
            addEventListener(global, 'mouseup', _endHandler(currentFunc));
            modifyGlobalStatus(GLOBALEND, true);
        }
    }

    var iwantScroll = function (element, options) {
        this._target = element;

        scrollElementCollections.push(element);
    };

    iwantScroll.prototype = {
        init: _init,
        bind: _bind,
        start: _start,
        move: _move,
        end: _end
    };

    return iwantScroll;
});
