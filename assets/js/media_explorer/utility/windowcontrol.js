var uploadInProgress = false;
var mgChanges = false;

function uploadInProgressState(bool){
	uploadInProgress = bool;
}

function mgChangeState(bool){
	mgChanges = bool;
}

onbeforeunload = function(){
	if(uploadInProgress && mgChanges){
		return "\u2022 Files are currently being uploaded. Any uploads not completed will be canceled, and any processing errors will not be received.\n\u2022 You have unsaved changes to the elements in your media gallery. Leaving this page will discard them."
	}else if(uploadInProgress){
		return "Files are currently being uploaded. Any uploads not completed will be canceled, and any processing errors will not be received."
	}else if(mgChanges){
		return "You have unsaved changes to the elements in your media gallery. Leaving this page will discard them."
	}
}

function disableInsertion(){
	var disableInsert = false;
	try{
		if(window.opener.MediaExplorer.insert){
			//do nothing	
		}
	}catch(err){
		disableInsert = true;
	}
	return disableInsert;
}