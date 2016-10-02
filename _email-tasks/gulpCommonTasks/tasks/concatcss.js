var path = require('path');
var concat = require('gulp-concat');
var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var config  = require('../config').concatcss;

gulp.task('concatcss', function() {
	return gulp.src(config.src, {cwd: config.cwd})
		.pipe(sass())
		.pipe(gulp.dest(config.dest));
});

gulp.task('concatcss-del', function(cb) {
	del([path.join(config.dest, config.allFile)], cb);
});
