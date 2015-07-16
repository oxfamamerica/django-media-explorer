angular.module('mediaExplorer.images').filter('startFrom', function() {
	return function(input, start) {
		start = parseInt(start, 10) //parse to int
		if(start){
			return input.slice(start);
		}else{
			return  input
		}
	}
});