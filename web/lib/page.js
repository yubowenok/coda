coda.factory('page', function() {
  var curPage = 'home';
  return {
    setNav: function(newPage) {
      curPage = newPage;
      var navPages = $('#nav-pages');
      navPages.find('li').removeClass('active');
      navPages.find('#' + curPage).addClass('active');
    }
  };
});
