/**
 * @fileoverview Coda page factory.
 */

coda.factory('page', function() {
  return new PageFactory();
});

/** @typedef {PageFactory} */
coda.page;

/**
 * @constructor
 */
function PageFactory() {
  /** @type {string} */
  this.curPage = 'home';
}

/**
 * Highlights the tab of newPage in the nav bar.
 * @param {string} newPage
 */
PageFactory.prototype.setNav = function(newPage) {
  this.curPage = newPage;
  var navPages = $('#nav-pages');
  navPages.find('li').removeClass('active');
  navPages.find('#' + this.curPage).addClass('active');
};
