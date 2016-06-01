// Generated on 2015-09-05 using generator-pts 0.1.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Automatically load required Grunt tasks
	require('jit-grunt')(grunt, {
		useminPrepare : 'grunt-usemin',
		cdnify : 'grunt-google-cdn',
		processhtml: 'grunt-processhtml',
		exec: 'grunt-exec',
		removeLoggingCalls: 'grunt-remove-logging-calls'
	});

	// Configurable paths for the application
	var appConfig = {
		name : require('./bower.json').name || 'Application',
		app : require('./bower.json').appPath || 'app',
		dist : grunt.option('target') || 'dist',
		version : require('./bower.json').version || '1.0.0'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		yeoman : appConfig,

		// Watches files for changes and runs tasks based on the changed files
		watch : {
			bower : {
				files : ['bower.json'],
				tasks : ['bowerRequirejs']
			},
			js : {
				files : ['<%= yeoman.app %>/**/{,*/}*.js'],
				tasks : ['newer:uglify:<%= yeoman.app.dist %>'],
				options: {
			        spawn: false,
		      	},
			},
			jsTest : {
				files : ['test/spec/{,*/}*.js'],
				tasks : ['newer:jshint:test', 'newer:jscs:test', 'karma']
			},
			gruntfile : {
				files : ['Gruntfile.js']
			},
			less : {
				files : ['<%= yeoman.app %>/styles-less/**/*'],
				tasks : ['less:development']
			},
			livereload : {
				options : {
					livereload : '<%= connect.options.livereload %>'
				},
				files : ['<%= yeoman.app %>/{,*/}*.html', '.tmp/styles/{,*/}*.css', '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}']
			}
		},

		// The actual grunt server settings
		connect : {
			options : {
				port : 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname : 'localhost',
				livereload : 35729
			},
			livereload : {
				options : {
					open : true,
					middleware : function(connect) {
						return [connect.static('.tmp'), connect().use('/bower_components', connect.static('./bower_components')), connect().use('/app/styles', connect.static('./app/styles')), connect.static(appConfig.app)];
					}
				}
			},
			test : {
				options : {
					port : 9001,
					middleware : function(connect) {
						return [connect.static('.tmp'), connect.static('test'), connect().use('/bower_components', connect.static('./bower_components')), connect.static(appConfig.app)];
					}
				}
			},
			dist : {
				options : {
					open : true,
					base : '<%= yeoman.dist %>'
				}
			}
		},

		processhtml : {
			cordova : {
				options : {
					data : {
						message : 'This is frontend environment'
					}
				},
				files : [{
					expand : true,
					cwd : '<%= yeoman.dist %>',
					src : '*.html',
					dest : '<%= yeoman.dist %>'
				}]
			},
			ios : {
				options : {
					data : {
						message : 'This is ios environment'
					}
				},
				files : [{
					expand : true,
					cwd : '<%= yeoman.dist %>',
					src : '*.html',
					dest : '<%= yeoman.dist %>'
				}]
			},
			dist : {
				options : {
					data : {
						message : 'This is backend environment'
					}
				},
				files : [{
					expand : true,
					cwd : '<%= yeoman.app %>',
					src : '*.html',
					dest : '<%= yeoman.dist %>'
				}]
			}
		},
		// Make sure there are no obvious mistakes
		jshint : {
			options : {
				jshintrc : '.jshintrc',
				reporter : require('jshint-stylish')
			},
			all : {
				src : ['Gruntfile.js', '<%= yeoman.app %>/**/{,*/}*.js']
			},
			test : {
				options : {
					jshintrc : 'test/.jshintrc'
				},
				src : ['test/spec/{,*/}*.js']
			}
		},
		jscs : {
			options : {
				config : '.jscsrc',
				verbose : true
			},
			all : {
				src : ['Gruntfile.js', '<%= yeoman.app %>/scripts/{,*/}*.js']
			},
			test : {
				src : ['test/spec/{,*/}*.js']
			}
		},
		clean : {
			dist : {
				files : [{
					dot : true,
					src : ['.tmp', '<%= yeoman.dist %>/{,*/}*', '!<%= yeoman.dist %>/.git{,*/}*']
				}]
			},
			server : '.tmp'
		},
		removeLoggingCalls: {
			// the files inside which you want to remove the console statements 
	 		files: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
	 		options: {
	 			// an array of method names to remove 
				methods: ['log', 'info', 'assert'], 
				
				// replacement strategy 
				strategy: function(consoleStatement) {
					// comments console calls statements 
					// return '/* ' + consoleStatement + '*/';
		 
					return ''; // to remove  
				}
			}
		},

		// Add vendor prefixed styles
		postcss : {
			options : {
				processors : [require('autoprefixer-core')({
					browsers : ['last 1 version']
				})]
			},
			server : {
				options : {
					map : true
				},
				files : [{
					expand : true,
					cwd : '.tmp/styles/',
					src : '{,*/}*.css',
					dest : '.tmp/styles/'
				}]
			},
			dist : {
				files : [{
					expand : true,
					cwd : '.tmp/styles/',
					src : '{,*/}*.css',
					dest : '.tmp/styles/'
				}]
			}
		},
		// Renames files for browser caching purposes
		filerev : {
			dist : {
				src : ['<%= yeoman.dist %>/scripts/{,*/}*.js', '<%= yeoman.dist %>/styles/{,*/}*.css', '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}', '<%= yeoman.dist %>/styles/fonts/*']
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare : {
			html : '<%= yeoman.app %>/index.html',
			options : {
				dest : '<%= yeoman.dist %>',
				flow : {
					html : {
						steps : {
							js : ['concat', 'uglifyjs'],
							css : ['cssmin']
						},
						post : {}
					}
				}
			}
		},

		// Performs rewrites based on filerev and the useminPrepare configuration
		usemin : {
			html : ['<%= yeoman.dist %>{,*/}*.html'],
			css : ['<%= yeoman.dist %>{,*/}*.css'],
			js : ['<%= yeoman.dist %>{,*/}*.js'],
			options : {
				assetsDirs : ['<%= yeoman.dist %>', '<%= yeoman.dist %>', '<%= yeoman.dist %>'],
				patterns : {
					js : [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
				}
			}
		},

		// The following *-min tasks will produce minified files in the dist folder
		// By default, your `index.html`'s <!-- Usemin block --> will take care of
		// minification. These next options are pre-configured if you do not wish
		// to use the Usemin blocks.

		cssmin : {
			dist : {
				files : [{
					expand : true,
					cwd : '<%= yeoman.app %>',
					src : ['**/*.css', '!**/*.min.css'],
					dest : '<%= yeoman.dist %>'
				}]
			}
		},
		uglify : {
			dist : {
				// options : {
					// // banner: banner.minified,
					// sourceMap : true,
					// // sourceMappingURL: name + "<%= versionSuffix %>.min.map",
					// beautify : {
						// ascii_only : true
					// }
				// },
				files : [{
					expand : true,
					cwd : '<%= yeoman.dist %>',
					src : '**/*.js',
					dest : '<%= yeoman.dist %>'
				}]
			}
		},
		imagemin : {
			dist : {
				files : [{
					expand : true,
					cwd : '<%= yeoman.app %>/images',
					src : '{,*/}*.{png,jpg,jpeg,gif}',
					dest : '<%= yeoman.dist %>/images'
				}]
			}
		},

		svgmin : {
			dist : {
				files : [{
					expand : true,
					cwd : '<%= yeoman.app %>/images',
					src : '{,*/}*.svg',
					dest : '<%= yeoman.dist %>/images'
				}]
			}
		},

		htmlmin : {
			dist : {
				options : {
					collapseWhitespace : true,
					conservativeCollapse : true,
					collapseBooleanAttributes : true,
					removeCommentsFromCDATA : true
				},
				files : [{
					expand : true,
					cwd : '<%= yeoman.dist %>',
					src : ['*.html'],
					dest : '<%= yeoman.dist %>'
				}]
			},
			ios : {
				options : {
					collapseWhitespace : true,
					conservativeCollapse : true,
					collapseBooleanAttributes : true,
					removeCommentsFromCDATA : true
				},
				files : [{
					expand : true,
					cwd : '<%= yeoman.dist %>',
					src : ['*.html'],
					dest : '<%= yeoman.dist %>'
				}]
			}
			
		},
		// Replace Google CDN references
		cdnify : {
			dist : {
				html : ['<%= yeoman.dist %>/*.html']
			}
		},

		// Copies remaining files to places other tasks can use
		copy : {
			dist : {
				files : [{
					expand : true,
					dot : true,
					cwd : '<%= yeoman.app %>',
					dest : '<%= yeoman.dist %>',
					src : ['*.{ico,png,txt}', '.htaccess', '*.html', 'images/{,*/}*.{webp}', "**/**/*", 'libs/**/*', 'app/app.js', 'favicon.ico']
				}, {
					expand : true,
					cwd : '.tmp/images',
					dest : '<%= yeoman.dist %>/images',
					src : ['generated/*']
				}]
			},
			ios : {
				files : [{
					expand : true,
					dot : true,
					cwd : '<%= yeoman.app %>',
					dest : '<%= yeoman.dist %>',
					src : ['*.{ico,png,txt}', '.htaccess', '*.html', 'images/{,*/}*.{webp}', "**/**/*", 'libs/**/*', 'app/app.js', 'favicon.ico', '!**/tos.html', '!**/register_company.html', '!**/tos.js', '!**/register_company.js']
				}, {
					expand : true,
					cwd : '.tmp/images',
					dest : '<%= yeoman.dist %>/images',
					src : ['generated/*']
				}]
			},

			bootstrap : {
				expand : true,
				cwd : '<%= yeoman.app %>/vendor/bootstrap/less/',
				src : '{,*/}*',
				dest : '<%= yeoman.app %>/styles-less/bootstrap-less'
			},

			styles : {
				expand : true,
				cwd : '<%= yeoman.app %>/styles',
				dest : '.tmp/styles/',
				src : '{,*/}*.css'
			}
		},
		exec: {
		  buildios: {
		    command: 'phonegap build ios'
		  },
		  buildandroid: {
		    command: 'phonegap build android'
		  }
		},

		// Run some tasks in parallel to speed up the build process
		concurrent : {
			server : ['copy:styles'],
			test : ['copy:styles'],
			dist : ['copy:bootstrap', 'imagemin', 'svgmin']
		},

		// Test settings
		karma : {
			unit : {
				configFile : 'test/karma.conf.js',
				singleRun : true
			}
		}
	});

	grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
		console.log('The `server` task is build with type: ' + target);
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}else if (target === 'ios') {
			return grunt.task.run(['buildios', 'connect:dist:keepalive']);
		}else if (target === 'cordova') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}
		grunt.task.run(['clean:server', 'concurrent:server', 'postcss:server', 'connect:livereload', 'watch']);
	});
	
	grunt.registerTask('serve-dev', 'Compile without minfile then start a connect web server', function(target) {
		console.log('The `dev` task is build with type: ' + target);
		if (target === 'dist') {
			return grunt.task.run(['dev', 'connect:dist:keepalive']);
		}else if (target === 'ios') {
			return grunt.task.run(['devios', 'connect:dist:keepalive']);
		}else if (target === 'cordova') {
			return grunt.task.run(['devcordova', 'connect:dist:keepalive']);
		}
		grunt.task.run(['clean:server', 'concurrent:server', 'postcss:server', 'connect:livereload', 'watch']);
	});

	grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve:' + target]);
	});

	grunt.registerTask('test', ['clean:server', 'concurrent:test', 'postcss', 'connect:test', 'karma']);

	grunt.registerTask('minfile', [
	'cssmin', 
	'uglify',
	'htmlmin']);
	
	grunt.registerTask('dev', [
		'clean:dist', 
		'useminPrepare',
		'postcss',
		'copy:dist', 
		'processhtml:dist'
	]);
	
	grunt.registerTask('devios', [
		'clean:dist', 
		'useminPrepare',
		'postcss',
		'copy:ios', 
		'processhtml:cordova',
		'processhtml:ios'
	]);
	
	grunt.registerTask('devcordova', [
	'clean:dist', 
	'useminPrepare',
	'postcss',
	'copy:dist', 
	'processhtml:cordova'
	]);

	grunt.registerTask('build', ['dev', 'minfile']);
	grunt.registerTask('buildphone', ['devios', 'minfile']);
	grunt.registerTask('cordova', ['devcordova', 'minfile']);
	
	grunt.registerTask('default', [ 'build']);
};
