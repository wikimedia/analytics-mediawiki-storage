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
gulp.task('clean', function () {
    return del(['dist/*.js']);
});

// gulp build: uglifies and copies the js files to dist/ folder
gulp.task('build', gulp.series('lint', 'clean', function () {
  return gulp.src('src/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('mediawiki-storage.min.js'))
    .pipe(gulp.dest('dist'));
}));

// gulp: executes build task
gulp.task('default', gulp.series('build'));
