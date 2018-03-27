// Avoid `console` errors in browsers that lack a console.
(function () {
  var method;
  var noop = function () {
  };
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

(function (window, document) {

  function Shake() {

    //feature detect
    this.hasDeviceMotion = 'ondevicemotion' in window;

    //default velocity threshold for shake to register
    this.threshold = 15;

    //use date to prevent multiple shakes firing
    this.lastTime = new Date();

    //accelerometer values
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;

    //create custom event
    if (typeof document.CustomEvent === "function") {
      this.event = new document.CustomEvent('shake', {
        bubbles: true,
        cancelable: true
      });
    } else if (typeof document.createEvent === "function") {
      this.event = document.createEvent('Event');
      this.event.initEvent('shake', true, true);
    } else {
      return false;
    }
  }

  //reset timer values
  Shake.prototype.reset = function () {
    this.lastTime = new Date();
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;
  };

  //start listening for devicemotion
  Shake.prototype.start = function () {
    this.reset();
    if (this.hasDeviceMotion) {
      window.addEventListener('devicemotion', this, false);
    }
  };

  //stop listening for devicemotion
  Shake.prototype.stop = function () {

    if (this.hasDeviceMotion) {
      window.removeEventListener('devicemotion', this, false);
    }
    this.reset();
  };

  //calculates if shake did occur
  Shake.prototype.devicemotion = function (e) {

    var current = e.accelerationIncludingGravity,
      currentTime,
      timeDifference,
      deltaX = 0,
      deltaY = 0,
      deltaZ = 0;

    if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
      this.lastX = current.x;
      this.lastY = current.y;
      this.lastZ = current.z;
      return;
    }

    deltaX = Math.abs(this.lastX - current.x);
    deltaY = Math.abs(this.lastY - current.y);
    deltaZ = Math.abs(this.lastZ - current.z);

    if (((deltaX > this.threshold) && (deltaY > this.threshold)) || ((deltaX > this.threshold) && (deltaZ > this.threshold)) || ((deltaY > this.threshold) && (deltaZ > this.threshold))) {
      //calculate time in milliseconds since last shake registered
      currentTime = new Date();
      timeDifference = currentTime.getTime() - this.lastTime.getTime();

      if (timeDifference > 1000) {
        window.dispatchEvent(this.event);
        this.lastTime = new Date();
      }
    }

    this.lastX = current.x;
    this.lastY = current.y;
    this.lastZ = current.z;

  };

  //event handler
  Shake.prototype.handleEvent = function (e) {

    if (typeof (this[e.type]) === 'function') {
      return this[e.type](e);
    }
  };

  //create a new instance of shake.js.
  var myShakeEvent = new Shake();
  myShakeEvent && myShakeEvent.start();

}(window, document));
;var app = app || {};
app.emeraldHill = (function () {
  'use strict';

  var getOffsetResult,
    getOffsetResultY,
    direction,
    speedClass = '',
    jumping,
    boredClock,
    $container = $('#container');

  var getOffset = function (e) {


    var $outputEl = $('#position'),
      $offsetElem = $('#center');

    // for debug box
    $('#input-type').text(e.type);

    // determine whether mouse or touch
    if (e.type === 'touchmove') {
      var e = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    }

    getOffsetResultY = Math.floor(( e.pageY - ( $offsetElem.offset().top ) ) / window.innerHeight * 100);


    $outputEl.text(
      ' x ' + Math.floor((e.pageX - ( $offsetElem.offset().left ) ) / window.innerWidth * 100)
      + ' y ' + getOffsetResultY
    )

    return Math.floor((e.pageX - $offsetElem.offset().left ) / window.innerWidth * 100);
  };

  var sonic = function () {

    var stopSpeed = 5,
      slowSpeed = 15,
      mediumSpeed = 28,
      fastSpeed = 35;
    bored();

    // trigger jump function
    $(document).on('mousedown', function (e) {
      // don't jump if we hit the buttons or the panels
      if (e.target.tagName !== 'DIV') return;

      app.emeraldHill.jump();
    });

    // shake triggers jump
    window.addEventListener('shake', function () {
      app.emeraldHill.jump();
    });

  };

  var background = function () {

    var $backgroundLayers = $('.background-wrapper');

    // initiate all background elements at 0
    var skySpd = 0,
      mntHighSpd = 0,
      mntLowSpd = 0,
      tile1spd = 0,
      tile2spd = 0,
      tile3spd = 0,
      tile4spd = 0,
      tile5spd = 0,
      platformSpd = 0,
      scroller;

    var setBackgroundSpeeds = function () {

      // do not move bg if we're below sonic animation threshold
      if (Math.abs(getOffsetResult) < 5) return;


      platformSpd -= (getOffsetResult / 10) * 1.65;
      $('.platform-wrapper').css({
        'transform': 'translate3d(' + platformSpd + 'px,0,0)'
      });

      skySpd -= (getOffsetResult / 10) * 0.1;
      $backgroundLayers.find('.sky-wrapper').css({
        '-webkit-transform': 'translate3d(' + skySpd + 'px,0,0)'
      });

      mntHighSpd -= (getOffsetResult / 10) * 0.3;
      $backgroundLayers.find('.mountains').css({
        'transform': 'translate3d(' + mntHighSpd + 'px,0,0)'
      });

      mntLowSpd -= (getOffsetResult / 10) * 0.35;
      $backgroundLayers.find('.mountains-lower').css({
        'transform': 'translate3d(' + mntLowSpd + 'px,0,0)'
      });

      tile1spd -= (getOffsetResult / 10) * 0.7;
      $backgroundLayers.find('.tile-1').css({
        'transform': 'translate3d(' + tile1spd + 'px,0,0)'
      });

      tile2spd -= (getOffsetResult / 10) * 0.9;
      $backgroundLayers.find('.tile-2').css({
        'transform': 'translate3d(' + tile2spd + 'px,0,0)'
      });

      tile3spd -= (getOffsetResult / 10) * 1.1;
      $backgroundLayers.find('.tile-3').css({
        'transform': 'translate3d(' + tile3spd + 'px,0,0)'
      });

      tile4spd -= (getOffsetResult / 10) * 1.3;
      $backgroundLayers.find('.tile-4').css({
        'transform': 'translate3d(' + tile4spd + 'px,0,0)'
      });
      /*
                    tile5spd -= (getOffsetResult / 10) * 1.2;

                  $backgroundLayers.find('.tile-5').css({
                      'transform': 'translate3d(' + tile5spd + 'px,0,0)'
                    });*/

    }

    // request animation frame loop
    // https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/

    var touched = false;
    var running;

    function animLoop(render, element) {
      var lastFrame = +new Date;

      function loop(now) {
        // stop the loop if render returned false
        if (running !== false) {
          requestAnimationFrame(loop, element);
          running = render(now - lastFrame);
          lastFrame = now;
        }
      }

      loop(lastFrame);
    }


    $(document).on('mousemove touchmove', function () {

      // prevent this function running on every single movement of the cursor/touch
      if (touched) return;

      touched = true;
      running = true;

      animLoop(function () {
        setBackgroundSpeeds();
      });

    }).on('touchend mouseleave', function (e) {

      // reset all values
      // if jumping, wait a sec, otherwise sonic will return to normal running state mid-air

      if (jumping) {
        setTimeout(function () {

          speedClass = '';
          $container.removeClass();
        }, 600);
      } else {
        speedClass = '';
        $container.removeClass();
      }

      touched = false;
      running = false;
      bored();
      getOffsetResultY = 0;

    });

  };

  var jump = function () {

    var jumpTime = 425,
      $sonicWrapper = $('.sonic-wrapper');

    var jumpUpAnimation = function () {


      if (jumping) return;

      // remove bored animation first
      $container.attr('data-bored', false);
      clearTimeout(boredClock);

      jumping = true;

      $container.attr('class', 'jumping');

      $sonicWrapper.addClass('going-up').removeClass('going-down');

      // hold in the air before descent
      setTimeout(function () {
        jumpDownAnimation();
      }, jumpTime);

    };

    var jumpDownAnimation = function () {
      $sonicWrapper.addClass('going-down').removeClass('going-up');

      // descent time before returning to normal state
      setTimeout(function () {
        $container.attr('class', speedClass);
        $sonicWrapper.removeClass('going-down');
        jumping = false;
      }, jumpTime);

    };

    return {
      jump: jumpUpAnimation()
    }

  };

  var bored = function () {

    // wait 8000 ms before initiating the bored animation

    boredClock = setTimeout(function () {

      $container.attr('data-bored', true);

    }, 8000)

  };


  var panels = function () {

    var panelVisible = false,
      $infoPanel = $('#info-panel');

    $('#info-toggle').on('click', function () {

      if (panelVisible) {
        $infoPanel.hide();
        panelVisible = false;
      } else {
        $infoPanel.show();
        panelVisible = true;
      }

    })

    // hide panels on click

    $('.panel').on('click', function () {
      $(this).hide();
      panelVisible = false;
    });

    // cheats

    console.log('Remember the level select code?');

    var keys = [],
      cheatCode = '49,57,54,53,57,49,55',
      cheatCodeNumpad = '97,105,102,101,105,97,103',
      comboMap = [],
      comboDown = [],
      perspective = false;


    $(document).keydown(function (e) {

      keys.push(e.keyCode);

      if (keys.toString().indexOf(cheatCode) >= 0 || keys.toString().indexOf(cheatCodeNumpad) >= 0) {


        //$('body').addClass('perspective');
        $('#debug').show();

        // reset the code
        keys = [];

        console.log('Debug box active!')

      }


      if (!comboMap[e.keyCode]) {
        comboDown.push(e.keyCode);
        if (comboDown[0] === 65 && comboDown[1] === 13) {

          if (perspective) {
            $('body').addClass('perspective');
            perspective = false;
            console.log('Perspective mode active!')


          } else {
            $('body').removeClass('perspective');
            perspective = true;
          }

          // reset the combo
          comboMap = [];
          comboDown = [];

        }
      }
      comboMap[e.keyCode] = true;

    }).keyup(function (e) {
      comboMap[e.keyCode] = false;
      comboDown.length = 0;
    });

  };


  return {
    sonic: sonic,
    background: background,
    jump: jump,
    bored: bored,
    panels: panels
  };

}());
;$(function () {
  'use strict';

  // in 2014 everyone was doing it this way
  app.emeraldHill.sonic();
  app.emeraldHill.background();
  app.emeraldHill.bored();
  app.emeraldHill.panels();

});
