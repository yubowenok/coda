coda.controller('SessionsCtrl', ['$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('sessions');
    $scope.activeSessions = [
      {
        id: 'HW122315',
        text: 'Homework 12/23/2015'
      },
      {
        id: 'AMRITAPURI15',
        text: 'ACM-ICPC Asia-Amritapuri Onsite Mirror Contest 2015'
      },
      {
        id: 'DL122315',
        text: 'Daily Challenge 12/23/2015'
      }
    ];
    $scope.scheduledSessions = [
      {id: 'FN122515', text: 'Friday Night 12/25/2015'}
    ];
    $scope.finishedSessions = [
      {id: 'HW121615', text: 'Homework 12/16/2015'},
      {id: 'HW120915', text: 'Homework 12/09/2015'}
    ];

    /**
     * Opens a session with the given id.
     * @param {string} id
     */
    $scope.gotoSession = function(id) {
      $location.path('sessions/' + id);
    };
  }
]);
