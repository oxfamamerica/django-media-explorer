'use strict;'

angular.module('mediaExplorer', [
	'ui.bootstrap', 
	'mediaExplorer.images',
	'mediaExplorer.videos',
	'mediaExplorer.mg']);

;angular.module('mediaExplorer').service('ActiveTab', function ActiveTab(){
	
	var ActiveTab = this;
	ActiveTab.activeTab = 1;

	ActiveTab.changeActiveTab = function(tabNumber){
		ActiveTab.activeTab = tabNumber;
	}

	return ActiveTab;
});;angular.module('mediaExplorer').controller('GlobalController', 
	['$scope', 'ActiveTab', function($scope, ActiveTab){
	
	$scope.init = function(){
		$scope.activeTabService = ActiveTab;
	}

	$scope.init();
}]);
//;'use strict';

angular.module('dropzone', []);;'use strict';

angular.module('dropzone', []).directive('dropzone', function () {
	return function (scope, element, attrs) {
		Dropzone.autoDiscover = false;
		Dropzone.prototype.defaultOptions.dictDefaultMessage = "Drag files here to upload, or click to browse your computer.";
		Dropzone.prototype.defaultOptions.previewTemplate = 
		"<div class=\"dz-preview dz-file-preview\">\n" + 
			"<div class=\"dz-image\"><img data-dz-thumbnail /></div>\n" +
			"<div class=\"dz-details\">\n" + 
				"<div class=\"dz-size\">" + 
					"<span data-dz-size></span>" +
				"</div>\n    " +
				"<div class=\"dz-filename\">" + 
					"<span data-dz-name></span>" + 
				"</div>\n" + 
			"</div>\n" +
			"<div class=\"dz-progress\">" + 
				"<span class=\"dz-upload\" data-dz-uploadprogress></span>" +
			"</div>\n" +
			"<div class=\"dz-error-message\">" + 
				"<span data-dz-errormessage></span>" + 
			"</div>\n" +
			"<div class=\"dz-success-mark\">\n" + 
				"<svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n" +
					"<title>Check</title>\n" + 
					"<defs></defs>\n" + 
					"<g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n"+
						"<path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n" + 
					"</g>\n" + 
				"</svg>\n" +
			"</div>\n" + 
			"<div class=\"dz-error-mark\">\n" + 
				"<svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n" + 
					"<title>Error</title>\n" + 
					"<defs></defs>\n" + 
					"<g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n" +
						"<g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n" + 
							"<path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n" + 
						"</g>\n" +
					"</g>\n" +
				"</svg>\n" +
			"</div>\n" + 
			"<div class=\"dz-remove\" data-dz-remove>" + 
				"<span class=\"fa-stack\">" + 
					"<i class=\"fa fa-circle fa-stack-2x\"></i>" +
					"<i class=\"fa fa-times fa-stack-1x\"></i>" +
				"</span>" +
		"</div>";
		var config, dropzone;
		config = scope[attrs.dropzone];
		dropzone = new Dropzone(element[0], config.options);

		angular.forEach(config.eventHandlers, function (handler, event) {
			dropzone.on(event, handler);
		});
	};
});
//;'use strict';

angular.module('bootstrapLightbox', [
  'ngTouch',
  'ui.bootstrap',
  'chieffancypants.loadingBar',
  'ngSanitize',
]);
;angular.module('bootstrapLightbox').filter('unsafe', function($sce){
	return function(val){
		return $sce.trustAsHtml(val);
	};
});;/**
 * This attribute directive is used in an img element in the modal template in
 *   place of src. It handles resizing both the img element and its relevant
 *   parent elements within the modal.
 */
