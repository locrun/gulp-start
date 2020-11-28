const { src, dest, watch, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create();
const less = require("gulp-less");
const imagemin = require("gulp-imagemin");
const del = require("del");

function cleanDist() {
  return del("dist");
}

function images() {
  return src("app/images/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/images"));
}

function gulpLess() {
  return src("./app/less/main.less")
    .pipe(less())
    .pipe(dest("./app/css"))
    .pipe(browserSync.stream());
}

function gulpServer() {
  browserSync.init({
    server: {
      baseDir: "./app/",
    },
  });
}

function gulpWatch() {
  watch("./app/**/*.html").on("change", browserSync.reload);
  watch("./app/less/**/*.less", series(gulpLess));
}

function build() {
  return src(
    ["app/css/main.css", "app/fonts/**/*", "app/js/main.js", "app/*.html"],
    { base: "app" }
  ).pipe(dest("dist"));
}

exports.images = images;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, images, build);
exports.default = parallel(gulpLess, gulpServer, gulpWatch);
