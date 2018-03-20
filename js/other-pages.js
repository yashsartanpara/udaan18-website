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
  var data = transform(developersData());
  console.log(data);
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

  function developersData() {
    return [
      {
        "title": "Web Developer",
        "color": "",
        "category": "web",
        "name": "Vatsal Trivedi",
        "mobile": "+917600635053",
        "email": "trivedivatsal005@gmail.com",
        "github": "https://github.com/vattytrivedi"
      },
      {
        "title": "Web Developer",
        "color": "",
        "category": "web",
        "name": "Yash Sartanpara",
        "mobile": "+919724052113",
        "email": "yash@captaintorch.tech",
        "github": "https://captaintorch.tech"
      },
      {
        "title": "Web Developer",
        "color": "",
        "category": "web",
        "name": "Siddharth Goswami",
        "mobile": "+919723461024",
        "email": "_@siddharth.xyz",
        "github": "https://github.com/sidx1024"
      },
      {
        "title": "Back-End Developer",
        "color": "",
        "category": "backend",
        "name": "Chintan Acharya",
        "mobile": "+918140474055",
        "email": "acharya.chintan96@gmail.com",
        "github": "https://github.com/chintanacharya"
      },
      {
        "title": "UWP Developer",
        "color": "",
        "category": "windows",
        "name": "Darshan Dalal",
        "mobile": "+918460157727",
        "email": "darshandalal3@outlook.com",
        "github": "https://github.com/darshan010"
      },
      {
        "title": "Android Developer",
        "color": "",
        "category": "unity",
        "name": "Jay Patel",
        "mobile": "+919374883988",
        "email": "jp9573@gmail.com",
        "github": "https://github.com/jp9573"
      },
      {
        "title": "Web Developer",
        "color": "",
        "category": "web",
        "name": "Megharth Lakhataria",
        "mobile": "+919429000091",
        "email": "m.c.lakhataria@gmail.com",
        "github": "https://github.com/megharth"
      },
      {
        "title": "Python Developer",
        "color": "",
        "category": "ai",
        "name": "Pranshu Dave",
        "mobile": "+918238330100",
        "email": "pranshudave@gmail.com",
        "github": "https://github.com/pranshu0210"
      },
      {
        "title": "Back-End Developer",
        "color": "",
        "category": "backend",
        "name": "Rushi Rami",
        "mobile": "+917069307537",
        "email": "",
        "github": "https://github.com/rushi7997"
      },
      {
        "title": "Back-End Developer",
        "color": "",
        "category": "backend",
        "name": "Jay Movaliya",
        "mobile": "+918160762644",
        "email": "jaymovaliya786@gmail.com",
        "github": "https://github.com/jaymovaliya"
      },
      {
        "title": "Android Developer",
        "color": "",
        "category": "android",
        "name": "Bhagyesh Radiya",
        "mobile": "+918141435149",
        "email": "",
        "github": "https://github.com/BhagyeshRadiya2796"
      },
      {
        "title": "Android Developer",
        "color": "",
        "category": "android",
        "name": "Abhi Akbari",
        "mobile": "+919909214688",
        "email": "abhiakbari023@gmail.com",
        "github": "https://github.com/abhi055"
      },
      {
        "title": "iOS Developer",
        "color": "",
        "category": "ios",
        "name": "Jay Vaghani",
        "mobile": "+919909834387",
        "email": "jvaghani971@gmail.com",
        "github": "https://github.com/jayvaghani"
      },
      {
        "title": "Android Developer",
        "color": "",
        "category": "android",
        "name": "Pranav Gajera",
        "mobile": "+91",
        "email": "",
        "github": "https://github.com/prnv28"
      }
    ]
  }
}

function setupUdaanTeamPage() {
  var teamBlockContainer = document.querySelector('.team-block-container');

  var data = teamData();
  for (var i = 0; i < data.length; i++) {
    var category = data[i].category;
    var members = data[i].members;
    for (var j = 0; j < members.length; j++) {
      var member = members[j];
      var memberElement = newMember({
        name: member.name.toUpperCase(),
        title: category + ' ' + member.title,
        large: i < 2,
        image: ''
      });
      teamBlockContainer.appendChild(memberElement);
      if (i === 1) {
        var separatorElement = newSeparator();
        teamBlockContainer.appendChild(separatorElement);
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

  function teamData() {
    return [
      {
        'category': 'General Secretary',
        'members': [
          {
            'name': 'Jatan Patel',
            'title': ''
          }
        ]
      },
      {
        'category': 'Ladies Representative',
        'members': [
          {
            'name': 'Megha Patel',
            'title': ''
          }
        ]
      },
      {
        'category': 'Tech',
        'members': [
          {
            'name': 'Harshil Jani',
            'title': 'Head'
          },
          {
            'name': 'Umang Patel',
            'title': 'Head'
          },
          {
            'name': 'Pradeep Dodiya',
            'title': 'Head'
          },
          {
            'name': 'Megh Shah',
            'title': 'Head'
          }
        ]
      },
      {
        'category': 'Publicity',
        'members': [
          {
            'name': 'Anshul Thacker',
            'title': 'Head'
          },
          {
            'name': 'Rejoice Paracal',
            'title': 'Head'
          }
        ]
      },
      {
        'category': 'Documentation',
        'members': [
          {
            'name': 'Shreyansh Aghera',
            'title': 'Head'
          },
          {
            'name': 'Udit Patel',
            'title': 'Head'
          }
        ]
      },
      {
        'category': 'Logistics',
        'members': [
          {
            'name': 'Harsh Vora',
            'title': 'Head'
          },
          {
            'name': 'Hiren Thakkar',
            'title': 'Head'
          }
        ]
      },
      {
        'category': 'Decoration',
        'members': [
          {
            'name': 'Hardik Shilu',
            'title': 'Head'
          }
        ]
      },
      {
        'category': 'Developers',
        'members': [
          {
            'name': 'Vatsal Trivedi',
            'title': 'Head'
          },
          {
            'name': 'Chintan Acharya',
            'title': 'Head'
          }
        ]
      },
      {
        'category': 'Graphics',
        'members': [
          {
            'name': 'Tushar Gonavala',
            'title': 'Head'
          }
        ]
      },
      {
        'category': 'Discipline',
        'members': [
          {
            'name': 'King Tandel',
            'title': 'Head'
          },
          {
            'name': 'Manan Shah',
            'title': 'Head'
          },
          {
            'name': 'Dharam Patel',
            'title': 'Head'
          }
        ]
      },
      {
        'category': 'Photography',
        'members': [
          {
            'name': 'Punit Suthar',
            'title': 'Head'
          },
          {
            'name': 'Vivek Bariya',
            'title': 'Head'
          }
        ]
      },
      {
        'category': 'Cultural',
        'members': [
          {
            'name': 'Kishan Patel',
            'title': 'Head'
          },
          {
            'name': 'Meet Pachchigar',
            'title': 'Head'
          }
        ]
      },
      {
        'category': 'Sponsorship',
        'members': [
          {
            'name': 'Deep Lakkad',
            'title': 'Head'
          },
          {
            'name': 'Vatsal Rami',
            'title': 'Head'
          }
        ]
      }
    ];
  }
}
