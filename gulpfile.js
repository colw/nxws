var gulp = require('gulp');

var react = require('gulp-react');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var path = require('path');

var DEST = 'dist';
var DEST_JS = path.join(DEST, 'js');
var DEST_CSS = path.join(DEST, 'css');
var DEST_LIB = path.join(DEST, 'lib');
var DEST_IMG = path.join(DEST, 'images');
var DEST_TMPJS = 'js';

gulp.task('react', function() {
  /* Unused. Left for manually transforming jsx files. */
  /* Why? It's easier to ignore the intermediate .js files entirely. 
     Sure, react() is run twice, (once for lint and again for production),
     but the cost is negligible. */      
  return gulp.src('jsx/*.jsx')
    .pipe(react())
    .pipe(gulp.dest(DEST_TMPJS));
});

gulp.task('lint', function() {
  return gulp.src('src/js*/*.js*')
    .pipe(react())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
  return gulp.src('src/scss/*.scss')
      .pipe(sass())
      .pipe(gulp.dest(DEST_CSS));
});

gulp.task('scripts', function() {
  return gulp.src(['src/js/observablething.js'
                  , 'src/js/!(observablething)*.js'
                  , 'src/jsx/news_view_mixins.jsx'
                  , 'src/jsx/news_view_header.jsx'
                  , 'src/jsx/news_view_about.jsx'
                  , 'src/jsx/news_view_list.jsx'
                  ])
    .pipe(react())
    .pipe(concat('all.js'))
    .pipe(gulp.dest(DEST_JS))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(DEST_JS));
});

gulp.task('index', function(){
  return gulp.src('src/index.html')
    .pipe(gulp.dest(DEST));
});

gulp.task('libraries', function() {
  return gulp.src('lib/*.*')
    .pipe(gulp.dest(DEST_LIB))
});

gulp.task('images', function() {
  return gulp.src('src/images/*.*')
    .pipe(gulp.dest(DEST_IMG))
});

gulp.task('watch', function() {
  gulp.watch('src/index.html', ['index']);
  gulp.watch('lib/*.*', ['libraries']);
  gulp.watch('images/*.*', ['images']);
  gulp.watch('src/js*/*.js*', ['lint', 'scripts']);
  gulp.watch('src/scss/*.scss', ['sass']);
});

gulp.task('default', ['lint', 'sass', 'scripts', 'libraries', 'images', 'index', 'watch']);
