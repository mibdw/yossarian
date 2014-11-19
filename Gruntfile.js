module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			development: {
				options: {
					compress: true,
				},
				files: {
					"public/styles/yossarian.min.css": "styles/main.less"
				}
			}
		},

		ngAnnotate: {
			prod: {	
				files: {
					'public/scripts/src/prod.js': [
						'public/scripts/libs/angular/angular.min.js',
						'public/scripts/libs/angular/angular-route.min.js',
						'public/scripts/libs/angular/angular-cookies.min.js',
						'public/scripts/libs/angular/angular-sanitize.min.js',
						'public/scripts/src/global.js', 
						'public/scripts/src/dashboard.js', 
						'public/scripts/src/docs.js', 
						'public/scripts/src/calendar.js', 
						'public/scripts/src/projects.js', 
						'public/scripts/src/relations.js', 
						'public/scripts/src/settings.js'
					]
				}
			}
		},

		concat: {
			yossarian: {
				src: [
					'public/scripts/libs/jquery-1.11.1.js', 
					'public/scripts/libs/jquery-ui.js', 
					'public/scripts/libs/moment-with-locales.js', 
					'public/scripts/libs/fullcalendar.js',
					'public/scripts/src/prod.js', 
				],
				dest: 'public/scripts/yossarian.js',
			},
		},

		uglify: {
			yossarian: {
				src: 'public/scripts/yossarian.js',
				dest: 'public/scripts/yossarian.min.js'
			},
			options: {
				mangle: false
			}
		},

		watch: {
			scripts: {
				files: [
					'public/scripts/src/*.js', 
					'public/scripts/libs/*.js', 
					'public/scripts/libs/angular/*.js'
				],
				tasks: ['ngAnnotate', 'concat'],
				options: {
					spawn: false,
				},
			},
			styles: {
				files: ['styles/*.less'],
				tasks: ['less'],
				options: {
					nospawn: true,
				},
			} 
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['less', 'ngAnnotate', 'concat', 'uglify', 'watch']);
};
