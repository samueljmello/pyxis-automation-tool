var gulp = require('gulp');
var connect = require('gulp-connect-php');
var browserSync = require('browser-sync');
 
gulp.task('connect-sync', function() {
  connect.server({
      base: './backend'
  }, function (){
    browserSync({
      proxy: '127.0.0.1:8000',
      base: './backend'
    });
  });
 
  gulp.watch('./backend/**/*.php').on('change', function () {
    browserSync.reload();
  });
});