'use strict';
/**
 * System
 */
var path = require('path');

/**
 * Framework
 */
var documentation = require('gulp-documentation'),
	debug = require('debug')('gastropod/addons/tasks/docjs'),
	plumber = require('gulp-plumber'),
	named = require('vinyl-named'),
	accept = require('check-args');

/**
  * Project
  * @params filename string output filename
  * @params format string 'html', 'md', 'json' or 'docset'
  */
var DEFAULT_OPTIONS = {
	format: 'md'
};
var buildPath = accept(String, String)
						.to(function(root, part){
							return path.join(root, part);
						});
/**
 * Exportable
 */
module.exports = function (gulp, gastro){
	/**
	 * Constants
	 */

	var Config = gastro.Config,

		target = buildPath(Config.target.root,
						   Config.target.docs),

		sources = [],

		DocumentationConfig = (Config.plugins.documentation && Config.plugins.documentation.docjs) || DEFAULT_OPTIONS;

		var pattern;
		for(var index=0; index < Config.source.documentation.length; index++) {
			pattern = Config.source.documentation[index];
			sources.push(buildPath(Config.source.root, pattern));
		}

	debug('config:', DocumentationConfig);

	gulp.task('docjs', function(done){

		debug('Starting');
		debug(' > source', sources);
		debug(' > target', target);

		return gulp.src(sources)
			.on('error', function(err){
				this.emit('end');
			})
			.on('end', function(){
				debug('Finished: documentation');
			})
			.pipe(documentation(DocumentationConfig))
			.pipe(gulp.dest(target));

	});

	debug('task registered');
}
