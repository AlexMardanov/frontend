'use strict';
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
/*   PATH   */
/* ------------------------------------------------------------ */
var stylesPath = 'essay/sites/besttermpaper.com/web/styles';  // e.g. 'essay/sites/besttermpaper.com/web/styles' or 'static-projects/sitename/app/styles'
var jsPath     = 'essay/sites/besttermpaper.com/web/js';      // e.g. 'essay/sites/besttermpaper.com/web/js' or 'static-projects/sitename/app/js'
var imagesPath = 'essay/sites/besttermpaper.com/web/images';  // e.g. 'essay/sites/besttermpaper.com/web/images' or 'static-projects/sitename/app/images'
var fontsPath  = 'essay/sites/besttermpaper.com/web/fonts';   // e.g. 'essay/sites/besttermpaper.com/web/fonts' or 'static-projects/sitename/app/fonts'
var htmlPath   = 'essay/sites/besttermpaper.com';         // e.g. 'essay/sites/besttermpaper.com' or 'static-projects/sitename/app'
var distPath   = 'essay/sites/besttermpaper.com/web';        // e.g. 'essay/sites/besttermpaper.com/web' or 'static-projects/sitename/dist'
var siteName   = 'besttermpaper.com';                   // e.g. 'besttermpaper.com'
/* ------------------------------------------------------------ */
/*   GULP   */
/* ------------------------------------------------------------ */
gulp.task('static-server', function() {
	browserSync.init({
		server: { baseDir: htmlPath }
	});
});
gulp.task('local-server', function() {
	return browserSync.init({
		tunnel: 'devellar',
		port: 3001,
		host: siteName+'.local',
		logPrefix: "Frontend_Devellar",
		proxy: 'http://'+siteName+'.local'
	});
});
gulp.task('default', ['stylefmt', 'local-server'], function() {
	gulp.watch(stylesPath+'/**/*.css', ['css']);
	gulp.watch(jsPath+'/**/*.js', ['js']);
	gulp.watch(htmlPath+'**/*.{php,js,tpl,html}').on('change', browserSync.reload);
	gulp.watch(imagesPath+'/sprite-items/*.*', ['sprite']);
});
/* ------------------------------------------------------------ */
/*   CSS   */
/* ------------------------------------------------------------ */
gulp.task('scss', function() {
	return gulp.src(stylesPath+'/**/*.scss')
		.pipe(cached('scss-files'))
		.pipe(partialsImported(stylesPath))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed',
			includePaths: ['node_modules/susy/sass']
		}))
		.on('error', notify.onError())
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'] }))
		.pipe(sourcemaps.write('sourcemaps'))
		.pipe(gulp.dest(stylesPath))
		.pipe(browserSync.stream({match: '**/*.css'}));
});
gulp.task('css', function() {
	return gulp.src(stylesPath+'/**/*.css')
		.pipe(cached('css-files'))
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'] }))
		.on('error', notify.onError())
		.pipe(gulp.dest(stylesPath))
		.pipe(browserSync.stream({match: '**/*.css'}));
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
	return gulp.src(jsPath+'/**/*.source.js')
		.pipe(cache(jsmin()))
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.source', '');
		}))
		.pipe(gulp.dest(jsPath));
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
