/**
  * Copyright 2018 Benjamin Blais
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License. 
  */
const gulp = require("gulp");
const templatize = require("../Templateizer/templateizer-gulp.js");

gulp.task('pages', _ => {
    return gulp.src('src/partials/**/*.html')
               .pipe(templatize('src/template.html'))
               .pipe(gulp.dest('./docs'));
});

gulp.task('lib', _ => {
    return gulp.src(['src/lib/**/*', '!src/lib/components/**/*', '!src/lib/components'])
               .pipe(gulp.dest('./docs'));
})

gulp.task('default', ['pages', 'lib']);

const watcher = gulp.watch('src/**/*', ['default']);

watcher.on('change', evt => {
    console.log(`File ${evt.path} was ${evt.type}, running tasks...`);
});