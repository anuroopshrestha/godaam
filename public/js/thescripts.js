const $ = require('jquery');

$('#menu-clicker span').click(function() {
  $('body').toggleClass('menu-closed');
});
