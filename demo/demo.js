
(function(global, Handler) {
    var elem = document.getElementById('1');
    var handler = new Handler(elem);

    handler.bind('start', function() {
        console.log('Custom start function');
    });
    handler.bind('processing', function() {
        console.log('Custom processing function');
    });
    handler.bind('end', function() {
        console.log('Custom end function');
    });
    handler.init();
})(window, window.iwantScroll);
