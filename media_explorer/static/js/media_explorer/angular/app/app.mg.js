'use strict';

angular.module('mediaExplorer.mg', ['ui.bootstrap', 'ui.sortable', 'bootstrapLightbox']);;angular.module('mediaExplorer.mg').run(['$http', function($http){
	$http.defaults.headers.common["X-CSRFToken"] = getCookie('csrftoken');
	// $http.defaults.headers.common["Content-Type"] = 'application/x-www-form-urlencoded';
}]);'use strict';

angular.module('mediaExplorer.mg').directive('mgtab', function(){
	return{
		restrict: 'E',
		controller: 'MGController',
		scope: true,
		replace: true,
		transclude: true,
		templateUrl: '/static/partials/media_explorer/mgtab.html'
	}
});'use strict';

angular.module('mediaExplorer.mg').directive('newmg', function(){
	return{
		restrict: 'E',
		controller: 'MGController',
		scope: false,
		replace: true,
		transclude: true,
		templateUrl: '/static/partials/media_explorer/newmg.html'
	}
});angular.module('mediaExplorer.mg').filter('startFrom', function() {
	return function(input, start) {
		start = parseInt(start, 10) //parse to int
		if(start){
			return input.slice(start);
		}else{
			return  input
		}
	}
});;'use strict';

