/*========================================================================================
*   Initialization
*=========================================================================================
*/

window.onload = function () {
  console.info('[main.js] : Ready');
  showCompatibilityStatus();

  if (location.hash.length > 0 || isEdge()) {
    introComplete();
    invalidateIntroScreen();
  } else {
    setupAudioController(document.querySelector('#audio-controller'));
    handleFallbacks();
    introStart();
    detectFirstStart();
  }

  window.addEventListener('orientationchange', function () {
    window.location.reload(false);
  });
};

window.onpageshow = function (event) {
  var backPages = ['#udaan-department', '#udaan-nontech'];
  for (var i = 0; i < backPages.length; i++) {
    var page = backPages[i];
    if (location.hash.indexOf(page) > -1) {
      resetAllCartridges();
      return;
    }
  }
  document.querySelector('#sound-beep').play();
};

window.unload = window.beforeunload = function () {
  // Prevent caching on some browsers
  resetAllCartridges();
};

/*========================================================================================
*   Setup events
*=========================================================================================
*/

/*==========================================
*   ---- Intro
*===========================================
*/

function introStart() {
  var arcadeSVG = placeSvgIntoDocument('#arcadeSVG');
  var arcadeScreenPlaceholder = arcadeSVG.querySelector('#arcadeScreenPlaceholder');
  window.arcadeScreenPlaceholder = arcadeScreenPlaceholder;
  arcadeScreenPlaceholder.setAttribute('opacity', 0);
  var arcadeScreen = document.querySelector('#arcadeScreen');
  fitRectBounds(arcadeScreen, arcadeScreenPlaceholder);
  var arcadeScreenBounds = arcadeScreen.getBoundingClientRect();
  var arcadeSVGBounds = arcadeSVG.getBoundingClientRect();
  var screenTextElement = arcadeScreen.querySelector('.screenText');
  fitFontToContainer(screenTextElement, 40);
  var coin = document.querySelector('#coin');
  screenTextElement.style.opacity = 0;
  var coinSlot = document.querySelector('#coin-slot');
  var coinSlotBounds = coinSlot.getBoundingClientRect();
  var introElement = document.querySelector('#intro');
  var skipIntroButton = document.querySelector('#skip-intro');

  var coinBounceTimeline = new TimelineMax({repeat: 3, yoyo: true, ease: Power0.easeNone});
  coinBounceTimeline.add(TweenMax.to(coin, 1, {top: '-=5%', scale: 1.1}));

  var coinFlashTimeline = new TimelineMax({repeat: 10, yoyo: true, ease: Power0.easeNone})
    .add(TweenMax.to(coin, 1,
      {backgroundColor: 'rgba(255, 249, 15, 0.1)'}));

  if (isSafari() || isIOS()) {
    screenTextElement.innerHTML = 'PRESS<br/>START';
    if (skipIntroButton) {
      skipIntroButton.style.display = 'none';
    }
    coin.style.display = 'none';
    arcadeScreen.addEventListener('click', animationStep2);
    arcadeSVG.addEventListener('click', animationStep2);
  } else {
    coin.addEventListener('click', animationStep1);
  }

  var arcadeTimeline = new TimelineMax({});
  arcadeTimeline.add(TweenMax.fromTo(arcadeSVG, 0.5,
    {y: '10%', opacity: 0, attr: {opacity: 0}},
    {y: '0%', opacity: 1, attr: {opacity: 1}}));
  arcadeTimeline.add(TweenMax.fromTo(coin, 1,
    {y: '10%', opacity: 0, attr: {opacity: 0}},
    {y: '0%', opacity: 1, attr: {opacity: 1}}), 0.5);
  arcadeTimeline.add(TweenMax.fromTo(arcadeScreen, 0.5,
    {y: '30%', opacity: 0},
    {y: '0%', opacity: 1}), 0);

  var textTimeline = new TimelineMax({repeat: -1, yoyo: true});
  textTimeline.add(TweenMax.fromTo(screenTextElement, 0.5,
    {opacity: 0.7, ease: Power0.easeNone},
    {opacity: 1, ease: Power0.easeNone}), 0.5);

  var coinTimeline = new TimelineMax();
  var time_step1 = 2;
  var time_coinShow = 1;

  // yoyo coin to left and zoom in
  function animationStep1() {
    document.querySelector('#sound-beep').play();
    coinBounceTimeline.kill();
    var animCoin_SlideLeft = {left: '-=20%', yoyo: true, repeat: 1};
    var animCoin_ZoomAndFlip = {scale: 7, rotationY: '360deg', ease: Back.easeOut.config(1.7)};

    var animCoin_SlideTop = {top: '+=0%', yoyo: true, repeat: 1, ease: Back.easeOut.config(1.7)};
    var animCoin_InsertIntoSlot = {
      scale: 1,
      top: coinSlotBounds.top + 'px',
      left: coinSlotBounds.left - coinSlot.width / 2 + 'px'
    };
    var animCoin_HalfFlip = {rotationY: '+=80deg'};
    var animCoin_Fade = {
      opacity: 0,
      onStart: function () {
        setTimeout(function () {
          document.querySelector('#sound-coin-insert').play();
        }, 200);
      },
      onComplete: animationStep2
    };

    coinTimeline.add(TweenMax.to(coin, time_step1 / 2, animCoin_SlideLeft), 0);
    coinTimeline.add(TweenMax.to(coin, time_step1, animCoin_ZoomAndFlip), 0);
    coinTimeline.add(TweenMax.to(coin, 0.2, animCoin_SlideTop), time_step1);
    coinTimeline.add(TweenMax.to(coin, time_coinShow, {}), time_step1);
    coinTimeline.add(TweenMax.to(coin, 1, animCoin_InsertIntoSlot), time_step1 + time_coinShow);
    coinTimeline.add(TweenMax.to(coin, 1, animCoin_HalfFlip), time_step1 + time_coinShow);
    coinTimeline.add(TweenMax.to(coin, 0.01, animCoin_Fade), time_step1 + time_coinShow + 0.9);

    coin.removeEventListener('click', animationStep1);
  }

  function animationStep2() {
    var arcadeSVGCenter = {
      top: arcadeSVGBounds.top + arcadeSVGBounds.height / 2,
      left: arcadeSVGBounds.left + arcadeSVGBounds.width / 2
    };

    var arcadeScreenCenter = {
      top: arcadeScreenBounds.top + arcadeScreenBounds.height / 2,
      left: arcadeScreenBounds.left + arcadeScreenBounds.width / 2
    };

    var diffTop = arcadeSVGCenter.top - arcadeScreenCenter.top;
    arcadeSVG.style.position = 'absolute';

    var tl = new TimelineMax();
    var h = arcadeSVGBounds.height / 2 - diffTop + 'px';

    tl.add(TweenMax.to(arcadeSVG, 1, {
      top: '+=' + diffTop + 'px'
    }));
    tl.add(TweenMax.to(arcadeScreen, 1, {
      top: '+=' + diffTop + 'px'
    }), 0);
    tl.add(TweenMax.to(arcadeSVG, 2, {
      scale: 4.5,
      transformOrigin: '50% ' + h,
      opacity: 0,
      onStart: function () {
        document.querySelector('#sound-whoosh').play();
      }
    }), 0.5);
    tl.add(TweenMax.to(arcadeScreen, 2, {
      scale: 4.5
    }), 0.5);
    tl.add(TweenMax.to(introElement, 2, {
      opacity: 0,
      onComplete: invalidateIntroScreen
    }), 0.5);
    introComplete();
  }
}

