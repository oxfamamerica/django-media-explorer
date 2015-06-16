angular.module('mediaExplorer').controller('GlobalController', 
	['$scope', 'ActiveTab', function($scope, ActiveTab){
	
	$scope.init = function(){
		$scope.activeTabService = ActiveTab;
	}

	$scope.init();
}]);