var app = angular.module("add_problem", []);

app.controller("add_problem_ctrl", function($scope,$http){
	
	$scope.reset = function(){
		$scope.title="";
		$scope.descrip="";
		$scope.samplein="";
		$scope.sampleout="";
		$scope.hint="";
	};
	$scope.reset();

	
	$scope.submit = function(){
		var dataObject = {
			title : $scope.title,
			description : $scope.descrip,
			sampleInput : $scope.samplein,
			sampleOutput : $scope.sampleout,
			hint : $scope.hint,
		};

		$http.post('',dataObject)
		.success(function(data, status, headers, config){
			alert('Problem added!');
		})
		.error(function(data, status, headers, config){
			alert('Submission failed!');
		});



	}


});
