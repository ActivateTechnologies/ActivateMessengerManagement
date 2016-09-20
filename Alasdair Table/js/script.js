var app = angular.module('sortTable' , []);

app.controller('usersCtrl', ['$scope', '$http' , function($scope, $http) {
	$http.get('./users.json').success(function(response) {
		$scope.users = response.users;
		console.log($scope.users);
	})
}])