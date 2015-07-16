'use strict';

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

});