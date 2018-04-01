/*========================================================================================
*   Other-Pages Initialization
*=========================================================================================
*/
var currentPath = location.pathname;

window.onload = function () {
  console.log(currentPath);
  if (currentPath.indexOf('udaan-nights') > -1) {
    console.info('[INFO] Udaan Nights Page');
    setupUdaanNightsPage();
  } else if (currentPath.indexOf('udaan-developers') > -1) {
    console.info('[INFO] Developers Page');
    setupUdaanDevelopersPage();
  } else if (currentPath.indexOf('udaan-team') > -1) {
    console.info('[INFO] Team Page');
    setupUdaanTeamPage();
  }
};

function setupUdaanNightsPage() {

}

function setupUdaanDevelopersPage() {
  var keywords = {
    windows: ['XAML', 'C#', 'FLUENT DESIGN', 'MVVM'],
    android: ['MATERIAL DESIGN', 'KOTLIN', 'FIREBASE'],
    backend: ['NODE', 'REST API', 'MONGO-DB', 'NPM', 'HEROKU', 'GIT', 'SWAGGER', 'EXPRESS'],
    graphics: ['COREL', 'STROKE', 'COLOR', 'FILL', 'SVG', 'PNG', 'CMYK', 'RGB'],
    dataAnalytics: ['PYTHON', 'PANDAS', 'MAP', 'REDUCE', 'FILTER', 'LAMBDA'],
    ios: ['SWIFT'],
    web: ['GSAP', 'JS', 'FLEX', 'CONSOLE', 'EVENT LISTENER', 'VUE', 'REACT', 'DOM', 'WEBPACK']
  };

  var activeSectionKeywords = keywords.web;
  var developersBlockContainer = document.querySelector('#developers-block-container');

  if (typeof window['developers'] === 'undefined') {
    console.error('Developers data is not loaded');
    return;
  }

  onDataReceived(transform(window['data-developers']));

  function onDataReceived(data) {
    for (var i = 0; i < data.length; i++) {
      var category = data[i].category;
      var members = data[i].members;
      developersBlockContainer.appendChild(newSeparator(category.toUpperCase()));
      for (var j = 0; j < members.length; j++) {
        var member = members[j];
        var memberElement = newMember({
          name: member.name.toUpperCase(),
          title: member.title.toUpperCase()
        });
        memberElement.setAttribute('data-href', member.github);
        memberElement.addEventListener('click', function (mouseEvent) {
          var target = mouseEvent.currentTarget;
          window.open(target.getAttribute('data-href'));
        });
        developersBlockContainer.appendChild(memberElement);
      }
    }
  }

  function setPositions(elements) {
    var canvas = document.querySelector('#developers .header');
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    var usedIndices = [];
    elements.map(function (element) {
      canvas.appendChild(element);
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

  function newMember(options) {
    var block = document.createElement('div');
    block.classList.add('block', 'col-lg-4', 'col-md-6', 'col-sm-6', 'col-xs-12');

    var blockContent = document.createElement('div');
    blockContent.classList.add('block-content');

    var fill = document.createElement('div');
    fill.classList.add('fill');

    fill.innerText = options.name;

    var blockSubText = document.createElement('div');
    blockSubText.classList.add('block-sub-text');
    blockSubText.innerText = options.title;

    fill.appendChild(blockSubText);
    blockContent.appendChild(fill);
    block.appendChild(blockContent);

    return block;
  }

  function newSeparator(name) {
    var separatorElement = document.createElement('div');
    separatorElement.classList.add('block-seperator');
    separatorElement.innerText = name;
    return separatorElement;
  }

  function transform(data) {
    var categoryList = {};
    data.map(function (member) {
      if (!categoryList[member.category]) {
        categoryList[member.category] = {category: member.category, members: []};
      }
      categoryList[member.category].members.push(member);
    });
    return Object.values(categoryList);
  }
}

function setupUdaanTeamPage() {
  var teamBlockContainer = document.querySelector('.team-block-container');
  var coreTeamBlockContainer = document.querySelector('.coreTeam-block-container');

  if (typeof window['data-team-udaan'] === 'undefined') {
    console.error('Team Udaan data is not loaded');
    return;
  }

  onDataReceived(window['data-team-udaan']);

  function jsonFriendlyName(name) {
    return name.toLowerCase().trim().split(' ').join('-');
  }

  function onDataReceived(data) {
    var teamImagesDir = '/img/team/';
    for (var i = 0; i < data.length; i++) {
      var category = data[i].category;
      var members = data[i].members;
      for (var j = 0; j < members.length; j++) {
        var member = members[j];
        member.image = member.image || ((member.title.toUpperCase() === "HEAD" || category.indexOf('ore') > -1) ? jsonFriendlyName(member.name) + '.jpg' : undefined);
        var memberElement = newMember({
          name: member.name.toUpperCase(),
          title: category + ' ' + member.title,
          large: i < 2,
          image: member.image ? teamImagesDir + member.image : ''
        });
        if (member.title === 'Head' || member.title === "") {
          teamBlockContainer.appendChild(memberElement);
          if (i === 1) {
            var separatorElement = newSeparator();
            teamBlockContainer.appendChild(separatorElement);
          }
        }
        else {
          coreTeamBlockContainer.appendChild(memberElement);
          if (i === 1) {
            coreTeamBlockContainer.appendChild(separatorElement);
          }
        }

      }
    }
  }

  function newMember(options) {
    var block = document.createElement('div');
    if (options.large) {
      block.classList.add('team-block', 'col-lg-3', 'col-md-4', 'col-sm-4', 'col-xs-12');
    } else {
      block.classList.add('team-block', 'col-lg-3', 'col-md-3', 'col-sm-3', 'col-xs-6');
    }
    var blockContent = document.createElement('div');
    blockContent.classList.add('team-block-content');

    var fill = document.createElement('div');
    fill.classList.add('fill');

    if (options.large) {
      fill.classList.add('fill-large');
    }

    if (options.image) {
      var imgContainer = document.createElement('div');
      imgContainer.classList.add('team-block-image');
      var img = document.createElement('img');
      img.setAttribute('src', options.image);

      imgContainer.appendChild(img);
      fill.appendChild(imgContainer);
    }

    var teamBlockText = document.createElement('div');
    teamBlockText.classList.add('team-block-text');
    teamBlockText.innerText = options.name;

    var teamBlockSubText = document.createElement('div');
    teamBlockSubText.classList.add('team-block-sub-text');
    teamBlockSubText.innerText = options.title;
    teamBlockText.appendChild(teamBlockSubText);

    fill.appendChild(teamBlockText);
    blockContent.appendChild(fill);
    block.appendChild(blockContent);
    return block;
  }

  function newSeparator() {
    var separatorElement = document.createElement('div');
    separatorElement.classList.add('team-block-seperator');
    return separatorElement;
  }

}