function detectFirstStart() {
  if (Cookies.get('udaan18-existing-user') === 'true') {
    var skipIntroButton = document.querySelector('#skip-intro');
    skipIntroButton.style.display = 'block';
    skipIntroButton.style.opacity = '0';
    TweenMax.to(skipIntroButton, 1.0, {delay: 2, opacity: 1});
    skipIntroButton.addEventListener('click', function skipIntroAction() {
      introComplete();
      invalidateIntroScreen();
      location.hash = 'udaan-title-page';
    });
  } else {
    Cookies.set('udaan18-existing-user', 'true', 7);
  }
}

function invalidateIntroScreen() {
  document.querySelector('#intro').style.display = 'none';
  setupTetrisAnimation();
  if (location.hash.length === 0) {
    location.hash = 'udaan-title-page';
  }
  setupAudioController(document.querySelector('#audio-controller-2'));
}

function introComplete() {
  setupCartridgeEvents();
  setupInteractionEvents();
}

function setupInteractionEvents() {
  var pager = document.querySelector('.pager');

  var yafpsPager = yafps(pager, {
    hashChange: true,
    startPage: '#udaan-title-page',
    beforeMove: function () {
      clearCartridgeSelection(getActiveSection());
      hideSocialIcons();
    },
    animationFunction: function (intent) {
      TweenMax.to(intent.target, 0.5,
        Object.assign(intent.toPercent, {onComplete: intent.callback}));
    }
  });

  SwipeListener(pager, {lockAxis: true});
  pager.addEventListener('swipe', function (e) {
    var directions = e.detail.directions;
    if (directions.left) {
      yafpsPager.animate('right');
    } else if (directions.right) {
      yafpsPager.animate('left');
    } else if (directions.top) {
      yafpsPager.animate('down');
    } else if (directions.bottom) {
      yafpsPager.animate('up');
    }
  });
  // Navigation buttons
  var buttons = document.querySelectorAll('.arrow-key');
  [].forEach.call(buttons, function (button) {
    button.addEventListener('click', function (mouseEvent) {
      var target = mouseEvent.currentTarget;
      var action = target.getAttribute('data-action');
      yafpsPager.animate(action);
    });
  });

  setupSocialMedia();
  setupDateAnimation();
  setupOtherPageLinks();
}

