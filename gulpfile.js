const gulp = require("gulp");
const templatize = require("../Templateizer/templateizer-gulp.js");

gulp.task('pages', _ => {
    return gulp.src('src/partials/**/*.html')
               .pipe(templatize('src/template.html'))
               .pipe(gulp.dest('./build'));
});

gulp.task('lib', _ => {
    return gulp.src(['src/lib/**/*', '!src/lib/components/*'])
               .pipe(gulp.dest('./build'));
})

gulp.task('default', ['pages', 'lib']);

const watcher = gulp.watch('src/**/*', ['default']);

watcher.on('change', evt => {
    console.log(`File ${evt.path} was ${evt.type}, running tasks...`);
});