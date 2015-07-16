'use strict';

angular.module('mediaExplorer.mg').directive('mgtab', function(){
	return{
		restrict: 'E',
		controller: 'MGController',
		scope: true,
		replace: true,
		transclude: true,
		templateUrl: '/static/partials/media_explorer/mgtab.html'
	}
})