angular.module('mediaExplorer.mg').service('MG', function MG($http, $q){
	var MG = this;
	MG.mgList = {};
	MG.newMG = {};
	MG.stats = {};
	MG.mgViewToggle = false;
	MG.currentPage = 1;
	MG.userPageSizes = [{size:5},{size:10},{size:25},{size:50}];
	MG.userPageSizeSelection = MG.userPageSizes[0].size;
	MG.oldServerPage = 1;
	MG.newServerPage = 1;
	MG.sort_by = "created_at";
	MG.direction = "desc";
	MG.filter = "";
	MG.searchTerm = "";

	MG.getMGStats = function(){
		var defer = $q.defer();
		$http.get('/api/stats/galleries&filter=' + MG.filter)
		.success(function(res){
			MG.stats = res;
			defer.resolve(res);
		})
		.error(function(err, status){
			defer.reject(err);
		});
		return defer.promise;
	}

	MG.changePage = function(page){
		MG.oldServerPage = MG.newServerPage;
		MG.currentPage = page;
		MG.newServerPage = Math.ceil((MG.currentPage * MG.userPageSizeSelection)/MG.stats.page_size);
	}

	MG.getFirst = function(){
		MG.changePage(1);
		MG.getMGByPage();
	}

	MG.getPrevious = function(){
		MG.changePage(MG.currentPage - 1);
		if(MG.oldServerPage != MG.newServerPage){
			MG.getMGByPage();
		}
	}

	MG.getNext = function(){
		MG.changePage(MG.currentPage + 1);
		if(MG.oldServerPage != MG.newServerPage){
			MG.getMGByPage();
		}
	}

	MG.getLast = function() {
		MG.changePage(MG.getTotalUserPages());
		MG.getMGByPage();
	}

	MG.getTotalUserPages = function(){
		return Math.ceil(MG.stats.total_entries/MG.userPageSizeSelection);
	}

	MG.changeDirection = function(sort_by){
		if(MG.sort_by != sort_by){
			if(sort_by == 'created_at'){
				MG.direction = 'desc';
			}else{
				MG.direction = 'asc'
			}
		}else{
			if(MG.direction == 'desc'){
				MG.direction = 'asc';
			}else{
				MG.direction = 'desc';
			}
		}
	}

	MG.sort = function(sort_by){
		MG.changeDirection(sort_by);
		MG.sort_by = sort_by;
		MG.changePage(1);
		MG.getMGByPage();
	}

	MG.search = function(filter){
		MG.filter = filter;
		MG.changePage(1);
		MG.getMGByPage();
	}

	MG.getMGByPage = function(page, sort_by, direction, filter){
		page = page || MG.currentPage;
		sort_by = sort_by || MG.sort_by;
		direction = direction || MG.direction;
		filter = filter || MG.filter;

		if(page != MG.currentPage){ MG.currentPage = page;}
		if(sort_by != MG.sort_by){MG.sort_by = sort_by;}
		if(direction != MG.direction){MG.direction = direction;}
		if(filter != MG.filter){MG.filter = filter;}
		
		var defer = $q.defer();
		$http.get('/api/media/galleries?page=' + MG.newServerPage + '&sort=' + MG.sort_by + '&direction=' + MG.direction + '&filter=' + MG.filter)
		.success(function(res){
			MG.getMGStats();
			MG.mgList = res;
			defer.resolve(res);
		})
		.error(function(err, status){
			defer.reject(err);
		});

		return defer.promise;
	}
	
	MG.addNewMediaGallery = function(form){
		var defer = $q.defer();

		$http.post('/api/media/galleries', form, {
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

	MG.editMediaGallery = function(form){
		var defer = $q.defer();

		$http.put('/api/media/galleries/' + MG.newMG.editGalleryID, form, {
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

	MG.deleteMediaGallery = function(id){
		var defer = $q.defer();

		$http.delete('/api/media/galleries/' + id)
		.success(function(res){
			defer.resolve(res);
		})
		.error(function(err, status){
			defer.reject(err);
		});

		return defer.promise;
	}

	MG.resetNewMG = function(){
		MG.newMG.name = '';
		MG.newMG.description = '';
		MG.newMG.elements = [];
		MG.newMG.element_id = [];
		MG.newMG.isEdit = false;
		MG.newMG.editGalleryID = null;
	}

	MG.loadMG = function(gallery, isDuplicate){
		if(!isDuplicate){
			MG.newMG.isEdit = true;
			MG.newMG.editGalleryID = gallery.id;
		}
		if(isDuplicate){
			MG.newMG.name = gallery.name + " (DUPLICATE)";
			MG.newMG.description = gallery.description + " (DUPLICATE)";
		}else{
			MG.newMG.name = gallery.name;
			MG.newMG.description = gallery.description;
		}
		MG.newMG.elements = [];
		MG.newMG.element_id = [];
		for(var i = 0; i < gallery.elements.length; i++){
			var newMGElement = gallery.elements[i];
			newMGElement.editDescription = newMGElement.description;
			newMGElement.mgDescription = newMGElement.description;
			newMGElement.editCredit = newMGElement.credit;
			newMGElement.mgCredit = newMGElement.credit;
			MG.newMG.elements.push(newMGElement);
			MG.newMG.element_id.push(newMGElement.id);
		}
	}

	MG.addElementToNewMG = function(element){
		MG.newMG.element_id.push(element.id);
		MG.newMG.elements.push(element);
		var elementIndex = MG.newMG.element_id.indexOf(element.id);
		MG.newMG.elements[elementIndex].editDescription = MG.newMG.elements[elementIndex].description;
		MG.newMG.elements[elementIndex].mgDescription = MG.newMG.elements[elementIndex].description;
		MG.newMG.elements[elementIndex].editCredit = MG.newMG.elements[elementIndex].credit;
		MG.newMG.elements[elementIndex].mgCredit = MG.newMG.elements[elementIndex].credit;
	}

	MG.removeElementFromNewMg = function(element){
		var elementIndex = MG.newMG.element_id.indexOf(element.id);
		if(elementIndex > -1){
			MG.newMG.element_id.splice(elementIndex,1);
			MG.newMG.elements.splice(elementIndex,1);
		}
	}

	MG.updateElementInNewMG = function(element){
		var elementIndex = MG.newMG.element_id.indexOf(element.id);
		if(elementIndex > -1){
			if(element.editDescription){
				MG.newMG.elements[elementIndex].mgDescription = element.editDescription;
			}
			if(element.editCredit){
				MG.newMG.elements[elementIndex].mgCredit = element.editCredit;
			}
		}
	}

	return MG;
});;'use strict';

angular.module('mediaExplorer.mg').controller('MGController', 
	['$scope', 'ActiveTab', 'MG', 'Lightbox', 
	function($scope, ActiveTab, MG, Lightbox){
	
	$scope.init = function(){
		$scope.mgService = MG;
		$scope.mgService.getMGStats();
		$scope.mgService.getMGByPage($scope.mgService.currentPage);
		$scope.mgService.resetNewMG();
		$scope.currentActiveTab = ActiveTab;
		$scope.disableInsert = disableInsertion();
	}

	$scope.ieAlert = function(){
		alert("Sorry! Django Media Explorer is read-only in older browsers. Consider upgrading to a modern alternative.");
	}

	$scope.insertMG = function(mg){
		opener.MediaExplorer.insert(mg);
		window.close();
	}

	$scope.openLightbox = function(orderedList, index){
		Lightbox.openModal(orderedList, index);
	}

	$scope.sortableOptions = {
		placeholder: "sortable-placeholder",
		forceHelperSize: true,
		change: function(event, ui){mgChangeState(true);}
	}

	$scope.deleteMG = function(gallery){
		var confirmDelete = confirm("This will permanently delete this media gallery entry. Do you wish to proceed?");
		if(confirmDelete){
			$scope.mgService.deleteMediaGallery(gallery.id)
			.then(function(res){
				$scope.mgService.getMGByPage($scope.mgService.currentPage);
			}, function(err){
				alert("There was a problem deleting this gallery. Please try again later.")
				$scope.mgService.getMGByPage($scope.mgService.currentPage);
			});
		}
	}

	$scope.cancelGalleryCreation = function(){
		var confirmCancel = confirm("All unsaved changes will be permanently deleted. Do you wish to proceed?");
		if(confirmCancel){
			$scope.mgService.resetNewMG();
			$scope.mgService.mgViewToggle = false;
			mgChangeState(false);
		}
	}

	$scope.loadMediaGallery = function(gallery, isDuplicate){
		if(!isDuplicate){
			var confirmLoad = confirm("This will edit the existing media gallery. Do you wish to proceed?");
			if(confirmLoad){
				$scope.mgService.mgViewToggle = !$scope.mgService.mgViewToggle;
				$scope.mgService.loadMG(gallery, isDuplicate);
			}
		}else{
			$scope.mgService.mgViewToggle = !$scope.mgService.mgViewToggle;
			$scope.mgService.loadMG(gallery, isDuplicate);
		}
	}

	$scope.addNewMG = function(){
		var newMGForm = new FormData();
		newMGForm.append('name', $scope.mgService.newMG.name);
		newMGForm.append('description', $scope.mgService.newMG.description);
		$scope.mgService.newMG.element_id = []
		for(var i = 0; i < $scope.mgService.newMG.elements.length; i++){
			$scope.mgService.newMG.element_id.push($scope.mgService.newMG.elements[i].id);
			if($scope.mgService.newMG.elements[i].mgDescription){
				newMGForm.append('element_description', $scope.mgService.newMG.elements[i].mgDescription);
			}else{
				newMGForm.append('element_description', '');
			}
			if($scope.mgService.newMG.elements[i].mgCredit){
				newMGForm.append('element_credit', $scope.mgService.newMG.elements[i].mgCredit);
			}
			else{
				newMGForm.append('element_credit', '');
			}
		}
		for(var i = 0; i < $scope.mgService.newMG.element_id.length; i++){
			newMGForm.append('element_id', $scope.mgService.newMG.element_id[i]);
		}
		if($scope.mgService.newMG.isEdit){
			$scope.mgService.editMediaGallery(newMGForm)
			.then(function(res){
				alert('Media Gallery save success!');
				$scope.mgService.getMGByPage($scope.mgService.currentPage);
				$scope.mgService.resetNewMG();
				$scope.mgService.mgViewToggle = false;
				mgChangeState(false);
			}, function(){
				alert('There was a problem saving your gallery.');
			});
		}else{
			$scope.mgService.addNewMediaGallery(newMGForm)
			.then(function(res){
				alert('Media Gallery save success!');
				$scope.mgService.getMGByPage($scope.mgService.currentPage);
				$scope.mgService.resetNewMG();
				$scope.mgService.mgViewToggle = false;
				mgChangeState(false);
			}, function(){
				alert('There was a problem saving your gallery.');
			});
		}
	}

	$scope.addElementToNewMG = function(element){
		if($scope.mgService.newMG.element_id.indexOf(element.id) > -1){
			alert('Element already in gallery! Elements cannot be added more than once.');
		}else{
			mgChangeState(true);
			$scope.mgService.addElementToNewMG(element);
		}
	}

	$scope.removeElementFromNewMg = function(element){
		mgChangeState(true);
		$scope.mgService.removeElementFromNewMg(element);
	}

	$scope.updateElementInNewMG = function(element){
		mgChangeState(true);
		$scope.mgService.updateElementInNewMG(element);
	}

	$scope.init();
}]);
//# sourceMappingURL=app.mg.js.map