'use strict';

angular.module('mediaExplorer.images').directive('imagetab', function(){
	return{
		restrict: 'E',
		controller: 'ImagesController',
		scope: true,
		replace: true,		
		transclude: true,
		templateUrl: '/static/partials/media_explorer/imagetab.html'
	}
})