angular.module('bootstrapLightbox').directive('lightboxSrc', ['$window',
    'ImageLoader', 'Lightbox', function ($window, ImageLoader, Lightbox) {
  /**
   * Calculate the dimensions to display the image. The max dimensions
   *   override the min dimensions if they conflict.
   */
  var calculateImageDisplayDimensions = function (dimensions) {
    var w = dimensions.width;
    var h = dimensions.height;
    var minW = dimensions.minWidth;
    var minH = dimensions.minHeight;
    var maxW = dimensions.maxWidth;
    var maxH = dimensions.maxHeight;

    var displayW = w;
    var displayH = h;

    // resize the image if it is too small
    if (w < minW && h < minH) {
      // the image is both too thin and short, so compare the aspect ratios to
      // determine whether to min the width or height
      if (w / h > maxW / maxH) {
        displayH = minH;
        displayW = Math.round(w * minH / h);
      } else {
        displayW = minW;
        displayH = Math.round(h * minW / w);
      }
    } else if (w < minW) {
      // the image is too thin
      displayW = minW;
      displayH = Math.round(h * minW / w);
    } else if (h < minH) {
      // the image is too short
      displayH = minH;
      displayW = Math.round(w * minH / h);
    }

    // resize the image if it is too large
    if (w > maxW && h > maxH) {
      // the image is both too tall and wide, so compare the aspect ratios
      // to determine whether to max the width or height
      if (w / h > maxW / maxH) {
        displayW = maxW;
        displayH = Math.round(h * maxW / w);
      } else {
        displayH = maxH;
        displayW = Math.round(w * maxH / h);
      }
    } else if (w > maxW) {
      // the image is too wide
      displayW = maxW;
      displayH = Math.round(h * maxW / w);
    } else if (h > maxH) {
      // the image is too tall
      displayH = maxH;
      displayW = Math.round(w * maxH / h);
    }

    return {
      'width': displayW || 0,
      'height': displayH || 0 // NaN is possible when dimensions.width is 0
    };
  };

  // the dimensions of the image
  var imageWidth = 0;
  var imageHeight = 0;

  return {
    'link': function (scope, element, attrs) {
      // resize the img element and the containing modal
      var resize = function () {
        // get the window dimensions
        var windowWidth = $window.innerWidth;
        var windowHeight = $window.innerHeight;

        // calculate the max/min dimensions for the image
        var imageDimensionLimits = Lightbox.calculateImageDimensionLimits({
          'windowWidth': windowWidth,
          'windowHeight': windowHeight,
          'imageWidth': windowWidth * .75 - 30,
          'imageHeight': windowHeight * .75 - 30
        });

        // calculate the dimensions to display the image
        var imageDisplayDimensions = calculateImageDisplayDimensions(
          angular.extend({
            'width': imageWidth,
            'height': imageHeight,
            'minWidth': 1,
            'minHeight': 1,
            'maxWidth': windowWidth * 65,
            'maxHeight': 3000,
          }, imageDimensionLimits)
        );

        // calculate the dimensions of the modal container
        var modalDimensions = Lightbox.calculateModalDimensions({
          'windowWidth': windowWidth,
          'windowHeight': windowHeight,
          'imageDisplayWidth': imageDisplayDimensions.width,
          'imageDisplayHeight': imageDisplayDimensions.height
        });

        // resize the image
        element.css({
          'width': imageDisplayDimensions.width + 'px',
          'height': imageDisplayDimensions.height + 'px'
        });

        // setting the height on .modal-dialog does not expand the div with the
        // background, which is .modal-content
        angular.element(
          document.querySelector('.lightbox-modal .modal-dialog')
        ).css({
          // 'width': modalDimensions.width + 'px'
          'width': (windowWidth * .75) + 'px'
        });

        // .modal-content has no width specified; if we set the width on
        // .modal-content and not on .modal-dialog, .modal-dialog retains its
        // default width of 600px and that places .modal-content off center
        angular.element(
          document.querySelector('.lightbox-modal .modal-content')
        ).css({
          // 'height': modalDimensions.height + 'px'
          'height': (windowHeight * .75 * 1.25) + 'px'
        });
      };

      // load the new image whenever the attr changes
      scope.$watch(function () {
        return attrs.lightboxSrc;
      }, function (src) {
        // blank the image before resizing the element; see
        // http://stackoverflow.com/questions/5775469/whats-the-valid-way-to-include-an-image-with-no-src
        element[0].src = '//:0';

        ImageLoader.load(src).then(function (image) {
          // these variables must be set before resize(), as they are used in it
          imageWidth = image.naturalWidth;
          imageHeight = image.naturalHeight;

          // resize the img element and the containing modal
          resize();

          // show the image
          element[0].src = src;
        });
      });

      // resize the image and modal whenever the window gets resized
      angular.element($window).on('resize', resize);
    }
  };
}]);
;angular.module('bootstrapLightbox').provider('Lightbox', function () {
  /**
   * Template URL passed into $modal.open().
   * @type {String}
   */
  this.templateUrl = '/static/partials/media_explorer/lightbox.html';

  /**
   * @param  {*}      image An element in the array of images.
   * @return {String}       The URL of the given image.
   */
  this.getImageUrl = function (element) {
  	if(element.type == 'image'){
    	return element.image_url;
  	}else{
      return element.thumbnail_image_url;
  	}
  };

  /**
   * @param  {*}      image An element in the array of images.
   * @return {String}       The caption of the given image.
   */
  this.getImageCaption = function (element) {
    return element.description;
  };

  this.getVideoEmbed = function(element){
    return element.video_embed;
  }
  /**
   * Calculate the max and min limits to the width and height of the displayed
   *   image (all are optional). The max dimensions override the min
   *   dimensions if they conflict.
   * @param  {Object} dimensions Contains the properties windowWidth,
   *   windowHeight, imageWidth, imageHeight.
   * @return {Object} May optionally contain the properties minWidth,
   *   minHeight, maxWidth, maxHeight.
   */
  this.calculateImageDimensionLimits = function (dimensions) {
    if (dimensions.windowWidth >= 768) {
      return {
        // 92px = 2 * (30px margin of .modal-dialog
        //             + 1px border of .modal-content
        //             + 15px padding of .modal-body)
        // with the goal of 30px side margins; however, the actual side margins
        // will be slightly less (at 22.5px) due to the vertical scrollbar
        'maxWidth': (dimensions.windowWidth * .75) - 92,
        // 126px = 92px as above
        //         + 34px outer height of .lightbox-nav
        'maxHeight': (dimensions.windowHeight * .75) - 126
      };
    } else {
      return {
        // 52px = 2 * (10px margin of .modal-dialog
        //             + 1px border of .modal-content
        //             + 15px padding of .modal-body)
        'maxWidth': (dimensions.windowWidth * .75) - 52,
        // 86px = 52px as above
        //        + 34px outer height of .lightbox-nav
        'maxHeight': (dimensions.windowHeight * .75) - 86
      };
    }
  };

  /**
   * Calculate the width and height of the modal. This method gets called
   *   after the width and height of the image, as displayed inside the modal,
   *   are calculated.
   * @param  {Object} dimensions Contains the properties windowWidth,
   *   windowHeight, imageDisplayWidth, imageDisplayHeight.
   * @return {Object} Must contain the properties width and height.
   */
  this.calculateModalDimensions = function (dimensions) {
    // 400px = arbitrary min width
    // 32px = 2 * (1px border of .modal-content
    //             + 15px padding of .modal-body)
    var width = Math.max(640, dimensions.imageDisplayWidth + 32);

    // 200px = arbitrary min height
    // 66px = 32px as above
    //        + 34px outer height of .lightbox-nav
    var height = Math.max(375, dimensions.imageDisplayHeight + 66);

    // first case:  the modal width cannot be larger than the window width
    //              20px = arbitrary value larger than the vertical scrollbar
    //                     width in order to avoid having a horizontal scrollbar
    // second case: Bootstrap modals are not centered below 768px
    if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
      width = 'auto';
    }

    // the modal height cannot be larger than the window height
    if (height >= dimensions.windowHeight) {
      height = 'auto';
    }

    return {
      'width': width,
      'height': height
    };
  };

  this.$get = ['$document', '$modal', '$timeout', 'cfpLoadingBar',
      'ImageLoader', function ($document, $modal, $timeout, cfpLoadingBar,
      ImageLoader) {
    // array of all images to be shown in the lightbox (not Image objects)
    var images = [];

    // the index of the image currently shown (Lightbox.image)
    var index = -1;

    /**
     * The service object for the lightbox.
     * @type {Object}
     */
    var Lightbox = {};

    // set the configurable properties and methods, the defaults of which are
    // defined above
    Lightbox.templateUrl = this.templateUrl;
    Lightbox.getImageUrl = this.getImageUrl;
    Lightbox.getImageCaption = this.getImageCaption;
    Lightbox.getVideoEmbed = this.getVideoEmbed;
    Lightbox.calculateImageDimensionLimits = this.calculateImageDimensionLimits;
    Lightbox.calculateModalDimensions = this.calculateModalDimensions;

    /**
     * Whether keyboard navigation is currently enabled for navigating through
     *   images in the lightbox.
     * @type {Boolean}
     */
    Lightbox.keyboardNavEnabled = false;

    /**
     * The current image.
     * @type {*}
     */
    Lightbox.image = {};

    /**
     * The modal instance.
     * @type {*}
     */
    Lightbox.modalInstance = null;

    /**
     * The URL of the current image. This is a property of the service rather
     *   than of Lightbox.image because Lightbox.image need not be an object,
     *   and besides it would be poor practice to alter the given objects.
     * @type {String}
     */
    // Lightbox.imageUrl = '';

    /**
     * The caption of the current image. See the description of
     *   Lightbox.imageUrl.
     * @type {String}
     */
    // Lightbox.imageCaption = '';

    /**
     * Open the lightbox modal.
     * @param  {Array}  newImages An array of images. Each image may be of any
     *   type.
     * @param  {Number} newIndex  The index in newImages to set as the current
     *   image.
     * @return {Object} A [modal instance]{@link
     *   http://angular-ui.github.io/bootstrap/#/modal}.
     */
    Lightbox.openModal = function (newImages, newIndex) {
      images = newImages;
      Lightbox.setImage(newIndex);

      // store the modal instance so we can close it manually if we need to
      Lightbox.modalInstance = $modal.open({
        'templateUrl': Lightbox.templateUrl,
        'controller': ['$scope', function ($scope) {
          // $scope is the modal scope, a child of $rootScope
          $scope.Lightbox = Lightbox;

          Lightbox.keyboardNavEnabled = true;
        }],
        'windowClass': 'lightbox-modal'
      });

      // modal close handler
      Lightbox.modalInstance.result['finally'](function () {
        // prevent the lightbox from flickering from the old image when it gets
        // opened again
        Lightbox.image = {};
        Lightbox.imageUrl = null;
        Lightbox.imageCaption = null;
        lightbox.videoEmbed = null;
        Lightbox.keyboardNavEnabled = false;

        // complete any lingering loading bar progress
        cfpLoadingBar.complete();
      });

      return Lightbox.modalInstance;
    };

    /**
     * Close the lightbox modal.
     * @param {*} result This argument can be useful if the modal promise gets
     *   handler(s) attached to it.
     */
    Lightbox.closeModal = function (result) {
      return Lightbox.modalInstance.close(result);
    };

    /**
     * This method can be used in all methods which navigate/change the
     *   current image.
     * @param {Number} newIndex The index in the array of images to set as the
     *   new current image.
     */
    Lightbox.setImage = function (newIndex) {
      if (!(newIndex in images)) {
        throw 'Invalid image.';
      }

      cfpLoadingBar.start();

      var success = function () {
        index = newIndex;
        Lightbox.image = images[index];
        cfpLoadingBar.complete();
      };

      var imageUrl = Lightbox.getImageUrl(images[newIndex]);
      var videoEmbed = Lightbox.getVideoEmbed(images[newIndex]);

      // load the image before setting it, so everything in the view is updated
      // at the same time; otherwise, the previous image remains while the
      // current image is loading
      ImageLoader.load(imageUrl).then(function () {
        success();

        // set the url and caption
        Lightbox.imageUrl = imageUrl;
        Lightbox.imageCaption = Lightbox.getImageCaption(Lightbox.image);
        Lightbox.videoEmbed = videoEmbed
      }, function () {
        success();

        // blank image
        Lightbox.imageUrl = '//:0';
        // use the caption to show the user an error
        Lightbox.imageCaption = 'Failed to load element';
      });
    };

    /**
     * Navigate to the first image.
     */
    Lightbox.firstImage = function () {
      Lightbox.setImage(0);
    };

    /**
     * Navigate to the previous image.
     */
    Lightbox.prevImage = function () {
      Lightbox.setImage((index - 1 + images.length) % images.length);
    };

    /**
     * Navigate to the next image.
     */
    Lightbox.nextImage = function () {
      Lightbox.setImage((index + 1) % images.length);
    };

    /**
     * Navigate to the last image.
     */
    Lightbox.lastImage = function () {
      Lightbox.setImage(images.length - 1);
    };

    /**
     * Call this method to set both the array of images and the current image
     *   (based on the current index). A use case is when the image collection
     *   gets changed dynamically in some way while the lightbox is still open.
     * @param {Array} newImages The new array of images.
     */
    Lightbox.setImages = function (newImages) {
      images = newImages;
      Lightbox.setImage(index);
    };

    /**
     * Bind the left and right arrow keys for image navigation. This event
     *   handler never gets unbinded. Disable this using the
     *   keyboardNavEnabled flag. It is automatically disabled when
     *   the target is an input and or a textarea.
     */
    $document.bind('keydown', function (event) {
      if (!Lightbox.keyboardNavEnabled) {
        return;
      }

      // method of Lightbox to call
      var method = null;

      switch (event.which) {
      case 39: // right arrow key
        method = 'nextImage';
        break;
      case 37: // left arrow key
        method = 'prevImage';
        break;
      }

      if (method !== null && ['input', 'textarea'].indexOf(
          event.target.tagName.toLowerCase()) === -1) {
        // the view doesn't update without a manual digest
        $timeout(function () {
          Lightbox[method]();
        });

        event.preventDefault();
      }
    });

    return Lightbox;
  }];
});
;angular.module('bootstrapLightbox').service('ImageLoader', ['$q',
    function ($q) {
  /**
   * Load the image at the given URL.
   * @param  {String}  url
   * @return {Promise} A $q promise that resolves when the image has loaded
   *   successfully.
   */
  this.load = function (url) {
    var deferred = $q.defer();

    var image = new Image();

    // when the image has loaded
    image.onload = function () {
      // check image properties for possible errors
      if ((typeof this.complete === 'boolean' && this.complete === false) ||
          (typeof this.naturalWidth === 'number' && this.naturalWidth === 0)) {
        deferred.reject();
      }

      deferred.resolve(image);
    };

    // when the image fails to load
    image.onerror = function () {
      deferred.reject();
    };

    // start loading the image
    image.src = url;

    return deferred.promise;
  };
}]);

