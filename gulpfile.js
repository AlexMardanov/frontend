'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var cache = require('gulp-cache');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var stylefmt = require('gulp-stylefmt');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');

/* ------------------------------------------------------------ */
/*   GULP   */
/* ------------------------------------------------------------ */

gulp.task('default', ['styles', 'js'], function() {
	browserSync.init({
		server: { baseDir: './app/' }
	});
	gulp.watch('./app/css/source-scss/**/*.scss', ['styles']);
	gulp.watch('./app/js/source-js/*/**.js', ['js']);
	gulp.watch('./app/*.html').on('change', browserSync.reload);
});

/* ------------------------------------------------------------ */
/*   CSS   */
/* ------------------------------------------------------------ */

gulp.task('scssCompile', function() {
	return gulp.src('./app/css/source-scss/main.source.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compact'})
		.on('error', sass.logError))
		.pipe(sourcemaps.write('.'))
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.source', '');
		}))
		.pipe(gulp.dest('./app/css/'))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('styles', ['scssCompile'], function() {
	return gulp.src('./app/css/main.css')
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'] }))
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./app/css/'))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('stylefmt', function() {
	return gulp.src('./app/css/source-scss/**/*.scss')
		.pipe(stylefmt())
		.pipe(gulp.dest('./app/css/source-scss/'));
});

gulp.task('distCSS', function() {
	return gulp.src('./app/css/**/*.*')
		.pipe(gulp.dest('./dist/css/'));
});

gulp.task('buildStyles', function(callback) {
	runSequence('stylefmt', 'scssCompile', 'styles', 'distCSS', callback);
});

/* ------------------------------------------------------------ */
/*   IMAGES   */
/* ------------------------------------------------------------ */

gulp.task('images', function() {
	return gulp.src('./app/images/**/*.{png,gif,jpg,jpeg,svg}')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('./dist/images/'));
});

/* ------------------------------------------------------------ */
/*   JS   */
/* ------------------------------------------------------------ */

gulp.task('cleanMinimizedJs', function () {
	return gulp.src('./app/js/minimized-js', {read: false})
		.pipe(clean());
});

gulp.task('minimizeJs', function() {
	return gulp.src('./app/js/source-js/**/*.js')
		.pipe(cache(jsmin()))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./app/js/minimized-js/'));
});

gulp.task('reloadAfterJsChanged', function () {
	browserSync.reload();
});

gulp.task('js', function(callback) {
	runSequence('minimizeJs', 'reloadAfterJsChanged', callback);
});

gulp.task('distJs', function() {
	return gulp.src('./app/js/**/*.*')
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('buildJs', function (callback) {
	runSequence('cleanMinimizedJs', 'minimizeJs', 'distJs', callback);
});

/* ------------------------------------------------------------ */
/*   CACHE   */
/* ------------------------------------------------------------ */

gulp.task('clearCache', function (callback) {
	return cache.clearAll();
});

/* ------------------------------------------------------------ */
/*   HTML   */
/* ------------------------------------------------------------ */

gulp.task('html', function (callback) {
	return gulp.src('./app/*.html')
		.pipe(gulp.dest('./dist/'));
});

/* ------------------------------------------------------------ */
/*   FONTS   */
/* ------------------------------------------------------------ */

gulp.task('fonts', function (callback) {
	return gulp.src('./app/fonts/**/*.*')
		.pipe(gulp.dest('./dist/fonts/'));
});

/* ------------------------------------------------------------ */
/*   BUILD   */
/* ------------------------------------------------------------ */

gulp.task('buildDist', ['buildStyles', 'buildJs', 'images', 'html', 'fonts'], function(callback) {
	callback();
});

gulp.task('cleanDist', function () {
	return gulp.src('./dist', {read: false})
		.pipe(clean());
});

gulp.task('build', function (callback) {
	runSequence('cleanDist', 'buildDist', callback);
});