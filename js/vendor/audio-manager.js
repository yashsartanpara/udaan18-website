var audioRepository = [];

function registerInteraction() {
  audioRepository.forEach(function (audio) {
    audio.promise = audio.element.play().then(function () {
      audio.element.pause();
      unmuteElement(audio.element);
    });

  });
}

function registerAudioById(id) {
  var element = document.querySelector('#' + id);
  if (!element) {
    console.error('Cannot register audio element:', id);
  }
  if (!searchAudio(id)) {
    audioRepository.push({id: id, element: element, promise: 0});
  }
}

function registerAudio(element) {
  if (element.hasAttribute('id')) {
    var elementId = element.getAttribute('id');
    registerAudioById(elementId);
  } else {
    console.error('Cannot register audio element (missing id): ', element);
  }
}

function registerAllAudioElements(avoidClear) {
  if (!avoidClear) {
    clearRepository();
  }
  var audioElements = document.querySelectorAll('audio');
  audioElements.forEach(registerAudio);
}

function searchAudio(id) {
  return audioRepository.find(function (r) {
    return r.id === id;
  });
}

function muteElement(element) {
  if (element) {
    element.muted = true;
  }
}

function unmuteElement(element) {
  if (element) {
    element.muted = false;
  }
}

function playAudio(id) {
  var audio = searchAudio(id);
  if (audio) {
    audio.element.play();
  } else {
    console.error(id, 'element is not registered');
  }
}

function clearRepository() {
  audioRepository = [];
}

function muteAllAudio() {
  var audioElements = document.querySelectorAll('audio');
  audioElements.forEach(muteElement);
}

function unmuteAllAudio() {
  var audioElements = document.querySelectorAll('audio');
  audioElements.forEach(unmuteElement);
}

function checkCookiesLibrary() {
  if (!Cookies) {
    console.error('js.cookie.js is not loaded');
    return false;
  }
  return true;
}

function setCookieAudioEnabled() {
  unmuteAllAudio();
  if (checkCookiesLibrary()) {
    Cookies.set('udaan18-audio-enabled', 'true', 7);
  }
}

function setCookieAudioDisabled() {
  muteAllAudio();
  if (checkCookiesLibrary()) {
    Cookies.set('udaan18-audio-enabled', 'false', 7);
  }
}

function getCookieAudioConfig() {
  if (checkCookiesLibrary()) {
    return Cookies.get('udaan18-audio-enabled') === 'true';
  }
  return false;
}

if (document) {
  document.addEventListener('visibilitychange', function () {
    if (!document.visibilityState) {
      muteAllAudio();
      return;
    }
    switch (document.visibilityState) {
      case 'hidden':
        muteAllAudio();
        break;
      case 'visible':
        if (getCookieAudioConfig()) {
          unmuteAllAudio();
        }
        break;
    }
  });
  window.addEventListener('load', function () {
    if (getCookieAudioConfig()) {
      registerAllAudioElements();
      window.addEventListener('click', function firstInteraction() {
        window.removeEventListener('click', firstInteraction);
        registerInteraction();
      });
    }
  });
} else {
  console.error('audio-manager.js should be included in \<body\> element.');
}