//;'use strict';

angular.module('mediaExplorer.images', ['ui.bootstrap', 'dropzone', 'bootstrapLightbox', 'mediaExplorer.mg']);;angular.module('mediaExplorer.images').run(['$http', function($http){
	$http.defaults.headers.common["X-CSRFToken"] = getCookie('csrftoken');
	$http.defaults.headers.common["Content-Type"] = 'application/x-www-form-urlencoded';
}]);'use strict';

angular.module('mediaExplorer.images').directive('imagetab', function(){
	return{
		restrict: 'E',
		controller: 'ImagesController',
		scope: true,
		replace: true,		
		transclude: true,
		templateUrl: '/static/partials/media_explorer/imagetab.html'
	}
});angular.module('mediaExplorer.images').filter('startFrom', function() {
	return function(input, start) {
		start = parseInt(start, 10) //parse to int
		if(start){
			return input.slice(start);
		}else{
			return  input
		}
	}
});;'use strict';

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

});;'use strict';

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
}]);;'use strict';

angular.module('mediaExplorer.images').controller('DropzoneImageController', function ($scope) {
	$scope.imageDropzoneConfig = {
		'options': {
			'paramName': 'image',
			'headers': {"X-CSRFToken": getCookie('csrftoken')},
			'url': '/api/media/elements',
			'parallelUploads': 1,
		},
		'eventHandlers': {
			'sending': function (file, xhr, formData) {
			},
			'success': function (file, response) {
				$scope.imageService.getImagesByPage($scope.imageService.currentPage);
				$scope.imageService.getImageStats();
			},
			'processing': function(file){
				uploadInProgressState(true);
			},
			'queuecomplete': function(response){
				uploadInProgressState(false);
			}
		}
	};
});
//;'use strict';

