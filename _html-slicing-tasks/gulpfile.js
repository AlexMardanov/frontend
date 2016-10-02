'use strict';
/* ------------------------------------------------------------ */
/*   ENTER YOUR FOLDER NAME FROM _TASKS FOLDER      */
/*       BASIK AND ONLY REQUARED VARIABLE!!!        */
/* ------------------------------------------------------------ */
var folderName = 'essay-666666'; // or any other name of folder copied from default
/* ------------------------------------------------------------ */
/*   PLUGINS   */
/* ------------------------------------------------------------ */
const gulp             = require('gulp');
const browserSync      = require('browser-sync').create();
const jsmin            = require('gulp-jsmin');
const rename           = require('gulp-rename');
const cache            = require('gulp-cache');
const clean            = require('gulp-clean');
const runSequence      = require('run-sequence');
const sass             = require('gulp-sass');
const autoprefixer     = require('gulp-autoprefixer');
const imagemin         = require('gulp-imagemin');
const pngquant         = require('imagemin-pngquant');
const stylefmt         = require('gulp-stylefmt');
const sourcemaps       = require('gulp-sourcemaps');
const plumber          = require('gulp-plumber');
const debug            = require('gulp-debug');
const notify           = require("gulp-notify");
const spritesmith      = require('gulp.spritesmith');
const cached           = require('gulp-cached');
const partialsImported = require('gulp-sass-partials-imported');
/* ------------------------------------------------------------ */
/*   PATHES   */
/* ------------------------------------------------------------ */
var stylesPath = '_tasks/'+folderName+'/app/styles';
var jsPath     = '_tasks/'+folderName+'/app/js';
var imagesPath = '_tasks/'+folderName+'/app/images';
var fontsPath  = '_tasks/'+folderName+'/app/fonts';
var htmlPath   = '_tasks/'+folderName+'/app';
var distPath   = '_tasks/'+folderName+'/dist';
/* ------------------------------------------------------------ */
/*   CSS   */
/* ------------------------------------------------------------ */
gulp.task('scss', function() {
	return gulp.src(stylesPath+'/partials/**/*.scss')
		.pipe(cached('scss-files'))
		.pipe(partialsImported(stylesPath+'/partials'))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed',
			includePaths: ['node_modules/susy/sass']
		}))
		.on('error', notify.onError())
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ios 6', 'android 4'] }))
		.pipe(sourcemaps.write('sourcemaps'))
		.pipe(gulp.dest(stylesPath))
});

gulp.task('stylefmt', function() {
	return gulp.src(stylesPath+'/**/*.scss')
		.pipe(stylefmt())
		.pipe(gulp.dest(stylesPath));
});

gulp.task('build-styles', ['stylefmt', 'scss'], function() {
	return gulp.src(stylesPath+'/**/*.*')
			.pipe(gulp.dest(distPath+'/styles'));
});
/* ------------------------------------------------------------ */
/*   IMAGES   */
/* ------------------------------------------------------------ */
gulp.task('images', ['sprite'], function() {
	return gulp.src(imagesPath+'/**/*.{png,gif,jpg,jpeg,svg}')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest(distPath+'/images'));
});

gulp.task('sprite', function (callback) {
	var spriteData = gulp.src(imagesPath+'/sprite-items/*.{png,gif,jpg,jpeg,svg}')
		.pipe(spritesmith({
				imgName: '../images/sprite.png',
				cssName: '_sprite.scss',
				cssTemplate: stylesPath+'/partials/mixins/scss.template.handlebars'
		}));
	spriteData.img.pipe(gulp.dest(imagesPath));
	spriteData.css.pipe(gulp.dest(stylesPath+'/partials/mixins'));
	callback();
});
/* ------------------------------------------------------------ */
/*   JS   */
/* ------------------------------------------------------------ */
gulp.task('minimize-js', function() {
	return gulp.src(jsPath+'/source-js/*.js')
		.pipe(cache(jsmin()))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(jsPath+'/minimized-js'));
});

gulp.task('js', ['minimize-js'], function(callback) {
	browserSync.reload();
	callback();
});

gulp.task('build-js', ['minimize-js'], function () {
	return gulp.src(jsPath+'/**/*.*')
		.pipe(gulp.dest(distPath+'/js'));
});
/* ------------------------------------------------------------ */
/*   CACHE   */
/* ------------------------------------------------------------ */
gulp.task('clear-cache', function () {
	return cache.clearAll();
	delete cache.caches['styling'];
});
/* ------------------------------------------------------------ */
/*   HTML   */
/* ------------------------------------------------------------ */
gulp.task('build-html', function () {
	return gulp.src(htmlPath+'/*.html')
		.pipe(gulp.dest(distPath));
});
/* ------------------------------------------------------------ */
/*   FONTS   */
/* ------------------------------------------------------------ */
gulp.task('build-fonts', function () {
	return gulp.src(fontsPath+'/**/*.*')
		.pipe(gulp.dest(distPath+'/fonts'));
});
/* ------------------------------------------------------------ */
/*   BUILD   */
/* ------------------------------------------------------------ */
gulp.task('build-dist', ['build-styles', 'build-js', 'images', 'build-html', 'build-fonts'], function(callback) {
	callback();
});

gulp.task('clean-dist', function () {
	return gulp.src(distPath, {read: false})
		.pipe(clean());
});

gulp.task('build', function (callback) {
	runSequence('clean-dist', 'build-dist', callback);
});
/* ------------------------------------------------------------ */
/*   GULP   */
/* ------------------------------------------------------------ */
gulp.task('static-server', function() {
	browserSync.init({
		server: { baseDir: htmlPath }
	});
});

gulp.task('default', ['stylefmt', 'static-server'], function() {
	gulp.watch(stylesPath+'/**/*.scss', ['scss']);
	gulp.watch(jsPath+'/source-js/*.js', ['js']);
	gulp.watch(imagesPath+'/sprite-items/*.*', ['sprite']);

	browserSync.watch(htmlPath+'/**/*.html', function (event, file) {
		if (event === "change") {
			browserSync.reload();
		}
	});

	browserSync.watch(stylesPath+'/**/*.css', function (event, file) {
		if (event === "change") {
			browserSync.reload('*.css');
		}
	});
});