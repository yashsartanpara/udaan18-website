'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var yafps = function yafps(pager, options) {
  if (!pager) return;

  var defaultOpts = {
    hashChange: false,
    beforeMove: false,
    animationFunction: false,
    startPage: false
  };

  // Set options
  if (!options) {
    options = {};
  }
  options = _extends({}, defaultOpts, options);

  var pagesContainerClass = '.pages-container';
  var pageClass = 'page';
  var pageActiveClass = 'page--active';
  var pageDisabledClass = 'page-disabled';
  var orderAttributeName = 'data-order';
  //
  var pagesContainer = pager.querySelector(pagesContainerClass);
  var pages = Array.from(pagesContainer.querySelectorAll('.' + pageClass));
  var maxRows = 0,
      maxColumns = 0;
  var activePosition = { x: 0, y: 0 };
  var acceptEvents = true;

  function findPositionInMatrix(id) {
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        var p = matrix[i][j];
        if (p && p.hasAttribute('id') && p.getAttribute('id') === id) {
          return { x: j, y: i };
        }
      }
    }
    return false;
  }

  function moveToPage(id) {
    if (id && id.length > 1) {
      if (id[0] === '#') {
        id = id.slice(1);
      }
    }
    var position = findPositionInMatrix(id);
    if (position) {
      matrix[activePosition.y][activePosition.x].classList.remove(pageActiveClass);
      matrix[position.y][position.x].classList.add(pageActiveClass);
      activePosition = position;
      _updateView();
    }
  }

  function _enableEvents() {
    acceptEvents = true;
  }

  function _disableEvents() {
    acceptEvents = false;
  }

  pages.forEach(function (page) {
    var order = _getPageOrder(page);
    maxRows = Math.max(order.r, maxRows);
    maxColumns = Math.max(order.c, maxColumns);
  });

  var matrix = [];
  for (var m = 0; m < maxRows; m++) {
    var array = new Array(maxColumns);
    matrix.push(array.fill(false));
  }

  pages.forEach(function (page) {
    var order = _getPageOrder(page);
    matrix[order.r - 1][order.c - 1] = page;
  });

  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      if (!matrix[i][j]) {
        var emptyPage = document.createElement('div');
        emptyPage.classList.add(pageClass, pageDisabledClass);
        matrix[i][j] = emptyPage;
        pagesContainer.appendChild(emptyPage);
      }
      matrix[i][j].style.order = 1 + i * maxColumns + j;
      matrix[i][j].setAttribute(orderAttributeName, i + '-' + j);
      matrix[i][j].style.flexBasis = 100 / maxColumns + '%';
      matrix[i][j].style.width = 100 / maxColumns + '%';
      matrix[i][j].style.height = 100 / maxRows + '%';
    }
  }

  function _getPageOrder(page) {
    if (!page.hasAttribute(orderAttributeName)) {
      if (maxRows < 1) {
        maxRows = 1;
      }
      if (maxColumns < 1) {
        maxColumns = 1;
      }
      return { r: maxRows++ - 1, c: maxColumns++ - 1 };
    }
    var order = page.getAttribute(orderAttributeName).split('-');
    return { r: Number(order[0]), c: Number(order[1]) };
  }

  function _canMove(direction) {
    var p = activePosition;
    switch (direction) {
      case 'left':
        return p.x - 1 > -1 && _isEnabled(matrix[p.y][p.x - 1]);
      case 'right':
        return p.x + 1 < maxColumns && _isEnabled(matrix[p.y][p.x + 1]);
      case 'up':
        return p.y - 1 > -1 && _isEnabled(matrix[p.y - 1][p.x]);
      case 'down':
        return p.y + 1 < maxRows && _isEnabled(matrix[p.y + 1][p.x]);
    }
    return false;
  }

  function _updateView() {
    pagesContainer.style.left = _toPercent(activePosition.x);
    pagesContainer.style.top = _toPercent(activePosition.y);
  }

  function _toPercent(value) {
    return value * -100 + '%';
  }

  function _isEnabled(page) {
    return !page.classList.contains(pageDisabledClass);
  }

  function _handleKeyboardEvent(event) {
    if (!acceptEvents) return false;
    switch (event.which) {
      case 37:
        return animate('left');
      case 38:
        return animate('up');
      case 39:
        return animate('right');
      case 40:
        return animate('down');
    }
    return false;
  }

  function move(direction, animate) {
    var prevPosition = { x: activePosition.x, y: activePosition.y };
    if (_canMove(direction)) {
      switch (direction) {
        case 'left':
          activePosition.x -= 1;
          break;
        case 'right':
          activePosition.x += 1;
          break;
        case 'up':
          activePosition.y -= 1;
          break;
        case 'down':
          activePosition.y += 1;
          break;
      }
      matrix[prevPosition.y][prevPosition.x].classList.remove(pageActiveClass);
      matrix[activePosition.y][activePosition.x].classList.add(pageActiveClass);
      if (options.hashChange && history.pushState) {
        var hash = '#';
        if (matrix[activePosition.y][activePosition.x].hasAttribute('id')) {
          hash += matrix[activePosition.y][activePosition.x].getAttribute('id');
          history.pushState(null, null, hash);
        } else {
          history.pushState(null, null, hash);
        }
      }
      if (options.beforeMove) {
        options.beforeMove();
      }
      if (animate) {
        options.animationFunction({
          target: pagesContainer,
          fromPercent: {
            left: _toPercent(prevPosition.x),
            top: _toPercent(prevPosition.y)
          },
          toPercent: {
            left: _toPercent(activePosition.x),
            top: _toPercent(activePosition.y)
          },
          from: {
            left: prevPosition.x,
            top: prevPosition.y
          },
          to: {
            left: activePosition.x,
            top: activePosition.y
          },
          callback: function callback(next, args) {
            _enableEvents();
            if (typeof next === 'function') {
              next(args);
            }
          }
        });
        return true;
      }
      _updateView();
      return true;
    }
    return false;
  }

  function animate(direction) {
    return move(direction, typeof options.animationFunction === 'function');
  }

  if (options.animationFunction) {
    var userAnimationFunction = options.animationFunction;
    options.animationFunction = function (intent) {
      if (typeof intent !== 'undefined') {
        _disableEvents();
        userAnimationFunction(intent);
      }
    };
  }

  pagesContainer.style.width = 100 * maxColumns + '%';
  pagesContainer.style.height = 100 * maxRows + '%';
  document.addEventListener('keydown', _handleKeyboardEvent);

  function _enableHashChange() {
    options.hashChange = true;
    window.addEventListener('hashchange', _moveToHash);
  }

  function _disableHashChange() {
    options.hashChange = false;
    window.removeEventListener('hashchange', _moveToHash);
  }

  function _moveToHash() {
    moveToPage(location.hash);
  }

  if (options.startPage) {
    if (options.hashChange && location.hash.length > 1) {
      _moveToHash();
    } else {
      moveToPage(options.startPage);
    }
  }

  if (options.hashChange) {
    _enableHashChange();
    _moveToHash();
  }

  return {
    off: function off() {
      // destroy
    },
    move: move,
    animate: animate,
    moveToPage: moveToPage,
    hashChange: {
      on: _enableHashChange,
      off: _disableHashChange
    }
  };
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = yafps;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return yafps;
    });
  } else {
    window.yaps = yafps;
  }
}
