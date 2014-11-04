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
			yossarian: {	
				files: {
					'public/scripts/yossarian.js': [
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

		uglify: {
			build: {
				src: 'public/scripts/yossarian.js',
				dest: 'public/scripts/yossarian.min.js'
			},
			options: {
				mangle: false
			}
		},

		watch: {
			scripts: {
				files: ['public/scripts/src/*.js'],
				tasks: ['ngAnnotate', 'uglify'],
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
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['less', 'ngAnnotate', 'uglify', 'watch']);
};