function setupOtherPageLinks() {
  var blocks = document.querySelectorAll('#udaan-other .block');
  [].forEach.call(blocks, function (block) {
    block.addEventListener('click', function () {
      var href = block.getAttribute('data-href');
      if(href.length > 0) {
        location.href = href;
      } else {
        displayMessage('COMING SOON!');
      }
    });
  })
}

function setupAudioController(audioControllerButton) {
  var audioControllerButtonImg = audioControllerButton.querySelector('img');
  if (audioControllerButton) {
    if (getCookieAudioConfig()) {
      turnOnAudio();
    } else {
      turnOffAudio();
    }
    audioControllerButton.addEventListener('click', onClick);
    function onClick() {
      var currentStatus = audioControllerButton.getAttribute('data-status');
      if (currentStatus === 'on') {
        turnOffAudio();
      } else {
        turnOnAudio();
        document.querySelector('#sound-beep').play();
      }
    }
  }

  function turnOffAudio() {
    setCookieAudioDisabled();
    audioControllerButtonImg.setAttribute('src', 'img/audio-off.svg');
    audioControllerButton.setAttribute('data-status', 'off');
  }

  function turnOnAudio() {
    setCookieAudioEnabled();
    audioControllerButtonImg.setAttribute('src', 'img/audio-on.svg');
    audioControllerButton.setAttribute('data-status', 'on');
  }
}

function setupDateAnimation() {
  var dateAnimTimeline = new TimelineMax({repeat: -1, yoyo: true});
  var dateElement = document.querySelector('#udaan-logo-container .udaan-date');
  var COLOR_TRANSITION_TIME = 0.3;
  dateAnimTimeline.add(TweenMax.to(dateElement, COLOR_TRANSITION_TIME, {css: {color: '#F6EF15'}}));
  dateAnimTimeline.add(TweenMax.to(dateElement, COLOR_TRANSITION_TIME, {css: {color: '#2FB64C'}}),
    COLOR_TRANSITION_TIME);
  dateAnimTimeline.add(TweenMax.to(dateElement, COLOR_TRANSITION_TIME,
    {css: {color: '#0F7DAE'}}), COLOR_TRANSITION_TIME * 2);
}

