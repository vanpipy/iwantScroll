
(function(global, Handler) {
    var elem = document.getElementById('demo');
    var handler = new Handler({
        el: elem,
    });

    handler.init();
})(window, window.iwantScroll);
