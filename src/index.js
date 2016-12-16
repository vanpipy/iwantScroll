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

        this.from = { x: 0, y: 0 };
        this.to = { x: 0, y: 0 };
        this.translate = { x: 0, y: 0 };
        this.xbar = null;
        this.ybar = null;
        this.xRadio = 1;
        this.yRadio = 1;
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
            var xmax = this.innerWidth - this.width;
            var ymax = this.innerHeight - this.height;

            target.addEventListener('mousedown', function (e) {
                _this.from.x = e.clientX;
                _this.from.y = e.clientY;
                _draggable = true;
            }, false);

            target.addEventListener('mousemove', function (e) {
                if (_draggable) {
                    _this.to.x = e.clientX;
                    _this.to.y = e.clientY;
                    _this.translate.x = _this.translate.x + _this.to.x - _this.from.x;
                    _this.translate.y = _this.translate.y + _this.to.y - _this.from.y;

                    if (_this.translate.x > 0) {
                        _this.translate.x = 0;
                    }

                    if (_this.translate.x < -xmax) {
                        _this.translate.x = -xmax;
                    }

                    if (_this.translate.y > 0) {
                        _this.translate.y = 0;
                    }

                    if (_this.translate.y < -ymax) {
                        _this.translate.y = -ymax;
                    }

                    _this.innerEl.style.transform = 'translate('+ _this.translate.x + 'px,'+ _this.translate.y +'px)';
                    _this.xbar.style.left = (-_this.translate.x / xmax) * (_this.width - _this.xbar._width) +'px';
                    _this.ybar.style.top = (-_this.translate.y / ymax) * (_this.height - _this.ybar._height) +'px';
                }
            }, false);

            target.addEventListener('mouseup', function (e) {
                _draggable = false;
            }, false);
        },

        createScrollbar: function () {
            var xRadio = this.width / this.innerWidth;
            var yRadio = this.height / this.innerHeight;

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
    };

    return iwantScroll;
});
