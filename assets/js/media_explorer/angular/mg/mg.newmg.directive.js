'use strict';

angular.module('mediaExplorer.mg').directive('newmg', function(){
	return{
		restrict: 'E',
		controller: 'MGController',
		scope: false,
		replace: true,
		transclude: true,
		templateUrl: '/static/partials/media_explorer/newmg.html'
	}
})