var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var bourbon = require('node-bourbon');

gulp.task('webserver', function() {
  gulp.src('./build/')
  .pipe(webserver({
    port: 3212,
    livereload: true,
    open: true,
    fallback: './build/index.html'
  }));
});

gulp.task('cssConcat', function() {
  return gulp.src(require('./stylesheets-dependencies.json').dependencies)
  .pipe(plumber())
  .pipe(autoprefixer())
  .pipe(concat('all.css'))
  .pipe(gulp.dest('./build/css'));
});

gulp.task('cssMin', function() {
  return gulp.src(require('./stylesheets-dependencies.json').dependencies)
  .pipe(plumber())
  .pipe(cssmin())
  .pipe(concat('all.min.css'))
  .pipe(gulp.dest('./build/css'));
});

gulp.task('jsUglify', function() {
  return gulp.src('./app/js/**/*.js')
  .pipe(plumber())
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./build/js'));
});

// gulp.task('buildLib', function() {
//   gulp.src(require('./dependencies.json').dependencies)
//   .pipe(concat('vendor.js'))
//   .pipe(uglify())
//   .pipe(gulp.dest('./build/js'));
// });

gulp.task('imageMin', function() {
  return gulp.src(['./app/img/**/*.*'])
  .pipe(imagemin({
    optimizationLevel: 7
  }))
  .pipe(gulp.dest('./build/img'));
});

gulp.task('fonts', function() {
    return gulp.src([
                    './app/libs/**/**.*'])
            .pipe(gulp.dest('./build/libs/'));
});

// gulp.task('fonts', function() {
//     return gulp.src(['./app/font-awesome/font-awesome/css/font-awesome.min.css',
//                     './app/font-awesome/font-awesome/fonts/fontawesome-webfont.*',
//                     './app/font-awesome/linea/fonts/linea-basic-10.*',
//                     './app/font-awesome/linea/styles.css'])
//             .pipe(gulp.dest('./build/font-awesome/'));
// });

gulp.task('templates', function() {
  return gulp.src('./app/index.html')
  .pipe(gulp.dest('./build'));
});

gulp.task('templatesDirect', function() {
  return gulp.src(['./app/templates/**/*.html'])
  .pipe(gulp.dest('./build/templates'));
});


gulp.task('styles', function () {
	gulp.src(['./app/pre_proc/sass/**/*.sass',
            './app/pre_proc/scss/**/*.scss'
          ])
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(autoprefixer())
	.pipe(gulp.dest('app/css/'));
});


gulp.task('watch', ['cssConcat'], function () {
  gulp.watch('./app/css/**/*.css', ['cssConcat']);
  gulp.watch('./app/js/**/*.js', ['jsUglify']);
  gulp.watch('./app/templates/**/*.html', ['templatesDirect']);
  gulp.watch('./app/index.html', ['templates']);
});

gulp.task('default', ['jsUglify', 'imageMin', 'webserver', 'fonts', 'templates', 'templatesDirect', 'styles', 'watch', 'cssConcat']);
