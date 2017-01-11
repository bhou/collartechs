'use strict';

//////////////////////////////
// Requires
//////////////////////////////
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const eyeglass = require('eyeglass');
const autoprefixer = require('gulp-autoprefixer');
const sasslint = require('gulp-sass-lint');
const imagemin = require('gulp-imagemin');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();

//////////////////////////////
// Variables
//////////////////////////////
const dirs = {
  js: {
    lint: {
      browser: [
        'src/**/*.js',
        '!src/**/*.min.js'
      ],
      node: [
        'index.js',
        'lib/**/*.js',
      ],
    },
    uglify: [
      'src/js/**/*.js',
      '!src/js/**/*.min.js'
    ]
  },
  server: {
    main: 'index.js',
    watch: [
      'index.js',
      'lib',
      'views',
    ],
    extension: 'js html',
  },
  sass: 'src/sass/**/*.scss',
  images: 'src/images/**/*.*',
  public: 'public/'
};

const isCI = (typeof process.env.CI !== 'undefined') ? Boolean(process.env.CI) : false;

const sassOptions = {
  'outputStyle': isCI ? 'expanded' : 'compressed',
};

//////////////////////////////
// JavaScript Lint Tasks
//////////////////////////////
gulp.task('eslint', ['eslint:browser']);

gulp.task('eslint:browser', function () {
  return gulp.src(dirs.js.lint.browser)
    .pipe(eslint('./.eslintrc-browser.yml'))
    .pipe(eslint.format())
    .pipe(gulpif(isCI, eslint.failOnError()));
});

gulp.task('uglify', function () {
  return gulp.src(dirs.js.uglify)
    .pipe(gulpif(!isCI, sourcemaps.init()))
      .pipe(uglify({
        'mangle': isCI ? true : false
      }))
    .pipe(gulpif(!isCI, sourcemaps.write('maps')))
    .pipe(gulp.dest(dirs.public + 'js'))
    .pipe(browserSync.stream());
});

gulp.task('eslint:watch', function () {
  return gulp.watch([dirs.js.lint.browser, dirs.js.lint.node], ['eslint']);
});

gulp.task('uglify:watch', function () {
  return gulp.watch(dirs.js.uglify, ['uglify']);
});

//////////////////////////////
// Sass Tasks
//////////////////////////////
gulp.task('sass', function () {
  return gulp.src(dirs.sass)
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(gulpif(isCI, sasslint.failOnError()))
    .pipe(gulpif(!isCI, sourcemaps.init()))
      .pipe(sass(eyeglass(sassOptions)))
      .pipe(autoprefixer())
    .pipe(gulpif(!isCI, sourcemaps.write('maps')))
    .pipe(gulp.dest(dirs.public + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('sass:watch', function () {
  return gulp.watch(dirs.sass, ['sass']);
});

//////////////////////////////
// Image Tasks
//////////////////////////////
gulp.task('images', function () {
  return gulp.src(dirs.images)
    .pipe(imagemin({
      'progressive': true,
      'svgoPlugins': [
        { 'removeViewBox': false }
      ]
    }))
    .pipe(gulp.dest(dirs.public + '/images'));
});

gulp.task('images:watch', function () {
  return gulp.watch(dirs.images, ['images']);
});


//////////////////////////////
// Browser Sync Task
//////////////////////////////
gulp.task('browser-sync', function () {
  browserSync.init({
    files: ['./*.html', './src/**/*.html'],
    server: {
      baseDir: "./"
    }
  });
});

//////////////////////////////
// Running Tasks
//////////////////////////////
gulp.task('build', ['uglify', 'sass', 'images']);

gulp.task('test', ['build']);

gulp.task('watch', ['eslint:watch', 'uglify:watch', 'sass:watch', 'images:watch']);

gulp.task('default', ['browser-sync', 'build', 'watch']);
