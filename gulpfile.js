const gulp = require("gulp");
const templatize = require("../Templateizer/templateizer-gulp.js");

gulp.task('pages', _ => {
    return gulp.src('src/partials/**/*.html')
               .pipe(templatize('src/template.html'))
               .pipe(gulp.dest('./build'));
});

gulp.task('default', ['pages']);