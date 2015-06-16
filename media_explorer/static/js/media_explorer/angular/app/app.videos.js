'use strict';

angular.module('mediaExplorer.videos', ['ui.bootstrap', 'bootstrapLightbox', 'mediaExplorer.mg']);;angular.module('mediaExplorer.videos').run(['$http', function($http){
	$http.defaults.headers.common["X-CSRFToken"] = getCookie('csrftoken');
	// $http.defaults.headers.common["Content-Type"] = 'application/x-www-form-urlencoded';
}]);'use strict';

angular.module('mediaExplorer.videos').directive('videotab', function(){
	return{
		restrict: 'E',
		controller: 'VideosController',
		scope: true,
		replace: true,
		transclude: true,
		templateUrl: '/static/partials/media_explorer/videotab.html'
	}
});'use strict';

angular.module('mediaExplorer.videos').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);;angular.module('mediaExplorer.videos').filter('startFrom', function() {
    return function(input, start) {
        start = parseInt(start, 10) //parse to int
        if(start){
        	return input.slice(start);
        }else{
        	return  input
        }
    }
});;angular.module('mediaExplorer.videos').service('Videos', function Videos($http, $q){
	var Videos = this;
	Videos.videoList = {};
	Videos.stats = {};
	Videos.newVideoFormData = {}
	Videos.videoViewToggle = false;
	Videos.currentPage = 1;
	Videos.userPageSizes = [{size:5},{size:10},{size:25},{size:50}];
	Videos.userPageSizeSelection = Videos.userPageSizes[0].size;
	Videos.oldServerPage = 1;
	Videos.newServerPage = 1;
	Videos.sort_by = "created_at";
	Videos.direction = "desc";
	Videos.filter = "";
	Videos.searchTerm = "";

	Videos.getVideoStats = function(){
		var defer = $q.defer();
		$http.get('/api/stats/elements?type=video&filter=' + Videos.filter)
		.success(function(res){
			Videos.stats = res;
			defer.resolve(res);
		})
		.error(function(err, status){
			defer.reject(err);
		});
		return defer.promise;
	}

		Videos.changePage = function(page){
		Videos.oldServerPage = Videos.newServerPage;
		Videos.currentPage = page;
		Videos.newServerPage = Math.ceil((Videos.currentPage * Videos.userPageSizeSelection)/Videos.stats.page_size);
	}

	Videos.getFirst = function(){
		Videos.changePage(1);
		Videos.getVideosByPage();
	}

	Videos.getPrevious = function(){
		Videos.changePage(Videos.currentPage - 1);
		if(Videos.oldServerPage != Videos.newServerPage){
			Videos.getVideosByPage();
		}
	}

	Videos.getNext = function(){
		Videos.changePage(Videos.currentPage + 1);
		if(Videos.oldServerPage != Videos.newServerPage){
			Videos.getVideosByPage();
		}
	}

	Videos.getLast = function() {
		Videos.changePage(Videos.getTotalUserPages());
		Videos.getVideosByPage();
	}

	Videos.getTotalUserPages = function(){
		return Math.ceil(Videos.stats.total_entries/Videos.userPageSizeSelection);
	}

	Videos.changeDirection = function(sort_by){
		if(Videos.sort_by != sort_by){
			if(sort_by == 'created_at'){
				Videos.direction = 'desc';
			}else{
				Videos.direction = 'asc'
			}
		}else{
			if(Videos.direction == 'desc'){
				Videos.direction = 'asc';
			}else{
				Videos.direction = 'desc';
			}
		}
	}

	Videos.sort = function(sort_by){
		Videos.changeDirection(sort_by);
		Videos.sort_by = sort_by;
		Videos.changePage(1);
		Videos.getVideosByPage();
	}

	Videos.search = function(filter){
		Videos.filter = filter;
		Videos.changePage(1);
		Videos.getVideosByPage();
	}

	Videos.getVideosByPage = function(page, sort_by, direction, filter){
		page = page || Videos.currentPage;
		sort_by = sort_by || Videos.sort_by;
		direction = direction || Videos.direction;
		filter = filter || Videos.filter;

		if(page != Videos.currentPage){ Videos.currentPage = page;}
		if(sort_by != Videos.sort_by){Videos.sort_by = sort_by;}
		if(direction != Videos.direction){Videos.direction = direction;}
		if(filter != Videos.filter){Videos.filter = filter;}
		
		var defer = $q.defer();
		$http.get('/api/media/elements?type=video&page=' + Videos.newServerPage + '&sort=' + Videos.sort_by + '&direction=' + Videos.direction + '&filter=' + Videos.filter)
		.success(function(res){
			Videos.getVideoStats();
			Videos.videoList = res;
			defer.resolve(res);
		})
		.error(function(err, status){
			defer.reject(err);
		});

		return defer.promise;
	}

	Videos.addNewVideo = function(form){
		var defer = $q.defer();

		$http.post('/api/media/elements', form, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})
		.success(function(res){
			defer.resolve(res);
		})
		.error(function(err, status){
			defer.reject(err);
		});

		return defer.promise;
	}

	Videos.editVideo = function(id, form){
		var defer = $q.defer();

		$http.put('/api/media/elements/' + id, form, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})
		.success(function(res){
			defer.resolve(res);
		})
		.error(function(err, status){
			defer.reject(err);
		});

		return defer.promise;
	}

	Videos.deleteVideo = function(video){
		var defer = $q.defer();

		$http.delete('/api/media/elements/' + video.id)
		.success(function(res){
			defer.resolve(res);
		})
		.error(function(err, status){
			defer.reject(err);
		});

		return defer.promise;
	}

	return Videos;

});
;'use strict';