function setupCartridgeEvents() {
  var cartridges = document.querySelectorAll('.cartridge');
  [].forEach.call(cartridges, function (cartridge) {
    cartridge.addEventListener('click', selectCartridge);
  });
  interactiveHit(slowDown);
}

function setupSocialMedia() {
  var shareIcon = document.querySelector('#share-icon');
  var shareIconImg = document.querySelector('#share-icon img');
  var socialMediaIconsBar = document.querySelector('#social-icons');
  var titlePage = document.querySelector('#udaan-title-page');
  shareIcon.addEventListener('click', function () {
    if (shareIcon.getAttribute('data-status') !== 'active') {
      shareIcon.setAttribute('data-status', 'active');
      socialMediaIconsBar.classList.add('social-icons--active');
      titlePage.addEventListener('click', function ff(mouseEvent) {
        if (mouseEvent.target !== shareIcon && mouseEvent.target !== shareIconImg) {
          hideSocialIcons();
          titlePage.removeEventListener('click', ff);
        }
      });
    } else {
      hideSocialIcons();
    }
  });
}

function hideSocialIcons() {
  var shareIcon = document.querySelector('#share-icon');
  var socialMediaIconsBar = document.querySelector('#social-icons');
  var titlePage = document.querySelector('#udaan-title-page');
  shareIcon.setAttribute('data-status', 'hidden');
  socialMediaIconsBar.classList.remove('social-icons--active');
  titlePage.removeEventListener('click', hideSocialIcons);
}

/*========================================================================================
*   Animation specific functions
*=========================================================================================
*/

/*==========================================
*   ---- Constants
*===========================================
*/

var CARTRIDGE_NORMAL_Z_INDEX = 1,
  CARTRIDGE_SELECTED_Z_INDEX = 4,
  BLACKOUT_ON_Z_INDEX = 2,
  BLACKOUT_OFF_Z_INDEX = 0;

/*==========================================
*   ---- Cartridge Animation
*===========================================
*/

var CARTRIDGE_TRANSITION_IN_TIME = 1,
  CARTRIDGE_TRANSITION_OUT_TIME = 0.5,
  EASE_ELASTIC = Elastic.easeOut.config(1.5, 0.5);

function selectCartridge(mouseEvent) {
  var selectedCartridge = mouseEvent.currentTarget;
  if (selectedCartridge.classList.contains('cartridge--selected')) {
    return;
  }
  var centerPoint = getAbsoluteCenter(selectedCartridge);
  var section = getActiveSection();

  resetAllCartridges(selectedCartridge);

  selectedCartridge.style.zIndex = CARTRIDGE_SELECTED_Z_INDEX;

  document.querySelector('#sound-cartridge-fade-in').play();

  TweenMax.to(selectedCartridge, CARTRIDGE_TRANSITION_IN_TIME, {
    x: centerPoint.x,
    y: centerPoint.y,
    scale: 1.2,
    ease: EASE_ELASTIC,
    onStart: function () {
      changeConsoleState('visible', getActiveSection());
    }
  });
  TweenMax.to(selectedCartridge, CARTRIDGE_TRANSITION_IN_TIME / 2, {
    onComplete: function () {
      selectedCartridge.classList.add('cartridge--selected');
      selectedCartridge.addEventListener('click', insertCartridge);
    }
  });

  if (selectedCartridge.hasAttribute('data-info')) {
    var departmentInfo = selectedCartridge.getAttribute('data-info');
    displayInformation(departmentInfo, false);
    displayInformation('PRESS TO START', true);
  }

  blackout(section);
}

