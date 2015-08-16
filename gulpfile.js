var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var zip = require('gulp-zip');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');

gulp.task('htmlmin', function() {
  return gulp.src('build/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/temp'));
});

gulp.task('cssmin', function() {
    return gulp.src('build/main.css')
        .pipe(csso())
        .pipe(gulp.dest('dist/temp'));
});

gulp.task('minify', function() {
  return gulp.src('build/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/temp'));
});

gulp.task('imagemin', function () {
    return gulp.src('build/*.png')
        .pipe(imagemin({ progressive: true }))
        .pipe(gulp.dest('dist/temp'));
});

gulp.task('zip', [ 'htmlmin', 'minify', 'cssmin', 'imagemin' ], function() {
  return gulp.src('dist/temp/*')
      .pipe(zip('js13k.zip'))
      .pipe(gulp.dest('dist'));
});
