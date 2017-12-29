coda.controller('TestsCtrl', [
  '$scope', '$location', '$routeParams', 'page',
  function($scope, $location, $routeParams, page) {
    page.setNav('moderator');

    $scope.problemId = $routeParams.problemId;

    $scope.batches = [
      [
        {size: 12},
        {size: 19},
        {size: 15}
      ],
      [
        {size: 1235},
        {size: 1113}
      ]
    ];
  }
]);
