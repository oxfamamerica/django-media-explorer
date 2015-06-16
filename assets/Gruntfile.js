module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass:{
			dist:{
				files:{
					'css/media_explorer/stylesheets/main.css' : 'css/media_explorer/scss/main.scss'
				},
				options:{
					sourcemap: 'auto',
				}
			}
		},
		concat:{
			options:{
				separator: ';',
				sourceMap: true,
				sourceMapStyle: 'link',
			},
			angularglobal:{
				src: ['js/media_explorer/angular/global/global.module.js', 'js/media_explorer/angular/global/global.activetab.service.js', 'js/media_explorer/angular/global/global.controller.js'],
				dest: 'js/media_explorer/angular/app/app.global.js'
			},
			angulardropzone:{
				src: ['js/media_explorer/angular/dropzone/dropzone.module.js', 'js/media_explorer/angular/dropzone/dropzone.directive.js'],
				dest: 'js/media_explorer/angular/app/app.dropzone.js'
			},
			angularlightbox:{
				src: ['js/media_explorer/angular/lightbox/lightbox.module.js', 'js/media_explorer/angular/lightbox/lightbox.htmlfilter.js', 'js/media_explorer/angular/lightbox/lightbox.directive.js', 'js/media_explorer/angular/lightbox/lightbox.service.js', 'js/media_explorer/angular/lightbox/lightbox.imageloader.service.js'],
				dest: 'js/media_explorer/angular/app/app.lightbox.js'	
			},
			angularimages:{
				src: ['js/media_explorer/angular/images/images.module.js', 'js/media_explorer/angular/images/images.run.js', 'js/media_explorer/angular/images/images.imagetab.directive.js', 'js/media_explorer/angular/images/images.startfrom.filter.js', 'js/media_explorer/angular/images/images.service.js', 'js/media_explorer/angular/images/images.controller.js', 'js/media_explorer/angular/images/images.dropzone.controller.js'],
				dest: 'js/media_explorer/angular/app/app.images.js'
			},
			angularvideos:{
				src: ['js/media_explorer/angular/videos/videos.module.js', 'js/media_explorer/angular/videos/videos.run.js', 'js/media_explorer/angular/videos/videos.videotab.directive.js', 'js/media_explorer/angular/videos/videos.filemodel.directive.js', 'js/media_explorer/angular/videos/videos.startfrom.filter.js', 'js/media_explorer/angular/videos/videos.service.js', 'js/media_explorer/angular/videos/videos.controller.js'],
				dest: 'js/media_explorer/angular/app/app.videos.js'
			},
			angularmg:{
				src: ['js/media_explorer/angular/mg/mg.module.js', 'js/media_explorer/angular/mg/mg.run.js', 'js/media_explorer/angular/mg/mg.mgtab.directive.js', 'js/media_explorer/angular/mg/mg.newmg.directive.js', 'js/media_explorer/angular/mg/mg.startfrom.filter.js', 'js/media_explorer/angular/mg/mg.service.js', 'js/media_explorer/angular/mg/mg.controller.js'],
				dest: 'js/media_explorer/angular/app/app.mg.js'
			},
			angular:{
				src:['js/media_explorer/angular/app/app.global.js', 'js/media_explorer/angular/app/app.dropzone.js', 'js/media_explorer/angular/app/app.lightbox.js', 'js/media_explorer/angular/app/app.images.js', 'js/media_explorer/angular/app/app.videos.js', 'js/media_explorer/angular/app/app.mg.js'],
				dest: 'js/media_explorer/angular/app/app.js'
			},
			vendor:{
				src: ['js/media_explorer/vendor/jquery/jquery-2.1.3.min.js', 'js/media_explorer/vendor/jquery-ui/jquery-ui.min.js', 'js/media_explorer/vendor/angularjs/angular.min.js', 'js/media_explorer/vendor/angular-sanitize/angular-sanitize.min.js', 'js/media_explorer/vendor/angular-loading-bar/loading-bar.min.js', 'js/media_explorer/vendor/angular-touch/angular-touch.min.js', 'js/media_explorer/vendor/ui-bootstrap/ui-bootstrap-custom-tpls-0.12.0.min.js', 'js/media_explorer/vendor/ui-sortable/ui-sortable.min.js', 'js/media_explorer/vendor/dropzonejs/dropzone.min.js'],
				dest: 'js/media_explorer/vendor/vendor.js'
			}
		},
		cssmin:{
			options:{
				shorthandCompacting: false,
    			roundingPrecision: -1,
				sourceMap: true,
				keepSpecialComments: 0
			},
			target:{
				files:{
					'css/media_explorer/stylesheets/main.min.css': ['css/media_explorer/stylesheets/main.css']
				}
			}
		},
		uglify:{
			options:{
				mangle: false
			},
			my_target:{
				files:{
					'js/media_explorer/angular/app/app.min.js': ['js/media_explorer/angular/app/app.js']
				}
			}
		},
		watch:{
			css:{
				files: 'css/media_explorer/scss/**/*.scss',
				tasks: ['sass', 'cssmin']
			},
			angularglobal:{
				files: 'js/media_explorer/angular/global/*.js',
				tasks: ['concat:angularglobal','concat:angular', 'uglify']
			},
			angulardropzone:{
				files: 'js/media_explorer/angular/dropzone/*.js',
				tasks: ['concat:angulardropzone', 'concat:angular', 'uglify']
			},
			angularlightbox:{
				files: 'js/media_explorer/angular/lightbox/*.js',
				tasks: ['concat:angularlightbox', 'concat:angular', 'uglify']
			},
			angularimages:{
				files: 'js/media_explorer/angular/images/*.js',
				tasks: ['concat:angularimages', 'concat:angular', 'uglify']
			},
			angularvideos:{
				files: 'js/media_explorer/angular/videos/*.js',
				tasks: ['concat:angularvideos', 'concat:angular', 'uglify']
			},
			angularmg:{
				files: 'js/media_explorer/angular/mg/*.js',
				tasks: ['concat:angularmg', 'concat:angular', 'uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['watch']);
}