var gulp = require('gulp');
var connect = require('gulp-connect-php');
var browserSync = require('browser-sync');
 
gulp.task('default', function() {
  connect.server({
      base: './dist'
  }, function (){
    browserSync({
      proxy: '127.0.0.1:8000'
    });
  });
 
  gulp.watch('./dist/**/*').on('change', function () {
    browserSync.reload();
  });
});