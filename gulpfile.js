const gulp = require('gulp');
const sass = require('gulp-sass');

//style paths
const sassFiles = 'scss/**/*.scss',
    cssDest = 'css/';

gulp.task('styles', function(){
  gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssDest));
});

gulp.task('watch',function() {
  gulp.watch(sassFiles,['styles']);
});