var pacman = document.querySelector(".pacman");
var topper = 74;
var left = 3;
var speed = 1;
var check = 0;

setInterval(function () {
  if (topper < 88 && left < 77 && !check) {
    topper += speed;
    pacman.style.top = topper + "%";
    pacman.style.transform = "rotate(0deg)";
  } else if (left < 88 && !check) {
    left += speed;
    pacman.style.left = left + "%";
    pacman.style.transform = "rotate(-90deg)";
  } else if (topper > 4) {
    topper -= speed;
    pacman.style.top = topper + "%";
    pacman.style.transform = "rotate(-180deg)";
    check = 1;
  } else if (left > 3) {
    left -= speed;
    pacman.style.left = left + '%';
    pacman.style.transform = "rotate(-270deg)";
  } else {
    check = 0;
  }
}, 10);

var ghost = document.querySelector(".ghost");
var topghost = 45;
var leftghost = 0;
var checkghost = 0;

setInterval(function () {
  if (topghost < 88 && leftghost < 77 && !checkghost) {
    topghost += speed;
    ghost.style.top = topghost + "%";
  } else if (leftghost < 88 && !checkghost) {
    leftghost += speed;
    ghost.style.left = leftghost + "%";
  } else if (topghost > 4) {
    topghost -= speed;
    ghost.style.top = topghost + "%";
    checkghost = 1;
  } else if (leftghost > 3) {
    leftghost -= speed;
    ghost.style.left = leftghost + '%';
  } else {
    checkghost = 0;
  }
}, 10);

var ghostRed = document.querySelector(".ghost_red");
var topghostRed = 0;
var leftghostRed = 23;
var checkghostRed = 0;


setInterval(function () {
  if (topghostRed < 88 && leftghostRed < 77 && !checkghostRed) {
    topghostRed += speed;
    ghostRed.style.top = topghostRed + "%";
  } else if (leftghostRed < 88 && !checkghostRed) {
    leftghostRed += speed;
    ghostRed.style.left = leftghostRed + "%";
  } else if (topghostRed > 4) {
    topghostRed -= speed;
    ghostRed.style.top = topghostRed + "%";
    checkghostRed = 1;
  } else if (leftghostRed > 3) {
    leftghostRed -= speed;
    ghostRed.style.left = leftghostRed + '%';
  } else {
    checkghostRed = 0;
  }
}, 10);

var ghostOrange = document.querySelector(".ghost_orange");
var topghostOrange = 0;
var leftghostOrange = 1;
var checkghostOrange = 0;

setInterval(function () {
  if (topghostOrange < 88 && leftghostOrange < 77 && !checkghostOrange) {
    topghostOrange += speed;
    ghostOrange.style.top = topghostOrange + "%";
  } else if (leftghostOrange < 88 && !checkghostOrange) {
    leftghostOrange += speed;
    ghostOrange.style.left = leftghostOrange + "%";
  } else if (topghostOrange > 4) {
    topghostOrange -= speed;
    ghostOrange.style.top = topghostOrange + "%";
    checkghostOrange = 1;
  } else if (leftghostOrange > 3) {
    leftghostOrange -= speed;
    ghostOrange.style.left = leftghostOrange + '%';
  } else {
    checkghostOrange = 0;
  }
}, 10);
