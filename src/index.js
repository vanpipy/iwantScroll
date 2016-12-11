
(function(global, handler) {
    global.iwantScroll = handler(global);
})(window, function (global) {
    var callbackString = 'callback';
    var GLOBALMOVEER = '_hasMouseMove';
    var GLOBALEND = '_hasMouseUp';

    var statusSequence = ['mousedown', 'mousemove', 'mouseup'];
    var currentStatus = 0;
    var currentElement = null;
    var isHold = false;
    var currentMoveFunc = null;

    function isFunction (x) {
        return Object.prototype.toString.call(x) === '[object Function]';
    }

    function modifyStatusToNext (nextStatus) {
        currentStatus = nextStatus;
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
    }

    function _startHandler (Fn) {
        //Out of below function the start step status is always 0.
        return function (event) {
            //In fact, the start step next status will be changed to 1 successfully.
            globalMoveListener(statusSequence[currentStatus].next);
            isHold = true;

            Fn.start();
        };
    }

    function _moveHandler (Fn) {
        return function (event) {
            globalEndListener(statusSequence[currentStatus].next);

            if (isHold) {
                Fn.move();
            }
        };
    }

    function _endHandler (Fn) {
        return function (event) {
            isHold = false;

            Fn.end();
        };
    }

    function _init () {
        statusSequence = [
            _startHandler(this), 
            _moveHandler(this), 
            _endHandler(this)
        ].map(function (handler, index) {
            return {
                key: statusSequence[index],
                handler: handler,
                next: (index + 1) % statusSequence.length
            }
        });

        var beginStatus = statusSequence[0].key;
        var endStatus = statusSequence[statusSequence.length - 1].key

        addEventListener(this._target, beginStatus, statusSequence[currentStatus].handler);
        addEventListener(global, endStatus, function () {
            setTimeout(function() {
                removeMoveEvent();
                resetStatusAfterEnd();
            }, 10);
        });
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

    function removeMoveEvent () {
        removeEventListener(global, 'mousemove', currentMoveFunc);
        modifyGlobalStatus(GLOBALMOVEER, false);
    }

    function resetStatusAfterEnd () {
        var last = statusSequence[statusSequence.length - 1];
        removeEventListener(global, last.key, last.handler);
        modifyStatusToNext(last.next);
        modifyGlobalStatus(GLOBALEND, false);
    }

    function modifyGlobalStatus (statusName, status) {
        global[statusName] = status;
    }

    function getGlobalStatus (statusName) {
        return global[statusName];
    }

    function globalMoveListener (next) {
        if (!getGlobalStatus(GLOBALMOVEER)) {
            /*
             *Maybe the element draged is small and easy to lost the target,
             *So bind the event to document or window is a better way to fix it.
             */
            modifyStatusToNext(next);
            currentMoveFunc = statusSequence[next].handler;
            addEventListener(global, 'mousemove', currentMoveFunc);
            modifyGlobalStatus(GLOBALMOVEER, true);
        }
    }

    function globalEndListener (next) {
        if (!getGlobalStatus(GLOBALEND)) {
            modifyStatusToNext(next);
            addEventListener(global, 'mouseup', statusSequence[next].handler);
            modifyGlobalStatus(GLOBALEND, true);
        }
    }

    var iwantScroll = function (element, options) {
        currentElement = element;
        this._target = element;
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
