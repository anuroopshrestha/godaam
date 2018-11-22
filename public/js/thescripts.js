const $ = require('jquery');
const cookie = require('js-cookie');
// const autocomplete = require('./modules/autocomplete');

// autocomplete($('#address'), $('#lat'), $('#lng'));

const removeToasts = () => {
  $('.toast').fadeOut(300, 'swing', () => {
    $('.toast').remove();
  });
};

$(document).ready(function() {
  const checkCookie = cookie.get('portalmenu');
  if (checkCookie) {
    $('body').addClass('menu-closed');
  }
  setTimeout(removeToasts, 3000);
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

$('.delBrand').click(function(e) {
  e.preventDefault();
  const href = $(this).attr('href');
  const response = confirm('Are you sure you want to delete this brand?'); // eslint-disable-line
  if (response) {
    window.location.href = href;
  }
});

$('.modal-close').click(function() {
  $('.modal-wrap').addClass('off');
});

$('.openModal').click(function(e) {
  e.preventDefault();
  $('.modal-wrap').removeClass('off');
  const url = $(this).data('url');
  $('.modal-main').load(url, function() {
    $('.modal-loader').addClass('off');
  });
});
