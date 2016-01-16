coda.controller('ArchiveCtrl', ['$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('archive');

    coda.contestInfo($scope);
    $scope.contestTitle = 'Archive';

    /**
     * Opens a problem from the archive.
     * @param {string} id
     */
    $scope.gotoProblem = function(id) {
      $location.path('archive/' + id);
    };
  }
]);
