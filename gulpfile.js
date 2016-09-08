/**
 * Copyright (C) 2016 Michael Kourlas
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

var doc = require("gulp-typedoc");
var filter = require("gulp-filter");
var fs = require("fs");
var gulp = require("gulp");
var merge2 = require("merge2");
var mocha = require("gulp-mocha");
var sourcemaps = require('gulp-sourcemaps');
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");

gulp.task("default", ["prod", "test-prod", "docs"]);

var tsLibOptions = {
    "module": "commonjs",
    "target": "es5",
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "declaration": true
};
gulp.task("prod", function() {
    var tsResult = gulp.src("src/**/*.ts")
                       .pipe(tslint({formatter: "verbose"}))
                       .pipe(tslint.report())
                       .pipe(ts(tsLibOptions));
    return merge2([tsResult.js
                           .pipe(gulp.dest("lib")),
                   tsResult.dts
                           .pipe(gulp.dest("lib"))]);
});
gulp.task("dev", function() {
    var tsResult = gulp.src("src/**/*.ts")
                       .pipe(tslint({formatter: "verbose"}))
                       .pipe(tslint.report())
                       .pipe(sourcemaps.init())
                       .pipe(ts(tsLibOptions));
    return merge2([tsResult.js
                           .pipe(sourcemaps.write())
                           .pipe(gulp.dest("lib")),
                   tsResult.dts
                           .pipe(gulp.dest("lib"))]);
});

var docOptions = {
    module: "commonjs",
    target: "es5",
    out: "docs",
    mode: "file"
};
gulp.task("docs", function() {
    return gulp.src("src")
               .pipe(doc(docOptions));
});

var tsTestOptions = {
    "module": "commonjs",
    "target": "es5",
    "noImplicitAny": true,
    "noImplicitReturns": true
};
var dtsFilter = filter(["**/*.ts", "!**/*.d.ts"], {restore: true});
var test = function() {
    return gulp.src(["test/src/**/*.ts", "typings/index.d.ts"])
               .pipe(dtsFilter)
               .pipe(tslint({formatter: "verbose"}))
               .pipe(tslint.report())
               .pipe(dtsFilter.restore)
               .pipe(sourcemaps.init())
               .pipe(ts(tsTestOptions))
               .pipe(sourcemaps.write())
               .pipe(gulp.dest("test/lib"))
               .pipe(mocha());
};
gulp.task("test", ["prod"], test);
gulp.task("test-prod", ["prod"], test);
gulp.task("test-dev", ["dev"], test);
