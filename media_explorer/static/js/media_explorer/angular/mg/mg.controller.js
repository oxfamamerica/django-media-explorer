'use strict';

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