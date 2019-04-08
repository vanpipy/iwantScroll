(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.iwantScroll = factory());
}(this, function () { 'use strict';

    class Gesture {
      constructor() {
        this.name = 'gesture';
      }

    }

    class IwantScroll {
      constructor() {
        this.gesture = new Gesture();
      }

    }

    return IwantScroll;

}));
