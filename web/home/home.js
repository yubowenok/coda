coda.controller('HomeCtrl', [
  '$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('home');
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

    /**
     * Opens a session with a given id.
     * @param {string} id
     */
    $scope.gotoSession = function(id) {
      $location.path('sessions/' + id);
    };
  }
]);
