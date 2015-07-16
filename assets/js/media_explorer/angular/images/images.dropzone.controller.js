'use strict';

angular.module('mediaExplorer.images').controller('DropzoneImageController', function ($scope) {
	$scope.imageDropzoneConfig = {
		'options': {
			'paramName': 'image',
			'headers': {"X-CSRFToken": getCookie('csrftoken')},
			'url': '/api/media/elements',
			'parallelUploads': 1,
		},
		'eventHandlers': {
			'sending': function (file, xhr, formData) {
			},
			'success': function (file, response) {
				$scope.imageService.getImagesByPage($scope.imageService.currentPage);
				$scope.imageService.getImageStats();
			},
			'processing': function(file){
				uploadInProgressState(true);
			},
			'queuecomplete': function(response){
				uploadInProgressState(false);
			}
		}
	};
});