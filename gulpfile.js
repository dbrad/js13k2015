var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var zip = require('gulp-zip');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');

gulp.task('concat', function() {
  return gulp.src(['build/js/input.js', 'build/js/graphics.js', 'build/js/tile.js', 'build/js/game_objects.js', 'build/js/ECS.js', 'build/js/systems.js', 'build/js/game.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('minify', ['concat'], function() {
  return gulp.src('build/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/temp'));
});

gulp.task('cssmin', function() {
    return gulp.src('build/main.css')
        .pipe(csso())
        .pipe(gulp.dest('dist/temp'));
});

gulp.task('htmlmin', function() {
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

gulp.task("watch", function() {
  gulp.watch('build/*.css', ['cssmin', 'zip']);
  gulp.watch('build/*.html', ['htmlmin', 'zip']);
  gulp.watch('build/js/*.js', ['concat', 'minify', 'zip']);
});


gulp.task('default', ['htmlmin', 'cssmin', 'concat', 'minify', 'imagemin', 'zip', 'watch']);
