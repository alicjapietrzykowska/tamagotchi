const { src, dest, watch, series } = require("gulp");
var sass = require("gulp-sass")(require("sass"));
const browsersync = require("browser-sync").create();

// Sass Task
function scssTask() {
  return src("./scss/style.scss").pipe(sass()).pipe(dest("./css"));
}

function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch(["**/*.html", "**/*.js"], browsersyncReload);
  watch("**/*.scss", series(scssTask, browsersyncReload));
}

exports.default = series(scssTask, browsersyncServe, watchTask);
