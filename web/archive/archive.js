coda.controller('ArchiveCtrl', ['$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('archive');
    $scope.problems = [
      {id: 'APLUSB', title: 'A + B', successRate: 91.62},
      {id: 'MUL', title: 'Integer Multiplication', successRate: 75.26},
      {id: 'MAXSUM', title: 'Maximum Sum', successRate: 41.62},
      {id: 'MAXSUM2', title: 'Maximum Sum II', successRate: 27.10},
      {id: 'GRAPHCUT', title: 'Graph Cutting', successRate: -1}
    ];

    /**
     * Opens a problem from the archive.
     * @param {string} id
     */
    $scope.gotoProblem = function(id) {
      $location.path('archive/' + id);
    };
  }
]);
