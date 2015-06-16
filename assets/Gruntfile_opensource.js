module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass:{
			dist:{
				files:{
					'css/stylesheets/main.css' : 'css/scss/main.scss'
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
				src: ['js/angular/global/global.module.js', 'js/angular/global/global.activetab.service.js', 'js/angular/global/global.controller.js'],
				dest: 'js/angular/app/app.global.js'
			},
			angulardropzone:{
				src: ['js/angular/dropzone/dropzone.module.js', 'js/angular/dropzone/dropzone.directive.js'],
				dest: 'js/angular/app/app.dropzone.js'
			},
			angularlightbox:{
				src: ['js/angular/lightbox/lightbox.module.js', 'js/angular/lightbox/lightbox.htmlfilter.js', 'js/angular/lightbox/lightbox.directive.js', 'js/angular/lightbox/lightbox.service.js', 'js/angular/lightbox/lightbox.imageloader.service.js'],
				dest: 'js/angular/app/app.lightbox.js'	
			},
			angularimages:{
				src: ['js/angular/images/images.module.js', 'js/angular/images/images.run.js', 'js/angular/images/images.imagetab.directive.js', 'js/angular/images/images.startfrom.filter.js', 'js/angular/images/images.service.js', 'js/angular/images/images.controller.js', 'js/angular/images/images.dropzone.controller.js'],
				dest: 'js/angular/app/app.images.js'
			},
			angularvideos:{
				src: ['js/angular/videos/videos.module.js', 'js/angular/videos/videos.run.js', 'js/angular/videos/videos.videotab.directive.js', 'js/angular/videos/videos.filemodel.directive.js', 'js/angular/videos/videos.startfrom.filter.js', 'js/angular/videos/videos.service.js', 'js/angular/videos/videos.controller.js'],
				dest: 'js/angular/app/app.videos.js'
			},
			angularmg:{
				src: ['js/angular/mg/mg.module.js', 'js/angular/mg/mg.run.js', 'js/angular/mg/mg.mgtab.directive.js', 'js/angular/mg/mg.newmg.directive.js', 'js/angular/mg/mg.startfrom.filter.js', 'js/angular/mg/mg.service.js', 'js/angular/mg/mg.controller.js'],
				dest: 'js/angular/app/app.mg.js'
			},
			angular:{
				src:['js/angular/app/app.global.js', 'js/angular/app/app.dropzone.js', 'js/angular/app/app.lightbox.js', 'js/angular/app/app.images.js', 'js/angular/app/app.videos.js', 'js/angular/app/app.mg.js'],
				dest: 'js/angular/app/app.js'
			},
			vendor:{
				src: ['js/vendor/jquery/jquery-2.1.3.min.js', 'js/vendor/jquery-ui/jquery-ui.min.js', 'js/vendor/angularjs/angular.min.js', 'js/vendor/angular-sanitize/angular-sanitize.min.js', 'js/vendor/angular-loading-bar/loading-bar.min.js', 'js/vendor/angular-touch/angular-touch.min.js', 'js/vendor/ui-bootstrap/ui-bootstrap-custom-tpls-0.12.0.min.js', 'js/vendor/ui-sortable/ui-sortable.min.js', 'js/vendor/dropzonejs/dropzone.min.js'],
				dest: 'js/vendor/vendor.js'
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
					'css/stylesheets/main.min.css': ['css/stylesheets/main.css']
				}
			}
		},
		uglify:{
			options:{
				mangle: false
			},
			my_target:{
				files:{
					'js/angular/app/app.min.js': ['js/angular/app/app.js']
				}
			}
		},
		watch:{
			css:{
				files: 'css/scss/**/*.scss',
				tasks: ['sass', 'cssmin']
			},
			angularglobal:{
				files: 'js/angular/global/*.js',
				tasks: ['concat:angularglobal','concat:angular', 'uglify']
			},
			angulardropzone:{
				files: 'js/angular/dropzone/*.js',
				tasks: ['concat:angulardropzone', 'concat:angular', 'uglify']
			},
			angularlightbox:{
				files: 'js/angular/lightbox/*.js',
				tasks: ['concat:angularlightbox', 'concat:angular', 'uglify']
			},
			angularimages:{
				files: 'js/angular/images/*.js',
				tasks: ['concat:angularimages', 'concat:angular', 'uglify']
			},
			angularvideos:{
				files: 'js/angular/videos/*.js',
				tasks: ['concat:angularvideos', 'concat:angular', 'uglify']
			},
			angularmg:{
				files: 'js/angular/mg/*.js',
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