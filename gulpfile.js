var gulp = require('gulp')
	, browserify = require('browserify')
	, source = require('vinyl-source-stream')
	, streamify = require('gulp-streamify')
	, rename = require('gulp-rename')
	, htmlreplace = require('gulp-html-replace')
	, exec = require('child_process').exec
	, PATHS = require('./srcPaths.json')
	, gpconcat = require('gulp-concat')
	, uglify = require('gulp-uglify')
	, uglifycss = require('gulp-uglifycss')
	, plumber = require('gulp-plumber');

gulp.task('default', ['browserify', 'css', 'images', 'fonts', 'writehtml', 'copy']);


gulp.task('browserify', function(){
	return browserify('app/vendors.base.js')
        .bundle()
        .pipe(source('vendors.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('web/public/'))
        .pipe(gulp.dest('app/public/'));
});

gulp.task('css', function(){
	gulp.src(["node_modules/font-awesome/css/font-awesome.min.css",
			"app/public/assets/style/reset.css",
			"node_modules/bootstrap/dist/css/bootstrap.min.css",
			"node_modules/bootstrap-social/bootstrap-social.css",
			"node_modules/ng-dialog/css/ngDialog.min.css",
			"node_modules/ng-dialog/css/ngDialog-theme-default.min.css",
			"node_modules/ladda/dist/ladda-themeless.min.css",
			"app/public/assets/style/style.css"])
		.pipe(streamify(uglifycss()))
		.pipe(gpconcat('style.all.css'))
		.pipe(gulp.dest('web/public/assets/style/'))
		.pipe(gulp.dest('app/public/assets/style/'));
});

gulp.task('fonts', function(){
	gulp.src(['node_modules/font-awesome/fonts/**'])
		.pipe(gulp.dest('web/public/assets/fonts/'))		
		.pipe(gulp.dest('app/public/assets/fonts/'));
});

gulp.task('images', function(){
	gulp.src(['app/public/assets/images/**'])
		.pipe(gulp.dest('web/public/assets/images/'));
});

gulp.task('writehtml', function(next){
	gulp.src('app/index.base.html')
	    .pipe(htmlreplace(replacePack()))
	    .pipe(rename('index.html'))
	    .pipe(gulp.dest('app/public/'));

	gulp.src('app/index.base.html')
	    .pipe(htmlreplace(replacePack(true)))
	    .pipe(rename('index.html'))
	    .pipe(gulp.dest('web/public/'));
	next();
});

function replacePack(min){
	return {
		css: {
			src: PATHS.css
		},
		scripts: {
			src: (min)? PATHS.minscripts : PATHS.rawscripts,
			tpl: '<script src="/app%s"></script>'
		}
	};
}
gulp.task('copy', function(next){
	gulp.src('app/routes/**')
		.pipe(gulp.dest('web/routes/'));

	gulp.src('app/public/components/**/*.pug')
		.pipe(gulp.dest('web/public/components/'));

	gulp.src(['app/public/story/**'])
		.pipe(gulp.dest('web/public/story/'));

	gulp.src(['app/public/app.js','app/public/config.js', 'app/public/shared/**/*.js', , 'app/public/components/**/*.js'])	
		.pipe(plumber())	
		.pipe(streamify(uglify()))
		.pipe(gpconcat('app.min.js'))
		.pipe(gulp.dest('web/public/'));

	gulp.src('app/app.js')
		.pipe(gulp.dest('web/'));
	next();
});







