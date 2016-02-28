import gulp from 'gulp';
import gutil from 'gulp-util';
import vinyl from 'vinyl-source-stream';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import concat from 'gulp-concat'

const newLookJs = './src/new_look_app/app.js';
const vendorJs = [
  'node_modules/angular/angular.min.js'
];


// = browserify & watchify
function bundle(bundler) {
  return bundler
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .on('error', function(err) {
      gutil.log(err);
    })
    .pipe(vinyl('newlook.js'))
    .pipe(gulp.dest('./public/js'));
}



gulp.task('watch', () => {
  let watcher = watchify(browserify(newLookJs, watchify.args));

  bundle(watcher);

  watcher.on('update', () => {
    bundle(watcher);
  });

  watcher.on('log', gutil.log);
});


// = new look app
gulp.task('newlook:js', () => {
  return bundle(browserify(newLookJs));
});


gulp.task('vendor:js', () => {
  gulp.src(vendorJs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/js'));
});


//= DEFAULT
gulp.task('default', ['vendor:js', 'newlook:js']);
