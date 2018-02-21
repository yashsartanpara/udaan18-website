/*========================================================================================
*   Initialization
*=========================================================================================
*/

var JQDoc = $(document)

JQDoc.ready(function () {
  console.info('[main.js] : Ready')
  setupCartridgeEvents()
  setupInteractionEvents()
})

/*========================================================================================
*   Setup events
*=========================================================================================
*/

function setupInteractionEvents () {
  //begin: scrolling
  $('.main').onepage_scroll({
    animationTime: 600,
    easing: 'ease-in-out',
    updateURL: true,
    loop: false,
    pagination: false,
    direction: 'horizontal',
    beforeMove: clearCartridgeSelection
  })
  $(document).keydown(function (e) {
    if (e.keyCode == 37) {
      $('.main').moveUp()
      return false
    }
    if (e.keyCode == 39) {
      $('.main').moveDown()
      return false
    }
  })
  //end : scrolling

  //begin: hammer swipe events
  var hammer = new Hammer.Manager(document.getElementById('swipe-window'))
  var swipe = new Hammer.Swipe()
  hammer.add(swipe)
  hammer.on('swipeleft', function () {
    $('.main').moveDown()
  })
  hammer.on('swiperight', function () {
    $('.main').moveUp()
  })
  //end: hammer swipe events
  $('.next-page').click(function () {
    $('.main').moveDown()
  })
}

function setupCartridgeEvents () {
  var cartridges = document.querySelectorAll('.cartridge');
  [].forEach.call(cartridges, function (cartridge) {
    cartridge.addEventListener('click', selectCartridge)
  })
  interactiveHit(slowDown)
}

/*========================================================================================
*   Animation specific functions
*=========================================================================================
*/

/*==========================================
*   ---- Cartridge Animation
*===========================================
*/

var CARTRIDGE_TRANSITION_IN_TIME = 1,
  CARTRIDGE_TRANSITION_OUT_TIME = 0.5,
  CARTRIDGE_TRANSITION_EASE = Elastic.easeOut.config(1.5, 0.5)

function selectCartridge (mouseEvent) {
  var selectedCartridge = mouseEvent.currentTarget
  var centerPoint = getAbsoluteCenter(selectedCartridge)

  resetAllCartridges(selectedCartridge)

  selectedCartridge.style.zIndex = 3

  TweenLite.to(selectedCartridge, CARTRIDGE_TRANSITION_IN_TIME, {
    x: centerPoint.x,
    y: centerPoint.y,
    scale: 1.2,
    ease: CARTRIDGE_TRANSITION_EASE,
    onStart: changeConsoleState.bind(null, 'visible')
  })

  blackout()
}

function resetAllCartridges (excluded) {
  var cartridges = document.querySelectorAll('.cartridge')
  cartridges = [].filter.call(cartridges, function (cartridge) {
    return cartridge !== excluded
  })

  TweenLite.to(cartridges, CARTRIDGE_TRANSITION_OUT_TIME, {
    x: 0,
    y: 0,
    scale: 1,
    ease: CARTRIDGE_TRANSITION_EASE
  });

  [].forEach.call(cartridges, function (c) {
    c.style.zIndex = 1
  })
}

function blackout() {
  var blackout = document.querySelector('.blackout')
  blackout.style.zIndex = 2

  TweenLite.to(blackout, CARTRIDGE_TRANSITION_IN_TIME, {
    opacity: 0.4
  })

  blackout.addEventListener('click', function onBlackout (mouseEvent) {
    clearCartridgeSelection();
    blackout.removeEventListener('click', onBlackout)
  })
}

function clearCartridgeSelection() {
  resetAllCartridges()
  var blackout = document.querySelector('.blackout')
  blackout.style.zIndex = 0
  TweenLite.to(blackout, CARTRIDGE_TRANSITION_IN_TIME, {
    opacity: 0,
    onStart: changeConsoleState.bind(null, 'hidden')
  })
}

/*==========================================
*   ---- Console (Top-view) Animation
*===========================================
*/

