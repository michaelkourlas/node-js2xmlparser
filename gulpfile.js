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
var gulp = require("gulp");
var merge2 = require("merge2");
var mocha = require("gulp-mocha");
var sourcemaps = require('gulp-sourcemaps');
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");

gulp.task("default", ["prod", "test-prod", "docs"]);

var tsProject = ts.createProject("tsconfig.json");
gulp.task("prod", function() {
    var tsResult = tsProject.src()
                            .pipe(tslint())
                            .pipe(tslint.report())
                            .pipe(tsProject(ts.reporter.longReporter()));
    return merge2([tsResult.js
                           .pipe(gulp.dest("lib")),
                   tsResult.dts
                           .pipe(gulp.dest("lib"))]);
});
gulp.task("dev", function() {
    var tsResult = tsProject.src()
                            .pipe(tslint())
                            .pipe(tslint.report())
                            .pipe(sourcemaps.init())
                            .pipe(tsProject(ts.reporter.longReporter()));
    return merge2([tsResult.js
                           .pipe(sourcemaps.write())
                           .pipe(gulp.dest("lib")),
                   tsResult.dts
                           .pipe(gulp.dest("lib"))]);
});

var testTsProject = ts.createProject("test/tsconfig.json");
var test = function() {
    return testTsProject.src()
                        .pipe(tslint())
                        .pipe(tslint.report())
                        .pipe(sourcemaps.init())
                        .pipe(testTsProject(ts.reporter.longReporter()))
                        .pipe(sourcemaps.write())
                        .pipe(gulp.dest("test/lib"))
                        .pipe(mocha());
};
gulp.task("test", ["prod"], test);
gulp.task("test-prod", ["prod"], test);
gulp.task("test-dev", ["dev"], test);

var docOptions = {
    mode: "file",
    module: "commonjs",
    out: "docs",
    target: "es5",
    // TODO: Remove this option once TypeDoc supports TypeScript 2.0
    ignoreCompilerErrors: true
};
gulp.task("docs", function() {
    return gulp.src("src")
               .pipe(doc(docOptions));
});
