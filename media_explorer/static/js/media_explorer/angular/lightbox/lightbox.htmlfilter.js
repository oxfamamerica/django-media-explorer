angular.module('bootstrapLightbox').filter('unsafe', function($sce){
	return function(val){
		return $sce.trustAsHtml(val);
	};
});