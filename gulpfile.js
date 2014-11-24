var gulp = require('gulp');
var jshint = require('gulp-jshint');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// gulp lint: passes lint check on src/ and test/ js files
var filesToLint = ['src/*.js', 'test/*.js'];
gulp.task('lint', function() {
  return gulp.src(filesToLint)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// gulp clean: removes js files from dist/ folder
gulp.task('clean', function (callback) {
    del(['dist/*.js'], callback);
});

// gulp build: uglifies and copies the js files to dist/ folder
gulp.task('build', ['lint', 'clean'], function () {
  gulp.src('src/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('mediawiki-storage.min.js'))
    .pipe(gulp.dest('dist'));
});

// gulp: executes build task
gulp.task('default', ['build'], function() {});