var CONSOLE_TRANSITION_IN_TIME = 0.5,
  CONSOLE_TRANSITION_OUT_TIME = CARTRIDGE_TRANSITION_OUT_TIME,
  CONSOLE_TRANSITION_EASE = CARTRIDGE_TRANSITION_EASE

function changeConsoleState (state) {
  var consoleContainerTopView = document.querySelector(
    '.console-container--top-view')
  switch (state) {
    case 'visible':
      TweenLite.to(consoleContainerTopView, CONSOLE_TRANSITION_IN_TIME, {
        bottom: 0,
        onStart: setConsoleState.bind(null, 'animating'),
        onComplete: setConsoleState.bind(null, 'visible')
      })
      break
    case 'hidden':
      TweenLite.to(consoleContainerTopView, CONSOLE_TRANSITION_OUT_TIME, {
        bottom: (consoleContainerTopView.clientHeight * -1),
        onStart: setConsoleState.bind(null, 'animating'),
        onComplete: setConsoleState.bind(null, 'hidden')
      })
      break
  }
}

function getConsoleState () {
  var consoleContainerTopView = document.querySelector(
    '.console-container--top-view')
  return consoleContainerTopView.getAttribute('data-state')
}

function setConsoleState (state) {
  var consoleContainerTopView = document.querySelector(
    '.console-container--top-view')
  return consoleContainerTopView.setAttribute('data-state', state)
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
function backButton () {
  if (typeof history.pushState === 'function') {
    history.pushState('jibberish', null, null)
    window.onpopstate = function () {
      history.pushState('newjibberish', null, null)
      // Handle the back (or forward) buttons here
      // Will NOT handle refresh, use onbeforeunload for this.
    }
  }
  else {
    var ignoreHashChange = true
    window.onhashchange = function () {
      if (!ignoreHashChange) {
        ignoreHashChange = true
        window.location.hash = Math.random()
        // Detect and redirect change here
        // Works in older FF and IE9
        // * it does mess with your hash symbol (anchor?) pound sign
        // delimiter on the end of the URL
      }
      else {
        ignoreHashChange = false
      }
    }
  }
}

function displayMessage (message) {
  var userMessageBar = document.querySelector('#user-message-bar')
  userMessageBar.innerHTML = message
  TweenLite.to(userMessageBar, 1, {
    opacity: 1,
    ease: CARTRIDGE_TRANSITION_EASE,
    onComplete: function () {
      TweenLite.to(userMessageBar, 0.3, {opacity: 0})
    }
  })
}

function slowDown () {
  displayMessage(getRandomInt() & 1 ? 'Hold your horses!' : 'Slow Down!')
}

function interactiveHit (callback) {
  if (!window._interativeHit) {
    window._interactiveHit = 0
  }
  window.addEventListener('click', hitEvent)
  window.addEventListener('touchstart', hitEvent)

  function hitEvent () {
    if (window._interactiveHit > 4) {
      callback()
    }
    window._interactiveHit++
  }

  setInterval(resetHits, 1000)

  function resetHits () {
    window._interactiveHit = 0
  }
}

/*==========================================
*   ---- Math/DateTime Functions
*===========================================
*/

function getRandomInt () {
  return Math.round(Math.random() * 100)
}

/*==========================================
*   ---- Object positioning
*===========================================
*/

function getWindowCenter () {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  }
}

function getCenter (object, relativeTo) {
  if (relativeTo === 'document') {
    return {
      x: object.offsetLeft + object.clientWidth / 2,
      y: object.offsetTop + object.clientHeight / 2
    }
  }
  return { // relativeTo : (0, 0)
    x: object.clientWidth / 2,
    y: object.clientHeight / 2
  }
}

function getAbsoluteCenter (object) {
  var screenCenter = getWindowCenter()
  var objectCenter = getCenter(object, 'document')

  var x = screenCenter.x - objectCenter.x
  var y = screenCenter.y - objectCenter.y

  return {x: x, y: y}
}

