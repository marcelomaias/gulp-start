const { src, dest, parallel, series, watch } = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const rollup = require("gulp-better-rollup");
const babel = require("rollup-plugin-babel");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("rollup-plugin-terser");

function html() {
  return src("./src/pug/*.pug")
    .pipe(pug())
    .pipe(dest("./src"));
}
function prodHtml() {
  return src("./src/pug/*.pug")
    .pipe(pug())
    .pipe(dest("./dist"));
}

function css() {
  return src("./src/scss/*.scss")
    .pipe(sass())
    .pipe(dest("./src/css"));
}
function prodCss() {
  return src("./src/scss/*.scss")
    .pipe(sass())
    .pipe(dest("dist/css"));
}

function js() {
  return src("./src/js/*.js")
    .pipe(sourcemaps.init())
    .pipe(
      rollup(
        {
          plugins: [commonjs(), resolve(), babel()]
        },
        "umd"
      )
    )
    .pipe(sourcemaps.write("./"))
    .pipe(dest("./src/scripts"));
}
function prodJs() {
  return src("./src/js/*.js")
    .pipe(
      rollup(
        {
          plugins: [
            commonjs(),
            resolve(),
            babel({
              runtimeHelpers: true
            }),
            terser.terser()
          ]
        },
        "umd"
      )
    )
    .pipe(dest("./dist/scripts"));
}

function prodImages() {
  return src("./src/assets/**/*.{png,jpg,jpeg,svg}")
    .pipe(imagemin())
    .pipe(dest("./dist/assets"));
}

function watchTask() {
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });
  watch("./src/pug/**/*.pug", html);
  watch("./src/scss/*.scss", css);
  watch("./src/js/*.js", js);
  // watch("./src/assets/*", images);
  watch([
    "./src/*.html",
    "./src/css/*.css",
    "./src/scripts/*.js"
    // "./src/assets/*"
  ]).on("change", browserSync.reload);
}

exports.html = html;
exports.css = css;
exports.js = js;
exports.prodImages = prodImages;
exports.prodHtml = prodHtml;
exports.prodCss = prodCss;
exports.prodJs = prodJs;
exports.watchTask = watchTask;

exports.default = series(parallel(html, css, js), watchTask);
exports.build = parallel(prodHtml, prodCss, prodJs, prodImages);
