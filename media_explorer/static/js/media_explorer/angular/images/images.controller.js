'use strict';

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
}]);