function insertCartridge(mouseEvent) {
  if (getConsoleState() !== 'visible') {
    return;
  }
  var cartridge = mouseEvent.currentTarget;
  if (!cartridge.classList.contains('cartridge--selected'))
    return;
  var section = getActiveSection();
  var consoleTopView = section.querySelector('.console-top-view--top-half');
  var cartridgeClippingPercent = 0.15;
  if (getMedia().indexOf('xs portrait') > -1) {
    cartridgeClippingPercent *= 0.95;
  }
  var cartridgeClippingHeight = (cartridge.clientHeight) * (1 - cartridgeClippingPercent);
  var point = consoleTopView.offsetTop - cartridge.offsetTop - cartridgeClippingHeight;

  var url = cartridge.getAttribute('data-href');

  document.querySelector('#sound-cartridge-insert').play();

  TweenMax.to(cartridge, 0.5, {
    y: point,
    onComplete: navigateTo.bind(null, url)
  });

  hideInformation(false, true);
}

function resetAllCartridges(section, excluded) {
  if (!section)
    return;

  var cartridges = section.querySelectorAll('.cartridge');

  [].forEach.call(cartridges, function (cartridge) {
    cartridge.removeEventListener('click', insertCartridge);
  });

  cartridges = [].filter.call(cartridges, function (cartridge) {
    cartridge.classList.remove('cartridge--selected');
    return cartridge !== excluded;
  });

  TweenMax.to(cartridges, CARTRIDGE_TRANSITION_IN_TIME, {
    x: 0,
    y: 0,
    scale: 1,
    ease: EASE_ELASTIC
  });

  [].forEach.call(cartridges, function (c) {
    c.style.zIndex = CARTRIDGE_NORMAL_Z_INDEX;
  });

  hideInformation();
}

function blackout(section) {
  var blackout = section.querySelector('.blackout');
  if (!blackout)
    return;
  blackout.style.zIndex = BLACKOUT_ON_Z_INDEX;

  TweenMax.to(blackout, CARTRIDGE_TRANSITION_IN_TIME, {opacity: 0.4});

  blackout.addEventListener('click', function onBlackout() {
    clearCartridgeSelection(section);
    document.querySelector('#sound-cartridge-fade-out').play();
    blackout.removeEventListener('click', onBlackout);
  });
}

function clearCartridgeSelection(section) {
  resetAllCartridges(section);
  var blackout = section.querySelector('.blackout');
  if (!blackout)
    return;
  blackout.style.zIndex = BLACKOUT_OFF_Z_INDEX;
  TweenMax.to(blackout, CARTRIDGE_TRANSITION_IN_TIME, {
    opacity: 0,
    onStart: changeConsoleState.bind(null, 'hidden', getActiveSection())
  });
}

function getActiveSection() {
  return document.querySelector('.page--active') || document;
}

/*==========================================
*   ---- Console (Top-view) Animation
*===========================================
*/

var CONSOLE_TRANSITION_IN_TIME = 0.5,
  CONSOLE_TRANSITION_OUT_TIME = CARTRIDGE_TRANSITION_OUT_TIME;

function changeConsoleState(state, section) {
  var consoleTopViewTopHalf = section.querySelector('.console-top-view--top-half');
  var consoleTopViewBottomHalf = section.querySelector('.console-top-view--bottom-half');

  switch (state) {
    case 'visible':
      TweenMax.to(consoleTopViewTopHalf, CONSOLE_TRANSITION_IN_TIME, {
        bottom: (consoleTopViewTopHalf.clientHeight),
        onStart: setConsoleState.bind(null, 'animating'),
        onComplete: setConsoleState.bind(null, 'visible')
      });
      TweenMax.to(consoleTopViewBottomHalf, CONSOLE_TRANSITION_IN_TIME, {
        bottom: 0
      });
      break;
    case 'hidden':
      TweenMax.to(consoleTopViewTopHalf, CONSOLE_TRANSITION_OUT_TIME, {
        bottom: (consoleTopViewTopHalf.clientHeight * -1),
        onStart: setConsoleState.bind(null, 'animating'),
        onComplete: setConsoleState.bind(null, 'hidden')
      });
      TweenMax.to(consoleTopViewBottomHalf, CONSOLE_TRANSITION_OUT_TIME, {
        bottom: (consoleTopViewBottomHalf.clientHeight * -1 * 2)
      });
      break;
  }
}