angular.module('mediaExplorer.videos').controller('VideosController', 
	['$scope', '$modal', 'ActiveTab', 'Videos', 'MG', 'Lightbox', 
	function($scope, $modal, ActiveTab, Videos, MG, Lightbox){

	$scope.init = function(){
		$scope.videoService = Videos;
		$scope.mgService = MG;
		$scope.videoService.getVideoStats();
		$scope.videoService.getVideosByPage($scope.videoService.currentPage);
		$scope.videoService.newVideoFormData = {};
		$scope.currentActiveTab = ActiveTab;
		$scope.disableInsert = disableInsertion();
	}

	$scope.ieAlert = function(){
		alert("Sorry! Django Media Explorer is read-only in older browsers. Consider upgrading to a modern alternative.");
	}

	$scope.insertVideo = function(video){
		opener.MediaExplorer.insert(video);
		window.close();
	}

	$scope.openLightbox = function(orderedList, index){
		Lightbox.openModal(orderedList, index);
	}
	
	$scope.addVideo = function(){
		if($scope.videoService.newVideoFormData.video_url.indexOf('iframe') > -1 || $scope.videoService.newVideoFormData.video_url.indexOf('<div') > -1){
			$scope.videoService.newVideoFormData.video_embed = $scope.videoService.newVideoFormData.video_url;
			$scope.videoService.newVideoFormData.video_url = "";
		}
		if($scope.videoService.newVideoFormData.video_url){
			if($scope.videoService.newVideoFormData.video_url.indexOf('https://youtu.be/') > -1){
				$scope.videoService.newVideoFormData.video_url = $scope.videoService.newVideoFormData.video_url.replace('https://youtu.be/', 'https://www.youtube.com/watch?v=');
			}
		}
		if($scope.videoService.newVideoFormData.video_embed){
			if($scope.videoService.newVideoFormData.video_embed.indexOf('https://youtu.be/') > -1){
				$scope.videoService.newVideoFormData.video_embed = $scope.videoService.newVideoFormData.video_embed.replace('https://youtu.be/', 'https://www.youtube.com/watch?v=');
			}
		}
		var newVideoForm = new FormData();
		newVideoForm.append('name', $scope.videoService.newVideoFormData.name);
		newVideoForm.append('description', $scope.videoService.newVideoFormData.description);
		newVideoForm.append('video_url', $scope.videoService.newVideoFormData.video_url);
		newVideoForm.append('video_embed', $scope.videoService.newVideoFormData.video_embed);
		if($scope.videoService.newVideoFormData.credit){
			newVideoForm.append('credit', $scope.videoService.newVideoFormData.credit)
		}
		if ($scope.videoService.newVideoFormData.video_thumbnail_image){
			newVideoForm.append('thumbnail_image', $scope.videoService.newVideoFormData.video_thumbnail_image);
			//Reset video_thumbnail_image or else it will stay in the form
			$scope.video_thumbnail_image = "";
		}

		$scope.videoService.addNewVideo(newVideoForm)
		.then(function(res){
			//success
			$scope.videoService.getVideosByPage($scope.videoService.currentPage);
			$scope.videoService.newVideoFormData = {};
		}, function(){
			alert("There was an error adding this element. Please try again later.");
			$scope.imageService.getImagesByPage($scope.imageService.currentPage);
		});
		document.getElementById('newVideoForm').reset();
		$scope.videoService.videoViewToggle = false;
	}

	$scope.editVideo = function(video){
		var confirmSave = confirm("This will permanently alter this video/multimedia entry. Do you wish to proceed?");
		if(confirmSave){
			var updateVideoForm = new FormData();
			updateVideoForm.append('name', video.editName);
			updateVideoForm.append('description', video.editDescription);
			if(video.editCredit){
				updateVideoForm.append('credit', video.editCredit);
			}else{
				updateVideoForm.append('credit', '');
			}
			if(video.edit_video_thumbnail_image){
				updateVideoForm.append('thumbnail_image', video.edit_video_thumbnail_image);
				//Reset video_thumbnail_image or else it will stay in the form
				video.edit_video_thumbnail_image = "";
			}
			$scope.videoService.editVideo(video.id, updateVideoForm)
			.then(function(res){
				$scope.videoService.getVideosByPage($scope.videoService.currentPage);
				$scope.mgService.getAllMediaGalleries();
			}, function(err){
				alert("There was an error saving your edits. Please try again later.");
				$scope.imageService.getImagesByPage($scope.imageService.currentPage);
			});
		}
	}

	$scope.deleteVideo = function(video){
		var confirmDelete = confirm("This will permanently delete this video/multimedia entry. Do you wish to proceed?");
		if(confirmDelete){
			$scope.videoService.deleteVideo(video)
			.then(function(res){
				//success
				$scope.videoService.getVideosByPage($scope.videoService.currentPage);
				$scope.mgService.removeElementFromNewMg(video);
				$scope.mgService.getAllMediaGalleries();
			}, function(err){
				alert("There was an error deleting this element. Please try again later.");
				$scope.imageService.getImagesByPage($scope.imageService.currentPage);
			});
		}
	}

	$scope.init();
}]);

//# sourceMappingURL=app.videos.js.map