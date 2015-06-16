'use strict;'

angular.module('mediaExplorer', [
	'ui.bootstrap', 
	'mediaExplorer.images',
	'mediaExplorer.videos',
	'mediaExplorer.mg']);

;angular.module('mediaExplorer').service('ActiveTab', function ActiveTab(){
	
	var ActiveTab = this;
	ActiveTab.activeTab = 1;

	ActiveTab.changeActiveTab = function(tabNumber){
		ActiveTab.activeTab = tabNumber;
	}

	return ActiveTab;
});;angular.module('mediaExplorer').controller('GlobalController', 
	['$scope', 'ActiveTab', function($scope, ActiveTab){
	
	$scope.init = function(){
		$scope.activeTabService = ActiveTab;
	}

	$scope.init();
}]);
//# sourceMappingURL=app.global.js.map