function setConsoleState(state) {
  var section = getActiveSection();
  var consoleTopViewTopHalf = section.querySelector('.console-top-view--top-half');
  if (state === 'hidden') {
    resetAllCartridges(section);
  }
  return consoleTopViewTopHalf.setAttribute('data-state', state);
}

function getConsoleState() {
  var section = getActiveSection();
  var consoleTopViewTopHalf = section.querySelector('.console-top-view--top-half');
  return consoleTopViewTopHalf.getAttribute('data-state');
}

/*==========================================
*   ---- Tetris Animation
*===========================================
*/
function setupTetrisAnimation() {
  var $cover2 = $('#cover-tetris-2').blockrain({
    autoplay: true,
    autoplayRestart: true,
    showFieldOnStart: true,
    speed: 50,
    autoBlockWidth: true,
    theme: 'candy'
  });

  var $demo = $('#tetris-demo').blockrain({
    speed: 200,
    theme: 'vim'
  });
}

/*========================================================================================
*   General functions
*=========================================================================================
*/

/*==========================================
*   ---- User Interaction
*===========================================
*/

// TODO: Complete back button handle for mobile devices
// function backButton() {}

function displayInformation(message, bottom) {
  if (bottom) {
    var informationBar2 = document.querySelector('#information-bar-2');
    informationBar2.innerHTML = message;
    informationBar2.style.left = getActiveSection().style.left;
    TweenMax.fromTo(informationBar2, 0.3, {
      opacity: 0
    }, {
      opacity: 1,
      top: '70vh'
    });
    return;
  }
  var informationBar = document.querySelector('#information-bar');
  informationBar.innerHTML = message;
  informationBar.style.left = getActiveSection().style.left;
  TweenMax.fromTo(informationBar, 0.3, {
    opacity: 0
  }, {
    opacity: 1,
    top: '14vh'
  });
}

function hideInformation(top, bottom) {
  var informationBar = document.querySelector('#information-bar');
  var informationBar2 = document.querySelector('#information-bar-2');

  if (!top && !bottom) {
    TweenMax.to(informationBar, 0.1, {
      opacity: 0,
      top: '13vh'
    });

    TweenMax.to(informationBar2, 0.1, {
      opacity: 0,
      top: '69vh'
    });
  }

  if (top) {
    TweenMax.to(informationBar, 0.1, {
      opacity: 0,
      top: '13vh'
    });
  }

  if (bottom) {
    TweenMax.to(informationBar2, 0.1, {
      opacity: 0,
      top: '69vh'
    });
  }
}

function displayMessage(message) {
  var userMessageBar = document.querySelector('#user-message-bar');
  userMessageBar.innerHTML = message;
  userMessageBar.style.left = getActiveSection().style.left;
  TweenMax.to(userMessageBar, 1, {
    opacity: 1,
    ease: EASE_ELASTIC,
    onStart: function () {
      document.querySelector('#sound-warning').play();
    },
    onComplete: function () {
      TweenMax.to(userMessageBar, 0.3, {opacity: 0});
    }
  });
}

function slowDown() {
  displayMessage(getRandomInt() & 1 ? 'Hold your horses!' : 'Slow Down!');
}

function interactiveHit(callback) {
  if (!window._interativeHit) {
    window._interactiveHit = 0;
  }
  window.addEventListener('click', hitEvent);
  window.addEventListener('touchstart', hitEvent);

  function hitEvent() {
    if (window._interactiveHit > 4) {
      callback();
    }
    window._interactiveHit++;
  }

  setInterval(resetHits, 1000);

  function resetHits() {
    window._interactiveHit = 0;
  }
}

/*==========================================
*   ---- Miscellaneous
*===========================================
*/

function isEdge() {
  return navigator.userAgent.indexOf('Edge/') > -1;
}

