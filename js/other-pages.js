/*========================================================================================
*   Other-Pages Initialization
*=========================================================================================
*/
var currentPath = location.pathname.slice(1, location.pathname.lastIndexOf('.'));

window.onload = function () {
  console.log(currentPath);
  switch (currentPath) {
    case 'udaan-nights':
      console.info('[INFO] Udaan Nights Page');
      setupUdaanNightsPage();
      break;
    case 'developers':
      console.info('[INFO] Developers Page');
      setupDevelopersPage();
      break;
  }
};

function setupUdaanNightsPage() {

}

function setupDevelopersPage() {
  var keywords = {
    windows: ['XAML', 'C#', 'FLUENT DESIGN', 'MVVM'],
    android: ['MATERIAL DESIGN', 'KOTLIN', 'FIREBASE'],
    backend: ['NODE', 'REST API', 'MONGO-DB', 'NPM', 'HEROKU', 'GIT', 'SWAGGER', 'EXPRESS'],
    graphics: ['COREL', 'STROKE', 'COLOR', 'FILL', 'SVG', 'PNG', 'CMYK', 'RGB'],
    dataAnalytics: ['PYTHON', 'PANDAS', 'MAP', 'REDUCE', 'FILTER', 'LAMBDA'],
    ios: ['SWIFT'],
    web: ['GSAP', 'JS', 'FLEX', 'CONSOLE', 'EVENT LISTENER', 'VUE', 'REACT', 'DOM', 'WEBPACK']
  };

  var constants = {
    MAX_WORDS_PER_UNIT_TIME: 5,
    POSITIONS: [{"x": 0.0234375, "y": 0.11458333333333333}, {"x": 0.075, "y": 0.14583333333333334}, {
      "x": 0.04296875,
      "y": 0.4270833333333333
    }, {"x": 0.1421875, "y": 0.6458333333333334}, {"x": 0.24140625, "y": 0.16319444444444445}, {
      "x": 0.32421875,
      "y": 0.78125
    }, {"x": 0.39765625, "y": 0.25}, {"x": 0.50234375, "y": 0.11458333333333333}, {
      "x": 0.56328125,
      "y": 0.6979166666666666
    }, {"x": 0.63828125, "y": 0.25}, {"x": 0.68359375, "y": 0.5520833333333334}, {
      "x": 0.76328125,
      "y": 0.20833333333333334
    }, {"x": 0.8265625, "y": 0.6180555555555556}, {"x": 0.8578125, "y": 0.2743055555555556}, {
      "x": 0.88828125,
      "y": 0.4166666666666667
    }, {"x": 0.79765625, "y": 0.4722222222222222}, {"x": 0.7171875, "y": 0.2638888888888889}, {
      "x": 0.678125,
      "y": 0.4097222222222222
    }]
  };

  var activeSectionKeywords = keywords.web;
  var elements = generateElements(activeSectionKeywords);
  setPositions(elements);

  var header = document.querySelector('#developers .header');
  var headerWidth = header.clientWidth;
  var headerHeight = header.clientHeight;
  var seed = getRandomInt(0, constants.POSITIONS.length - 1);
  var tl = new TimelineMax({repeat: -1});
  tl.add(TweenMax.staggerFromTo(elements, 0.5, {
    opacity: 0, top: "+=16px"
  }, {
    opacity: 1, top: "-=16px"
  }, 0));
  tl.add(TweenMax.staggerTo(elements, 0.5, {
    opacity: 0, top: "-=16px"
  }, 0.5), 0);

  function setPositions(elements) {
    var canvas = document.querySelector('#developers .header');
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    var usedIndices = [];
    elements.map(function (element) {
      canvas.appendChild(element);
      var elementWidth = element.clientWidth;
      var elementHeight = element.clientHeight;
      var randomIndex = getRandomInt(0, constants.POSITIONS.length - 1);
      while (usedIndices.indexOf(randomIndex) !== -1) {
        randomIndex = getRandomInt(0, constants.POSITIONS.length - 1);
      }
      usedIndices.push(randomIndex);
      var position = constants.POSITIONS[randomIndex];
      element.style.left = (position.x * width) + 'px';
      element.style.top = (position.y * height) + 'px';
    });
  }

  function generateElements(keywords) {
    var elements = [];
    keywords.map(function (keyword) {
      var keywordElement = document.createElement('div');
      keywordElement.classList.add('keyword');
      keywordElement.innerText = keyword;
      elements.push(keywordElement);
    });
    return elements;
  }

  function getRandomInt(min, max) {
    min = min || 0;
    max = max || 100;
    return min + Math.round(Math.random() * max);
  }
}
