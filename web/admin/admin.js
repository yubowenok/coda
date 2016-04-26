/**
 * @fileoverview Admin controller.
 */

coda.controller('AdminCtrl', ['page', AdminCtrl]);

function AdminCtrl(page) {
  page.setNav('admin');
}

/**
 * Starts the judge.
 */
AdminCtrl.prototype.startJudge = function() {
};

/**
 * Stops the judge.
 */
AdminCtrl.prototype.stopJudge = function() {
};
