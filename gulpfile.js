/**
 * Copyright (C) 2016-2018 Michael Kourlas
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

var del = require("del");
var gulp = require("gulp");
var merge2 = require("merge2");
var mocha = require("gulp-mocha");
var sourcemaps = require("gulp-sourcemaps");
var typescript = require("gulp-typescript");
var tslint = require("gulp-tslint");
var typedoc = require("gulp-typedoc");

gulp.task("clean", function() {
    return del("lib");
});

gulp.task("clean-test", function() {
    return del("test/lib");
});

gulp.task("clean-docs", function() {
    return del("docs");
});

var tsProject = typescript.createProject("tsconfig.json");
gulp.task("prod", gulp.series("clean", function() {
    var tsResult = tsProject.src()
                            .pipe(tslint())
                            .pipe(tslint.report())
                            .pipe(tsProject())
                            .on("error", function() {
                                this.on("finish", function() {
                                    process.exit(1);
                                });
                            });
    return merge2([tsResult.js
                           .pipe(gulp.dest("lib")),
                   tsResult.dts
                           .pipe(gulp.dest("lib"))]);
}));
gulp.task("dev", gulp.series("clean", function() {
    var tsResult = tsProject.src()
                            .pipe(tslint())
                            .pipe(tslint.report())
                            .pipe(sourcemaps.init())
                            .pipe(tsProject())
                            .on("error", function() {
                                this.on("finish", function() {
                                    process.exit(1);
                                });
                            });
    return merge2([tsResult.js
                           .pipe(sourcemaps.write())
                           .pipe(gulp.dest("lib")),
                   tsResult.dts
                           .pipe(gulp.dest("lib"))]);
}));

var testTsProject = typescript.createProject("test/tsconfig.json");

function testProd() {
    return testTsProject.src()
                        .pipe(tslint())
                        .pipe(tslint.report())
                        .pipe(testTsProject())
                        .on("error", function() {
                            this.on("finish", function() {
                                process.exit(1);
                            });
                        })
                        .pipe(gulp.dest("test/lib"))
                        .pipe(mocha());
}

gulp.task("test-prod", gulp.series(gulp.parallel("prod", "clean-test"),
                                   testProd));

function testDev() {
    return testTsProject.src()
                        .pipe(tslint())
                        .pipe(tslint.report())
                        .pipe(sourcemaps.init())
                        .pipe(testTsProject())
                        .on("error", function() {
                            this.on("finish", function() {
                                process.exit(1);
                            });
                        })
                        .pipe(sourcemaps.write())
                        .pipe(gulp.dest("test/lib"))
                        .pipe(mocha());
}

gulp.task("test-dev", gulp.series(gulp.parallel("dev", "clean-test"), testDev));
gulp.task("test", gulp.series("test-prod"));

var docOptions = {
    mode: "file",
    module: "commonjs",
    out: "docs",
    target: "es5",
    tsconfig: "tsconfig.json"
};

function docs() {
    return gulp.src("src")
               .pipe(typedoc(docOptions));
}

gulp.task("docs", gulp.series(gulp.parallel("prod", "clean-docs"), docs));

gulp.task("default",
          gulp.series("prod",
                      gulp.parallel(gulp.series("clean-test", testProd),
                                    gulp.series("clean-docs", docs))));
