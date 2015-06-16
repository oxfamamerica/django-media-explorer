'use strict';

angular.module('mediaExplorer.images', ['ui.bootstrap', 'dropzone', 'bootstrapLightbox', 'mediaExplorer.mg']);;angular.module('mediaExplorer.images').run(['$http', function($http){
	$http.defaults.headers.common["X-CSRFToken"] = getCookie('csrftoken');
	$http.defaults.headers.common["Content-Type"] = 'application/x-www-form-urlencoded';
}]);'use strict';

angular.module('mediaExplorer.images').directive('imagetab', function(){
	return{
		restrict: 'E',
		controller: 'ImagesController',
		scope: true,
		replace: true,		
		transclude: true,
		templateUrl: '/static/partials/media_explorer/imagetab.html'
	}
});angular.module('mediaExplorer.images').filter('startFrom', function() {
	return function(input, start) {
		start = parseInt(start, 10) //parse to int
		if(start){
			return input.slice(start);
		}else{
			return  input
		}
	}
});;'use strict';

angular.module('mediaExplorer.images').service('Images', function Images($http, $q){
	var Images = this;
	Images.imageList = {};
	Images.stats = {};
	Images.imageViewToggle = false;
	Images.currentPage = 1;
	Images.userPageSizes = [{size:5},{size:10},{size:25},{size:50}];
	Images.userPageSizeSelection = Images.userPageSizes[0].size;
	Images.oldServerPage = 1;
	Images.newServerPage = 1;
	Images.sort_by = "created_at";
	Images.direction = "desc";
	Images.filter = "";
	Images.searchTerm = "";

	Images.getImageStats = function(){
		var defer = $q.defer();
		$http.get('/api/stats/elements?type=image&filter=' + Images.filter)
		.success(function(res){
			Images.stats = res;
			defer.resolve(res);
		})
		.error(function(err, status){
			defer.reject(err);
		});
		return defer.promise;
	}

	Images.changePage = function(page){
		Images.oldServerPage = Images.newServerPage;
		Images.currentPage = page;
		Images.newServerPage = Math.ceil((Images.currentPage * Images.userPageSizeSelection)/Images.stats.page_size);
	}

	Images.getFirst = function(){
		Images.changePage(1);
		Images.getImagesByPage();
	}

	Images.getPrevious = function(){
		Images.changePage(Images.currentPage - 1);
		if(Images.oldServerPage != Images.newServerPage){
			Images.getImagesByPage();
		}
	}

	Images.getNext = function(){
		Images.changePage(Images.currentPage + 1);
		if(Images.oldServerPage != Images.newServerPage){
			Images.getImagesByPage();
		}
	}

	Images.getLast = function() {
		Images.changePage(Images.getTotalUserPages());
		Images.getImagesByPage();
	}

	Images.getTotalUserPages = function(){
		return Math.ceil(Images.stats.total_entries/Images.userPageSizeSelection);
	}

	Images.changeDirection = function(sort_by){
		if(Images.sort_by != sort_by){
			if(sort_by == 'created_at'){
				Images.direction = 'desc';
			}else{
				Images.direction = 'asc'
			}
		}else{
			if(Images.direction == 'desc'){
				Images.direction = 'asc';
			}else{
				Images.direction = 'desc';
			}
		}
	}

	Images.sort = function(sort_by){
		Images.changeDirection(sort_by);
		Images.sort_by = sort_by;
		Images.changePage(1);
		Images.getImagesByPage();
	}

	Images.search = function(filter){
		Images.filter = filter;
		Images.changePage(1);
		Images.getImagesByPage();
	}

	Images.getImagesByPage = function(page, sort_by, direction, filter){
		page = page || Images.currentPage;
		sort_by = sort_by || Images.sort_by;
		direction = direction || Images.direction;
		filter = filter || Images.filter;

		if(page != Images.currentPage){ Images.currentPage = page;}
		if(sort_by != Images.sort_by){Images.sort_by = sort_by;}
		if(direction != Images.direction){Images.direction = direction;}
		if(filter != Images.filter){Images.filter = filter;}
		
		var defer = $q.defer();
		$http.get('/api/media/elements?type=image&page=' + Images.newServerPage + '&sort=' + Images.sort_by + '&direction=' + Images.direction + '&filter=' + Images.filter)
		.success(function(res){
			Images.getImageStats();
			Images.imageList = res;
			defer.resolve(res);
		})
		.error(function(err, status){
			defer.reject(err);
		});

		return defer.promise;
	}

	Images.editImage = function(id, form){
		var defer = $q.defer();
		$http.put('/api/media/elements/' + id, form,{
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

	Images.deleteImage = function(id){
		var defer = $q.defer();

		$http.delete('/api/media/elements/' + id)
		.success(function(res){
			defer.resolve(res);
		})
		.error(function(err, status){
			defer.reject(err);
		});

		return defer.promise;
	}
	
	return Images;

});;'use strict';

angular.module('mediaExplorer.images').controller('ImagesController', 
	['$scope', '$modal', 'ActiveTab', 'Images', 'MG', 'Lightbox', 
	function($scope, $modal, ActiveTab, Images, MG, Lightbox){

	$scope.init = function(){
		$scope.imageService = Images;
		$scope.mgService = MG;
		$scope.imageService.getImageStats();
		$scope.imageService.getImagesByPage($scope.imageService.currentPage);
		$scope.currentActiveTab = ActiveTab;
		$scope.disableInsert = disableInsertion();
	}

	$scope.ieAlert = function(){
		alert("Sorry! Django Media Explorer is read-only in older browsers. Consider upgrading to a modern alternative.");
	}

	$scope.insertImage = function(image){
		opener.MediaExplorer.insert(image);
		window.close();
	}

	$scope.openLightbox = function(orderedList, index){
		Lightbox.openModal(orderedList, index);
	}

	$scope.editImage = function(image){
		var confirmSave = confirm("This will permanently alter this image entry. Do you wish to proceed?");
		if(confirmSave){
			var editImageForm = new FormData();
			editImageForm.append('name', image.editName);
			if(image.editDescription){
				editImageForm.append('description', image.editDescription);
			}else{
				editImageForm.append('description', '');
			}
			if(image.editCredit){
				editImageForm.append('credit', image.editCredit);
			}else{
				editImageForm.append('credit', '');
			}
			$scope.imageService.editImage(image.id, editImageForm)
			.then(function(res){
				$scope.imageService.getImagesByPage($scope.imageService.currentPage);
				$scope.mgService.getAllMediaGalleries();
			}, function(err){
				alert("There was an error saving your edits. Please try again later.");
				$scope.imageService.getImagesByPage($scope.imageService.currentPage);
			});
		}
	}

	$scope.deleteImage = function(element){
		var confirmDelete = confirm("This will permanently delete this image entry. Do you wish to proceed?");
		if(confirmDelete){
			$scope.imageService.deleteImage(element.id)
			.then(function(res){
				$scope.imageService.getImagesByPage($scope.imageService.currentPage);
				$scope.mgService.removeElementFromNewMg(element);
				$scope.mgService.getAllMediaGalleries();
			}, function(err){
				alert("There was an error deleting this element. Please try again later.");
				$scope.imageService.getImagesByPage($scope.imageService.currentPage);
			});
		}
	}

	$scope.init();
}]);;'use strict';

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
//# sourceMappingURL=app.images.js.map