var gulp        = require('gulp');
var browserSync = require('browser-sync');
var cp          = require('child_process');
var bower       = require('gulp-bower');
var sass        = require('gulp-sass');
var deploy      = require('gulp-gh-pages');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var config = {
     sassPaths: [
        './bower_components/bootstrap-sass/assets/stylesheets',
        '_sass'
    ],
     bowerDir: './bower_components'
}

/**
 * Build the Sass
 */

gulp.task('compileSass', function(){
    return gulp.src('css/main.scss')
        .pipe(sass({
            includePaths: config.sassPaths
        })
            .on('error', sass.logError))
        .pipe(gulp.dest('_site/css'));
});

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', ['compileSass'], function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});


/**
 * Download Bower dependencies 
 */
gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

/**
 * Push build to GitHub Pages
 */
gulp.task('deploy', function () {
  return gulp.src("./_site/**/*")
    .pipe(deploy({
        branch: 'master'
    }));
});


/**
 * Watch html/md files, run jekyll & reload BrowserSync
 * if you add folder for pages, collection or datas, add them to this list
 */
gulp.task('watch', function () {
    gulp.watch(['./*', '_layouts/*', '_includes/*', '_posts/*', '_sass/**/*', 'css/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);