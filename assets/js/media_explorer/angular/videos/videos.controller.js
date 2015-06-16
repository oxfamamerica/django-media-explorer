'use strict';

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
