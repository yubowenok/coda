coda.controller('RegisterCtrl', [
  '$scope', '$location', 'page', 'request', 'user',
  function($scope, $location, page, request, user) {
    page.setNav('register');

    /** @type {string} */
    $scope.username = '';
    /** @type {string} */
    $scope.password = '';
    /** @type {string} */
    $scope.confirmPassword = '';
    /** @type {string} */
    $scope.email = '';
    /** @type {string} */
    $scope.affiliation = '';

    /** @type {boolean} */
    $scope.validUsername = true;
    /** @type {boolean} */
    $scope.validEmail = true;
    /** @type {boolean} */
    $scope.passwordMatch = true;

    $('#username').on('change', function() {
      if ($scope.username === '') {
        $scope.validUsername = true;
        return;
      }
      request.get(coda.url.existsUsername + $scope.username, {
        noErrorDisplay: true,
        success: function() {
          $scope.validUsername = false;
        },
        error: function() {
          $scope.validUsername = true;
        }
      });
    });

    /**
     * Checks whether the password and the confirmPassword match.
     */
    var checkPasswords = function() {
      $scope.$apply(function() {
        if ($scope.password === '' || $scope.confirmPassword === '') {
          $scope.passwordMatch = true;
          return;
        }
        $scope.passwordMatch = $scope.password === $scope.confirmPassword;
      });
    };
    $('#password').on('change', checkPasswords);
    $('#confirm-password').on('change', checkPasswords);

    $('#email').on('change', function() {
      var regex = '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)' +
        '*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|' +
        '(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
      $scope.$apply(function() {
        if ($scope.email === '') {
          // Hide invalid email message on empty email.
          $scope.validEmail = true;
          return;
        }
        $scope.validEmail = RegExp(regex).test($scope.email);
      });
    });

    /**
     * Registers the user.
     */
    $scope.register = function() {
      request.post(coda.url.registerUser, {
        username: $scope.username,
        password: $scope.password,
        email: $scope.email,
        affiliation: $scope.affiliation
      }, {
        success: function() {
          user.login($scope.username);
          $location.path('/');
        },
        successMessage: 'registration successful'
      });
    };

    /**
     * Checks if the registration info is valid and complete.
     * @return {boolean}
     */
    $scope.infoComplete = function() {
      return $scope.username !== '' && $scope.validUsername &&
        $scope.email !== '' && $scope.validEmail &&
        $scope.password !== '' && $scope.passwordMatch;
    };
  }
]);
