/**
 * Requires
 */
var gulp = require('gulp');
    gutil = require('gulp-util'),
    bower = require('bower'),
    sh = require('shelljs'),
    fs = require('fs');

var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

var ionicProject = JSON.parse(fs.readFileSync('./ionic.project'));

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
    scripts: basePaths.src + '/app/**/*.js',
    sass: [basePaths.src + '/assets/sass/**/*.scss', basePaths.src + '/app/**/*.scss'],
    templates: ["source/**/templates/**/*.{html,jade}", "source/app/menu.jade"],
    images: "source/assets/images/*",
    fonts: "source/assets/fonts/*.*"
};

var changeEvent = function(evt) {
    gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

gulp.task('default', ['usemin', 'templates', 'fonts', 'images', 'config']);

/**
 * Get your index.html scripts and styles and merge
 */
gulp.task('usemin', function () {
    gulp.src('./source/index.html')
        .pipe(plugins.usemin({
            css: [plugins.sass({errLogToConsole: true}), plugins.if(ionicProject.constants.env == 'production', plugins.minifyCss()), 'concat'],
            cssapp: [plugins.sass({errLogToConsole: true}), plugins.if(ionicProject.constants.env == 'production', plugins.minifyCss()), 'concat'],
            html: [plugins.htmlmin({collapseWhitespace: true})],
            jsvendor: [plugins.uglify(), plugins.if(ionicProject.constants.env == 'production', plugins.rev())],
            jsapp: [plugins.uglify(), plugins.if(ionicProject.constants.env == 'production', plugins.rev())]
        }))
        .pipe(gulp.dest('./www'));
});

/**
 * Get your .htlm or jade files and optime to angular template cache
 */
gulp.task('templates', function () {
    gulp.src(paths.templates)
        .pipe(plugins.if(/[.]jade$/, plugins.jade()))
        .pipe(plugins.angularHtmlify())
        .pipe(plugins.angularTemplatecache({
            standalone: false,
            module: ionicProject.name
        }))
        .pipe(gulp.dest('./www/js'));
});
/**
 * Copy your fonts
 */
gulp.task('fonts', function () {
    gulp.src(paths.fonts)
        .pipe(gulp.dest('./www/fonts'));
});

/**
 * Copy your images
 */
gulp.task('images', function () {
    gulp.src(paths.images)
        .pipe(gulp.dest('./www/images'));
});

/**
 * create constants in angular from parameter 'constants' present in your ionic.project
 */
gulp.task('config', function () {
    gulp.src('ionic.project')
        .pipe(plugins.ngConstant())
        .pipe(gulp.dest('./www/js'));
});

gulp.task('watch', function() {
    gulp.watch(['source/index.html', paths.scripts, paths.sass], ['usemin']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.templates, ['templates']);
    gulp.watch(paths.fonts, ['fonts']);
    gulp.watch('ionic.project', ['config']);
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
