coda.factory('page', function() {
  var curPage = 'home';
  return {
    setNav: function(newPage) {
      curPage = newPage;
      var navPages = $('#nav-pages');
      navPages.children().removeClass('active');
      navPages.children('#' + curPage).addClass('active');
    }
  };
});
