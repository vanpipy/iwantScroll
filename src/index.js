/*
 * iwantScroll
 */
(function(global, handler) {

    global.iwantScroll = handler();

})(window, function () {
    'use strict';

    function iwantScroll (options) {
        Object.assign(this, {
            el: null,
            width: 100,
            height: 300,
            innerEl: null,
            innerWidth: 400,
            innerHeight: 800,
        }, options);

        this.from = defaultXAndY();
        this.to = defaultXAndY();
        this.transition = defaultXAndY();
        this.translate = defaultXAndY();
        this.xbar = null;
        this.ybar = null;
        this.xRadio = 1;
        this.yRadio = 1;
    }

    /*
     * @param {Number} x
     * @param {Number} y
     * @param {Number} i
     * @param {Number} j
     * @return {Function}
     */
    function scale (x, y, i, j) {
        /*
         * @param {Number} start
         * @return {Number}
         */
        return function (start) {
            start >= x && start <= y ? start / y * j : -1;
        }
    }

    function debounce (fn, time) {

    }

    function defaultXAndY (x, y) {
        var newObj = Object.create(null);
        newObj.x = x ? x : 0;
        newObj.y = y ? y : 0;
        return newObj;
    }

    iwantScroll.prototype = {
        init: function () {
            this.assertTheDomIsOk();
            this.resize();
            this.createScrollbar();
            this.draggable();
        },

        assertTheDomIsOk: function () {
            if (typeof this.el == 'undefined') {
                throw 'A DOM Object needed.';
            }
        },

        resize: function () {
            this.innerEl = this.innerEl || this.el.children[0];

            var node = this.el;
            var childNode = this.innerEl;

            node.style.width = this.width + 'px';
            node.style.height = this.height + 'px';
            node.style.overflow = 'hidden';
            node.style.position = 'relative';

            childNode.style.width = this.innerWidth + 'px';
            childNode.style.height = this.innerHeight + 'px';
            childNode.style.userSelect = 'none';
        },

        draggable: function () {
            var _this = this;
            var _draggable = false;
            var target = this.innerEl;
            var xmax = this.innerWidth - 2 * this.width;
            var ymax = this.innerHeight - 2 * this.height;

            _this.translate.oldx = 0;
            _this.translate.oldy = 0;

            target.addEventListener('mousedown', function (e) {
                _this.rememberStartPoint(e.clientX, e.clientY);
                _draggable = true;
            }, false);

            target.addEventListener('mousemove', function (e) {
                if (_draggable) {
                    _this.rememberEndPoint(e.clientX, e.clientY);
                    _this.calculateTransition();
                    _this.transform(xmax, ymax);
                    _this.linkScrollbar(xmax, ymax);
                }
            }, false);

            target.addEventListener('mouseup', function (e) {
                _draggable = false;
                _this.updateTranslatePosi();
            }, false);

            target.addEventListener('mouseleave', function () {
                _draggable = false;
            }, false);
        },

        rememberStartPoint: function (x, y) {
            this.from.x = x;
            this.from.y = y;
        },

        rememberEndPoint: function (x, y) {
            this.to.x = x;
            this.to.y = y;
        },

        calculateTransition: function () {
            this.resetTransition();
            this.transition.x = this.from.x - this.to.x;
            this.transition.y = this.from.y - this.to.y;
        },

        resetTransition: function () {
            this.transition.x = 0;
            this.transition.y = 0;
        },

        fixTranslatePosi: function (xmax, ymax) {
            if (this.translate.x < 0) {
                this.translate.x = 0;
            }

            if (this.translate.x > xmax) {
                this.translate.x = xmax;
            }

            if (this.translate.y < 0) {
                this.translate.y = 0;
            }

            if (this.translate.y > ymax) {
                this.translate.y = ymax;
            }
        },

        calculateTranslatePosi: function () {
            this.translate.x = this.translate.oldx + this.transition.x;
            this.translate.y = this.translate.oldy + this.transition.y;
        },

        updateTranslatePosi: function () {
            this.translate.oldx = this.translate.x;
            this.translate.oldy = this.translate.y;
        },

        transform: function (xmax, ymax) {
            this.calculateTranslatePosi();
            this.fixTranslatePosi(xmax, ymax);

            this.innerEl.style.transform = 'translate('+ -this.translate.x + 'px,'+ -this.translate.y +'px)';
        },

        linkScrollbar: function (xmax, ymax) {
            this.xbar.style.left = (this.translate.x / xmax) * (this.width - this.xbar._width) +'px';
            this.ybar.style.top = (this.translate.y / ymax) * (this.height - this.ybar._height) +'px';
        },

        createScrollbar: function () {
            this.createXScrollbar();
            this.createYScrollbar();
        },

        createXScrollbar: function () {
            var xRadio = this.width / this.innerWidth;
            if (xRadio < 1) {
                var xbar = document.createElement('div');
                xbar._width = this.width * xRadio;
                xbar.style.width = xbar._width + 'px';
                xbar.style.height = '3px';
                xbar.style.background = 'rgba(0,0,0, .6)';
                xbar.style.position = 'absolute';
                xbar.style.left = '0';
                xbar.style.bottom = '0';

                this.el.appendChild(xbar);
                this.xbar = xbar;
                this.xRadio = xRadio;
            }
        },

        createYScrollbar: function () {
            var yRadio = this.height / this.innerHeight;
            if (yRadio < 1) {
                var ybar = document.createElement('div');
                ybar._height = this.height * yRadio;
                ybar.style.width = '3px';
                ybar.style.height = ybar._height + 'px';
                ybar.style.background = 'rgba(0,0,0, .6)';
                ybar.style.position = 'absolute';
                ybar.style.top = '0';
                ybar.style.right = '0';

                this.el.appendChild(ybar);
                this.ybar = ybar;
                this.yRadio = yRadio;
            }
        },

        attacthScrollbar: function () {
            //TODO: Activate the xbar and ybar scroll events, when mousedown triggered, recalculate the translate position by the mouse motion, deactivate it by event mouseup.
        },
    };

    return iwantScroll;
});
