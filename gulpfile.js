'use strict';
/* ------------------------------------------------------------ */
/*   ENTER YOUR SITE FOLDER NAME FROM ESSAY/SITES FOLDER   */
/*          BASIK AND ONLY REQUARED VARIABLE!!!            */
/* ------------------------------------------------------------ */
var folderName = 'uk.superiorpapers.com';
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
/*   PATH (WRITE CORRECT PATHES FOR SPEED UP)   */
/* ------------------------------------------------------------ */
var stylesPath = 'essay/sites/'+folderName+'/web/styles';
var jsPath     = 'essay/sites/'+folderName+'/web/js';
var imagesPath = 'essay/sites/'+folderName+'/web/images';
var distPath   = 'essay/sites/'+folderName;
var siteName   = folderName;
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
		.pipe(sourcemaps.write('sourcemaps', {includeContent: false}))
		.pipe(gulp.dest(stylesPath))
});

gulp.task('stylefmt', function() {
	return gulp.src(stylesPath+'/**/*.scss')
		.pipe(stylefmt())
		.pipe(gulp.dest(stylesPath));
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
		.pipe(gulp.dest(imagesPath));
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
gulp.task('js', function() {
	return gulp.src(jsPath+'/source-js/*.js')
		.pipe(cache(jsmin()))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(jsPath+'/minimized-js'));
});
/* ------------------------------------------------------------ */
/*   CACHE   */
/* ------------------------------------------------------------ */
gulp.task('clear-cache', function () {
	return cache.clearAll();
	delete cache.caches['styling'];
});
/* ------------------------------------------------------------ */
/*   GULP   */
/* ------------------------------------------------------------ */
gulp.task('local-server', function() {
	return browserSync.init({
		// tunnel: 'devellar',
		port: 3001,
		host: siteName+'.local',
		logPrefix: "Frontend_Devellar",
		proxy: 'http://'+siteName+'.local'
	});
});

gulp.task('default', ['stylefmt', 'local-server'], function() {
	gulp.watch(stylesPath+'/**/*.scss', ['scss']);
	gulp.watch(jsPath+'/source-js/*.js', ['js']);
	gulp.watch(imagesPath+'/sprite-items/*.*', ['sprite']);

	browserSync.watch(distPath+'/web/**/*.css', function (event, file) {
		if (event === "change") {
			browserSync.reload('*.css');
		}
	});

	browserSync.watch(distPath+'/web/**/*.js', function (event, file) {
		if (event === "change") {
			browserSync.reload('*.js');
		}
	});

	browserSync.watch(distPath+'/template/*.php', function (event, file) {
		if (event === "change") {
				browserSync.reload();
		}
	});
});