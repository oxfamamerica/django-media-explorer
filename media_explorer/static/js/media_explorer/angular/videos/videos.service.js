angular.module('mediaExplorer.videos').service('Videos', function Videos($http, $q){
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
