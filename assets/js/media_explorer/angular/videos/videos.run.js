angular.module('mediaExplorer.videos').run(['$http', function($http){
	$http.defaults.headers.common["X-CSRFToken"] = getCookie('csrftoken');
	// $http.defaults.headers.common["Content-Type"] = 'application/x-www-form-urlencoded';
}])