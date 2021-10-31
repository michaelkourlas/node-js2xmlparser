/**
 * Copyright (C) 2020-2021 Michael Kourlas
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

module.exports = {
    env: {
        node: true,
    },
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    rules: {
        // Maximum line length of 80
        "max-len": ["error", {code: 80}],

        // Too late to change this, since interfaces are part of the public API
        "@typescript-eslint/interface-name-prefix": 0,

        // Too much noise
        "@typescript-eslint/explicit-function-return-type": 0,

        // Allow private functions at bottom of file
        "@typescript-eslint/no-use-before-define": 0,

        // Allow private constructors
        "@typescript-eslint/no-empty-function": [
            "error",
            {allow: ["private-constructors"]},
        ],
    },
};