function isSafari() {
  return navigator.vendor.indexOf('Apple') > -1;
}

function isFirefox() {
  return navigator.userAgent.indexOf('firefox') > -1;
}

function isChrome() {
  return navigator.vendor.indexOf('Google') > -1;
}

function isMobile() {
  return (getMedia().indexOf('xs') > -1 || getMedia().indexOf('sm') > -1);
}

function isIOS() {
  return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
}

function handleFallbacks() {
  var isGoodBrowser = (isFirefox() || isChrome());
  var shouldUpgrade = !(isSafari() || isMobile() || !isGoodBrowser);
  if (shouldUpgrade) {
    var wrapper = document.querySelector('#intro .wrapper');
    wrapper.style.display = 'block';
    var wrapperSafari = document.querySelector('#intro .wrapper-safari');
    wrapperSafari.style.display = 'none';
  }
}

function showCompatibilityStatus() {
  // Only for testing
  if (isSafari()) {
    console.info('[TEST] Browser is Safari.');
  }
  if (isChrome()) {
    console.info('[TEST] Browser is Google Chrome.');
  }
  if (isFirefox()) {
    console.info('[TEST] Browser is Mozilla Firefox.');
  }
  if (isMobile()) {
    console.info('[TEST] Browser is on mobile device.');
  }
  if (isEdge()) {
    console.info('[TEST] Browser is Microsoft Edge');
  }
  if (isIOS()) {
    console.info('[TEST] Platform is iOS.');
  }
  var isGoodBrowser = (isFirefox() || isChrome());
  var shouldUpgrade = !(isSafari() || isMobile() || !isGoodBrowser);
  if (shouldUpgrade) {
    console.info('[TEST] Features are available.');
  }
  else {
    console.info('[TEST] Features are NOT available.');
  }
}

function fitFontToContainer(container, percent) {
  var containerHeight = container.clientHeight * (percent / 100);
  container.style.fontSize = containerHeight + 'px';
}

function placeSvgIntoDocument(selector) {
  var object = document.querySelector(selector);
  if (!object) {
    console.error('Couldn\'t find ', selector);
    return;
  }
  var svg = object.contentDocument.firstElementChild;
  object.parentElement.replaceChild(svg, object);
  svg.setAttribute('id', selector.slice(1));
  return svg;
}

function fitRectBounds(object, referenceObject) {
  if (!object || !referenceObject) {
    console.error('Error transferring attributes. Either object is empty.');
  }
  var boundingRect = referenceObject.getBoundingClientRect();
  object.style.width = boundingRect.width + 'px';
  object.style.height = boundingRect.height + 'px';
  object.style.left = boundingRect.left + 'px';
  object.style.top = boundingRect.top + 'px';
}

function getMedia() {
  return getComputedStyle(document.querySelector('.media-query')).content;
}

function navigateTo(url) {
  if (url.length < 3) {
    displayMessage('GAME UNDER DEVELOPMENT!');
    return;
  }
  window.location.href = url;
}

/*==========================================
*   ---- Math/DateTime Functions
*===========================================
*/

function getRandomInt() {
  return Math.round(Math.random() * 100);
}

/*==========================================
*   ---- Object positioning
*===========================================
*/

function getWindowCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    top: window.innerHeight / 2,
    left: window.innerWidth / 2
  };
}

function getCenter(object, relativeTo) {
  if (relativeTo === 'document') {
    return {
      x: object.offsetLeft + object.clientWidth / 2,
      y: object.offsetTop + object.clientHeight / 2
    };
  }
  return { // relativeTo : (0, 0)
    x: object.clientWidth / 2,
    y: object.clientHeight / 2
  };
}

function getAbsoluteCenter(object) {
  var screenCenter = getWindowCenter();
  var objectCenter = getCenter(object, 'document');

  var x = screenCenter.x - objectCenter.x;
  var y = screenCenter.y - objectCenter.y;

  return {x: x, y: y};
}
