/*========================================================================================
*   Other-Pages Initialization
*=========================================================================================
*/
var currentPath = location.pathname.slice(1, location.pathname.lastIndexOf('.'));

window.onload = function () {
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
  var windowsKeywords = [
    'XAML', 'C#', 'FLUENT DESIGN', 'MVVM', ''
  ];
  var webKeywords = [
    'GSAP', 'JS', 'FLEX', 'CONSOLE', 'EVENT LISTENER', 'VUE', 'REACT', 'DOM', 'WEBPACK'
  ];
  var androidKeywords = [
    'MATERIAL DESIGN', 'KOTLIN', 'FIREBASE'
  ];
  var backendKeywords = [
    'NODE', 'REST API', 'MONGO-DB', 'NPM', 'HEROKU', 'GIT', 'SWAGGER', 'EXPRESS'
  ];
  var dataAnalyticsKeywords = [
    'PYTHON', 'PANDAS', 'MAP', 'REDUCE', 'FILTER', 'LAMBDA'
  ];
  var graphicsKeywords = [
    'COREL', 'STROKE', 'COLOR', 'FILL', 'SVG', 'PNG', 'CMYK', 'RGB'
  ];
  var iosKeywords = [
    'SWIFT'
  ];

  var constants = {
    MAX_WORDS_PER_UNIT_TIME: 5
  };

  var activeSectionKeywords = windowsKeywords;
  var wordCache = [];

  for(var i = 0; i < constants.MAX_WORDS_PER_UNIT_TIME; i++) {
    wordCache.push(activeSectionKeywords[i]);
  }

  var wordCloudTimeline = new TimelineMax({});


  function generateElements(keywords) {
    var elements = [];
    keywords.map(function (keyword) {
      var keywordElement = document.createElement('.keyword');
      keywordElement.innerText = keyword;
      elements.push(keyword);
    });
  }

  function getRandomInt(min, max) {
    min = min || 0;
    max = max || 100;
    return min + Math.round(Math.random() * max);
  }

}
