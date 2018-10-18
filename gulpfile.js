var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var cleanCompiledTypeScript = require('gulp-clean-compiled-typescript');
var through = require('through2');
var del = require('del');
var gulpCopy = require('gulp-copy');
var watch = require('gulp-watch');


var config = {
    buildPath: './build/',
    src: {
        javascript: {
            dependencies: [
                './node_modules/jquery/dist/jquery.min.js'
            ],
            assets: [
            ]
        },
        typescript: {
            dependencies: [],
            assets: [
                './src/*.ts'
            ]
        },
        css: {
            dependencies: [
            ],
            assets: [
            ]
        },
        scss: {
            dependencies: [],
            assets: [
                './src/*.scss'
            ]
        },
        fonts: {
            dependencies: [],
            assets: []
        },
        images: {
            dependencies: [],
            assets: []
        }
    }
};


// удалет все скомпилированые js файлы из TypeScript
gulp.task('clean_compiled_type_script', function () {
    return gulp.src(config.src.typescript.assets)
        .pipe(cleanCompiledTypeScript());
});

// удалет все скомпилированые css файлы из SCSS
gulp.task('clean_compiled_scss', function () {
    // noinspection JSUnresolvedFunction
    return gulp.src(config.src.scss.assets)
        .pipe(through.obj(function (file, encoding, callback) {
            var regex = /.(scss)$/;

            if (regex.test(file.path)) {
                var compiledFile = file.path.replace(regex, '.css');
                var mapFile = file.path.replace(regex, '.css.map');
                del.sync([compiledFile, mapFile]);
            }

            callback();
        }));
});

// собирает все js из зависимостей
gulp.task('dependencies_javascript', function () {
    return gulp.src(config.src.javascript.dependencies)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('dependencies_javascript.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.buildPath));
});

// собирает все js из проекта
gulp.task('assets_javascript', ['clean_compiled_type_script'], function () {
    return gulp.src(config.src.javascript.assets)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('assets_javascript.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.buildPath));
});

// компилит и собирает все ts из проекта
gulp.task('assets_typescript', function () {
    return gulp.src(config.src.typescript.assets)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(ts({
            noImplicitAny: false,
            outFile: 'assets_typescript.js',
            "target": "es5"
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.buildPath));
});

// собирает все css из зависимостей
gulp.task('dependencies_css', function () {
    return gulp.src(config.src.css.dependencies)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('dependencies_css.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.buildPath));
});

// собирает все css из проекта
gulp.task('assets_css', ['clean_compiled_scss'], function () {
    return gulp.src(config.src.css.assets)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('assets_css.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.buildPath));
});

// собирает все scss из проекта
gulp.task('assets_scss', function () {
    // noinspection JSUnresolvedFunction
    return gulp.src(config.src.scss.assets)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('assets_scss.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.buildPath));
});

// собирает все шрифты из зависимостей
gulp.task('fonts', function () {
    gulp.src(config.src.fonts.dependencies)
        .pipe(gulpCopy(config.buildPath, {prefix: 4}))
});

// собирает все картинки из проекта
gulp.task('images', function () {
    gulp.src(config.src.images.assets)
        .pipe(gulpCopy('./public/bundles/crmkernel', {prefix: 5}))
});

gulp.task('watch', function () {
    Object.keys(config.src).forEach(function (key) {
        watch(config.src[key].assets, function () {
            // noinspection JSUnresolvedFunction
            gulp.start('assets_' + key);
        });
    });
});

gulp.task('default', [
    'dependencies_javascript',
    'assets_javascript',
    'assets_typescript',
    'dependencies_css',
    'assets_css',
    'assets_scss',
    'fonts',
    'images'
]);