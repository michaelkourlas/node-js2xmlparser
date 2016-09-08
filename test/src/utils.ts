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

import {isType, stringify} from "../../lib/utils";
import {assert} from "chai";

describe("utils", () => {
    describe("#isType", () => {
        it("should return true if the specified value is of the specified"
           + " types", () => {
            assert.isTrue(isType(true, "Boolean"));
            assert.isTrue(isType(true, "String", "Boolean"));
            assert.isTrue(isType(undefined, "Undefined"));
            assert.isTrue(isType(null, "Null"));
            assert.isTrue(isType("blah", "String"));
        });

        it("should return false if the specified value is not of the specified"
           + " types", () => {
            assert.isFalse(isType("blah", "Boolean"));
            assert.isFalse(isType(true, "String", "Undefined"));
        });
    });

    describe("#stringify", () => {
        it("should return a valid string representation for all primitive"
           + " types", () => {
            assert.strictEqual(stringify(null), "null");
            assert.strictEqual(stringify(undefined), "undefined");
            assert.strictEqual(stringify(3), "3");
            assert.strictEqual(stringify("test"), "test");
            assert.strictEqual(stringify(true), "true");
        });

        it("should return a valid string representation for all object"
           + " versions of primitive types", () => {
            /* tslint:disable no-construct */
            // noinspection JSPrimitiveTypeWrapperUsage
            assert.strictEqual(stringify(new Number(3)), "3");
            // noinspection JSPrimitiveTypeWrapperUsage
            assert.strictEqual(stringify(new String("test")), "test");
            // noinspection JSPrimitiveTypeWrapperUsage
            assert.strictEqual(stringify(new Boolean(true)), "true");
            /* tslint:enable no-construct */
        });
    });
});
