var JQDoc = $(document);
JQDoc.ready(function () {
    //begin: scrolling
    $(".main").onepage_scroll({
        animationTime: 600,
        easing: 'ease-in-out',
        updateURL: true,
        loop: false,
        pagination: false,
        direction: "horizontal"
    });
    $(document).keydown(function (e) {
        if (e.keyCode == 37) {
            $(".main").moveUp();
            return false;
        }
        if (e.keyCode == 39) {
            $(".main").moveDown();
            return false;
        }
    });
    //end : scrolling

    //begin: hammer swipe events
    var hammer = new Hammer.Manager(document.getElementById('swipe-window'));
    var swipe = new Hammer.Swipe();
    hammer.add(swipe);
    hammer.on('swipeleft', function () {
        $(".main").moveDown();
    });
    hammer.on('swiperight', function () {
        $(".main").moveUp();
    });
    //end: hammer swipe events
    $('.next-page').click(function () {
        $(".main").moveDown();
    })
});