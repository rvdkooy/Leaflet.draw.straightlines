var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('watch', function () {
    gulp.watch(['src/*.js'], [ 'default' ]);
});

gulp.task('js', function(){
	gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename('leaflet.draw.straightlines.min.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('default',  [ 'js', 'watch' ]);
gulp.task('compile', [ 'js' ]);