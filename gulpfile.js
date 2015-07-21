/**
 * Requires
 */
var gulp = require('gulp');
    gutil = require('gulp-util'),
    bower = require('bower'),
    sh = require('shelljs');

var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

/**
 * Application Paths
*/

var basePaths = {
    src: 'source',
    dest: 'www',
    bower: 'source/lib',
    e2e: 'e2e'
};
var paths = {
    images: {
        src: basePaths.src + '/assets/images',
        dest: basePaths.dest + '/images'
    },
    scripts: {
        src: basePaths.src + '/main',
        dest: basePaths.dest + '/js'
    },
    styles: {
        src: basePaths.src + '/sass',
        dest: basePaths.dest + '/css'
    }
};

var appFiles = {
    styles: paths.styles.src + '**/*.scss',
    scripts: [paths.scripts.src + 'scripts.js']
};

var paths = {
    sass: ['source/assets/sass/**/*.scss'],
    templates: "source/**/templates/**/*.{html,jade}",
    images: "source/assets/images/*",
    fonts: "source/assets/fonts/*.*"
};

gulp.task('plugins', function(){
    console.log(plugins);
});

var changeEvent = function(evt) {
    gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

gulp.task('default', ['usemin', 'templates', 'fonts', 'images', 'config']);

gulp.task('usemin', function () {
    gulp.src('./source/index.html')
        .pipe(plugins.usemin({
            css: [plugins.sass({errLogToConsole: true}), plugins.minifyCss(), 'concat'],
            cssapp: [plugins.sass({errLogToConsole: true}), plugins.minifyCss(), 'concat'],
            html: [plugins.htmlmin({collapseWhitespace: true})],
            jsvendor: [plugins.uglify(), plugins.rev()],
            jsapp: [plugins.uglify(), plugins.rev()]
        }))
        .pipe(gulp.dest('./www'));
});

gulp.task('templates', function () {
    //console.log(plugins.if(true, console.log('Jeff')));
    gulp.src(paths.templates)
        .pipe(plugins.if(/[.]jade$/, plugins.jade()))
        .pipe(plugins.angularHtmlify())
        .pipe(plugins.angularTemplatecache({
            standalone: false,
            module: "flow"
        }))
        .pipe(gulp.dest('./www/js'));
});

gulp.task('fonts', function () {
    gulp.src(paths.fonts)
        .pipe(gulp.dest('./www/fonts'));
});

gulp.task('images', function () {
    gulp.src(paths.images)
        .pipe(gulp.dest('./www/images'));
});

gulp.task('config', function () {
    gulp.src('ionic.project')
        .pipe(plugins.ngConstant())
        .pipe(gulp.dest('./www/js'));
});

gulp.task('watch', function() {
  //gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
