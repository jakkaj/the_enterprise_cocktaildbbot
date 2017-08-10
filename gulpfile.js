var gulp = require('gulp');
var run = require('gulp-run');

gulp.task('build', function () {

    var cmd = new run.Command('tsc -p ./src');  // create a command object for `cat`. 
    cmd.exec();


    gulp.src('./package.json')
        .pipe(gulp.dest('./output/run'));

    gulp.src('./function.json')
        .pipe(gulp.dest('./output/run'))

});