$('.guile').append('<img src="./img/Guile-oldstance.gif" height="192" width="106"/> ')
$('.ryu').append('<img src="./img/ryu_bounce.gif" height="192"/>');

$(document).on('mousedown touchstart', function () {
  $('.ryu img').attr('src', './img/ryuhad.gif');
})

$(document).on('mouseup touchend', function () {
  $('.kosign').remove();
  $('.ryu img').attr('src', './img/ryu_bounce.gif');
})

$(document).on('mousedown touchstart', function () {
  $('.hudo').append(
    '<img class="hadouken" src="./img/hadouken.gif">'
  );
})

$(document).on('mousedown touchstart', function () {
  $('.hadouken').animate({
    "margin-left": "45px"
  }, 0900, 'swing', function () {
    this.remove();
    $('.kosign').append('<img src="http://www.slateman.net/images/gaming/gifs/mvc-ko.gif" />');
  })
})

