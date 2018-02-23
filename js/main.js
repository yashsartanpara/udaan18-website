/*========================================================================================
*   Initialization
*=========================================================================================
*/

$(document).ready(function () {
  console.info('[main.js] : Ready')
  setupCartridgeEvents()
  setupInteractionEvents()
})

/*========================================================================================
*   Setup events
*=========================================================================================
*/

function setupInteractionEvents() {
  //begin: scrolling
  $('.main').onepage_scroll({
    animationTime: 600,
    easing: 'ease-in-out',
    updateURL: true,
    loop: false,
    pagination: false,
    direction: 'horizontal',
    beforeMove: function () {
      clearCartridgeSelection(getActiveSection())
    }
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

function setupCartridgeEvents() {
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
*   ---- Constants
*===========================================
*/

var CARTRIDGE_NORMAL_Z_INDEX = 1,
  CARTRIDGE_SELECTED_Z_INDEX = 4,
  BLACKOUT_ON_Z_INDEX = 2,
  BLACKOUT_OFF_Z_INDEX = 0

/*==========================================
*   ---- Cartridge Animation
*===========================================
*/

var CARTRIDGE_TRANSITION_IN_TIME = 1,
  CARTRIDGE_TRANSITION_OUT_TIME = 0.5,
  EASE_ELASTIC = Elastic.easeOut.config(1.5, 0.5)

function selectCartridge(mouseEvent) {
  var selectedCartridge = mouseEvent.currentTarget
  if (selectedCartridge.classList.contains('cartridge--selected')) {
    return
  }
  var centerPoint = getAbsoluteCenter(selectedCartridge)
  var section = getActiveSection()

  resetAllCartridges(selectedCartridge)

  selectedCartridge.style.zIndex = CARTRIDGE_SELECTED_Z_INDEX

  TweenLite.to(selectedCartridge, CARTRIDGE_TRANSITION_IN_TIME, {
    x: centerPoint.x,
    y: centerPoint.y,
    scale: 1.2,
    ease: EASE_ELASTIC,
    onStart: changeConsoleState.bind(null, 'visible', getActiveSection())
  })
  TweenLite.to(selectedCartridge, CARTRIDGE_TRANSITION_IN_TIME / 2, {
    onComplete: function () {
      selectedCartridge.classList.add('cartridge--selected')
      selectedCartridge.addEventListener('click', insertCartridge)
    }
  })
  blackout(section)
}

function insertCartridge(mouseEvent) {
  var cartridge = mouseEvent.currentTarget
  if (!cartridge.classList.contains('cartridge--selected'))
    return
  var section = getActiveSection()
  var consoleTopView = section.querySelector('.console-top-view--top-half')
  var cartridgeClippingPercent = 0.35
  if (getMedia().indexOf('xs portrait') > -1) {
    cartridgeClippingPercent *= 1.45
  }
  var cartridgeClippingHeight = (cartridge.clientHeight) * (1 - cartridgeClippingPercent)
  var point = consoleTopView.offsetTop - cartridge.offsetTop - cartridgeClippingHeight

  var url = ''
  url = cartridge.getAttribute('data-href')

  TweenLite.to(cartridge, 0.5, {
    y: point,
    onComplete: navigateTo.bind(null, url)
  })
}

function resetAllCartridges(section, excluded) {
  var cartridges = section.querySelectorAll('.cartridge');

  [].forEach.call(cartridges, function (cartridge) {
    cartridge.removeEventListener('click', insertCartridge)
  })

  cartridges = [].filter.call(cartridges, function (cartridge) {
    cartridge.classList.remove('cartridge--selected')
    return cartridge !== excluded
  })

  TweenLite.to(cartridges, CARTRIDGE_TRANSITION_IN_TIME, {
    x: 0,
    y: 0,
    scale: 1,
    ease: EASE_ELASTIC
  });

  [].forEach.call(cartridges, function (c) {
    c.style.zIndex = CARTRIDGE_NORMAL_Z_INDEX
  })
}

function blackout(section) {
  var blackout = section.querySelector('.blackout')
  if (!blackout)
    return
  blackout.style.zIndex = BLACKOUT_ON_Z_INDEX

  TweenLite.to(blackout, CARTRIDGE_TRANSITION_IN_TIME, {
    opacity: 0.4
  })

  blackout.addEventListener('click', function onBlackout(mouseEvent) {
    clearCartridgeSelection(section)
    blackout.removeEventListener('click', onBlackout)
  })
}

function clearCartridgeSelection(section) {
  resetAllCartridges(section)
  var blackout = section.querySelector('.blackout')
  if (!blackout)
    return
  blackout.style.zIndex = BLACKOUT_OFF_Z_INDEX
  TweenLite.to(blackout, CARTRIDGE_TRANSITION_IN_TIME, {
    opacity: 0,
    onStart: changeConsoleState.bind(null, 'hidden', getActiveSection())
  })
}

function getActiveSection() {
  return document.querySelector('.section.active') || document
}

/*==========================================
*   ---- Console (Top-view) Animation
*===========================================
*/

var CONSOLE_TRANSITION_IN_TIME = 0.5,
  CONSOLE_TRANSITION_OUT_TIME = CARTRIDGE_TRANSITION_OUT_TIME

function changeConsoleState(state, section) {
  var consoleTopViewTopHalf = section.querySelector('.console-top-view--top-half')
  var consoleTopViewBottomHalf = section.querySelector('.console-top-view--bottom-half')

  switch (state) {
    case 'visible':
      TweenLite.to(consoleTopViewTopHalf, CONSOLE_TRANSITION_IN_TIME, {
        bottom: (consoleTopViewTopHalf.clientHeight),
        onStart: setConsoleState.bind(null, 'animating'),
        onComplete: setConsoleState.bind(null, 'visible')
      })
      TweenLite.to(consoleTopViewBottomHalf, CONSOLE_TRANSITION_IN_TIME, {
        bottom: 0
      })
      break
    case 'hidden':
      TweenLite.to(consoleTopViewTopHalf, CONSOLE_TRANSITION_OUT_TIME, {
        bottom: (consoleTopViewTopHalf.clientHeight * -1),
        onStart: setConsoleState.bind(null, 'animating'),
        onComplete: setConsoleState.bind(null, 'hidden')
      })
      TweenLite.to(consoleTopViewBottomHalf, CONSOLE_TRANSITION_OUT_TIME, {
        bottom: (consoleTopViewBottomHalf.clientHeight * -1 * 2)
      })
      break
  }
}

function getConsoleState() {
  var section = getActiveSection()
  var consoleTopViewTopHalf = section.querySelector(
    '.console-top-view--top-half')
  return consoleTopViewTopHalf.getAttribute('data-state')
}

function setConsoleState(state) {
  var section = getActiveSection()
  var consoleTopViewTopHalf = section.querySelector(
    '.console-top-view--top-half')
  return consoleTopViewTopHalf.setAttribute('data-state', state)
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
function backButton() {
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

function displayMessage(message) {
  var userMessageBar = document.querySelector('#user-message-bar')
  userMessageBar.innerHTML = message
  userMessageBar.style.left = getActiveSection().style.left
  TweenLite.to(userMessageBar, 1, {
    opacity: 1,
    ease: EASE_ELASTIC,
    onComplete: function () {
      TweenLite.to(userMessageBar, 0.3, {opacity: 0})
    }
  })
}

function slowDown() {
  displayMessage(getRandomInt() & 1 ? 'Hold your horses!' : 'Slow Down!')
}

function interactiveHit(callback) {
  if (!window._interativeHit) {
    window._interactiveHit = 0
  }
  window.addEventListener('click', hitEvent)
  window.addEventListener('touchstart', hitEvent)

  function hitEvent() {
    if (window._interactiveHit > 4) {
      callback()
    }
    window._interactiveHit++
  }

  setInterval(resetHits, 1000)

  function resetHits() {
    window._interactiveHit = 0
  }
}

/*==========================================
*   ---- Miscellaneous
*===========================================
*/
function getMedia() {
  return getComputedStyle(document.querySelector('.media-query')).content
}

function navigateTo(url) {
  if (url.length < 3) {
    displayMessage('GAME UNDER DEVELOPMENT!')
    return
  }
  window.location.href = url
}

/*==========================================
*   ---- Math/DateTime Functions
*===========================================
*/

function getRandomInt() {
  return Math.round(Math.random() * 100)
}

/*==========================================
*   ---- Object positioning
*===========================================
*/

function getWindowCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  }
}

function getCenter(object, relativeTo) {
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

function getAbsoluteCenter(object) {
  var screenCenter = getWindowCenter()
  var objectCenter = getCenter(object, 'document')

  var x = screenCenter.x - objectCenter.x
  var y = screenCenter.y - objectCenter.y

  return {x: x, y: y}
}
