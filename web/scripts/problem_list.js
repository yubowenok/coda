var app = angular.module("problem_list", []);

app.controller("problem_list_ctrl", function($scope,$http){

	$http.get('')
	.success(function(data,status,headers,config){
		$scope.problems = data.records;
	})
	.error(function(data,status,headers,config){
		alert("Cannot retrieve list of Problems")
	});

/*
//sample data for local testing
	$scope.problems=[
	{
		id:'ID1',
		title:'T',
		description:'D',
		sampleInput:'SI',
		sampleOutput: 'SO',
		hint: 'H'
	},
	{
		id:'ID2',
		title:'T2',
		description:'D2',
		sampleInput:'SI2',
		sampleOutput: 'SO2',
		hint: 'H2'
	}
	];
*/


	$scope.edit = function(prob){
		$scope.p = angular.copy(prob);

	};

	$scope.submit = function(){
		var dataObject = {
			id : $scope.id,
			title : $scope.title,
			description : $scope.descrip,
			sampleInput : $scope.sanplein,
			sampleOutput : $scope.sampleout,
			hint : $scope.hint,
		}
		$http.post('',dataObject)
		.success(function(data, status, headers, config){
			alert('Problem added!');
		})
		.error(function(data, status, headers, config){
			alert('Submission failed!');
		});


	}


});
