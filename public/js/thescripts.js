const $ = require('jquery');
const cookie = require('js-cookie');

$(document).ready(function() {
  const checkCookie = cookie.get('portalmenu');
  if (checkCookie) {
    $('body').addClass('menu-closed');
  }
});

$('#menu-clicker span').click(function() {
  const body = $('body');
  if (body.hasClass('menu-closed')) {
    body.removeClass('menu-closed');
    cookie.remove('portalmenu', { expires: 7, path: '/' });
  } else {
    body.addClass('menu-closed');
    $('.submenu').removeClass('open');
    cookie.set('portalmenu', '1', { expires: 7, path: '/' });
  }
});

$('a.withChild').click(function(e) {
  e.preventDefault();
  if ($(this).siblings('ul').hasClass('open')) {
    $(this).siblings('ul').removeClass('open');
  } else {
    $('.submenu').removeClass('open');
    $(this).siblings('ul').addClass('open');
  }
});
