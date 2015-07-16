'use strict';

angular.module('mediaExplorer.videos').directive('videotab', function(){
	return{
		restrict: 'E',
		controller: 'VideosController',
		scope: true,
		replace: true,
		transclude: true,
		templateUrl: '/static/partials/media_explorer/videotab.html'
	}
})