
(function(global, Handler) {
    var elem = document.getElementById('1');
    var handler = new Handler(elem);

    handler.start(function() {
        console.log('Custom start function');
    });
    handler.processing(function() {
        console.log('Custom processing function');
    });
    handler.end(function() {
        console.log('Custom end function');
    });
    handler.init();
})(window, window.iwantScroll);
