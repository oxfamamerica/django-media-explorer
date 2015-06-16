'use strict';

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
});