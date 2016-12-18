var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require('browser-sync').create();

gulp.task('sass', function(){
    return gulp.src("./scss/*.scss")
  .pipe(sass({errLogToConsole:true}))
  // .pipe(sass().on('error',sass.log))
  .pipe(gulp.dest('./css'))
  .pipe(browserSync.stream())
});

gulp.task('standard', function(){
  gulp.watch('scss/*.scss', ['sass']);
});


gulp.task('serve', ['sass'], function(){

  browserSync.init({
    server: "./"
  });

  gulp.watch("./**/*.scss", ['sass']);
  gulp.watch("./css/*.css").on('change', browserSync.reload);
  gulp.watch("./*.html").on('change', browserSync.reload);
  gulp.watch("./js/**/*.js").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