angular.module('mediaExplorer.videos', ['ui.bootstrap', 'bootstrapLightbox', 'mediaExplorer.mg']);;angular.module('mediaExplorer.videos').run(['$http', function($http){
	$http.defaults.headers.common["X-CSRFToken"] = getCookie('csrftoken');
	// $http.defaults.headers.common["Content-Type"] = 'application/x-www-form-urlencoded';
}]);'use strict';

angular.module('mediaExplorer.videos').directive('videotab', function(){
	return{
		restrict: 'E',
		controller: 'VideosController',
		scope: true,
		replace: true,
		transclude: true,
		templateUrl: '/static/partials/media_explorer/videotab.html'
	}
});'use strict';

angular.module('mediaExplorer.videos').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);;angular.module('mediaExplorer.videos').filter('startFrom', function() {
    return function(input, start) {
        start = parseInt(start, 10) //parse to int
        if(start){
        	return input.slice(start);
        }else{
        	return  input
        }
    }
});;angular.module('mediaExplorer.videos').service('Videos', function Videos($http, $q){
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
;'use strict';

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

//;'use strict';

angular.module('mediaExplorer.mg', ['ui.bootstrap', 'ui.sortable', 'bootstrapLightbox']);;angular.module('mediaExplorer.mg').run(['$http', function($http){
	$http.defaults.headers.common["X-CSRFToken"] = getCookie('csrftoken');
	// $http.defaults.headers.common["Content-Type"] = 'application/x-www-form-urlencoded';
}]);'use strict';

angular.module('mediaExplorer.mg').directive('mgtab', function(){
	return{
		restrict: 'E',
		controller: 'MGController',
		scope: true,
		replace: true,
		transclude: true,
		templateUrl: '/static/partials/media_explorer/mgtab.html'
	}
});'use strict';

angular.module('mediaExplorer.mg').directive('newmg', function(){
	return{
		restrict: 'E',
		controller: 'MGController',
		scope: false,
		replace: true,
		transclude: true,
		templateUrl: '/static/partials/media_explorer/newmg.html'
	}
});angular.module('mediaExplorer.mg').filter('startFrom', function() {
	return function(input, start) {
		start = parseInt(start, 10) //parse to int
		if(start){
			return input.slice(start);
		}else{
			return  input
		}
	}
});;'use strict';

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
});;'use strict';

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
//
//# sourceMappingURL=app.js.map