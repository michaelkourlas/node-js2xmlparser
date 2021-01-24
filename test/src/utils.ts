/**
 * Copyright (C) 2016-2020 Michael Kourlas
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

import { assert } from "chai";
import {
    isArray,
    isMap,
    isNull,
    isObject,
    isFunction,
    isSet,
    isUndefined,
    stringify,
} from "../../lib/utils";

describe("utils", () => {
    describe("#isUndefined", () => {
        it("should return true for undefined", () => {
            assert.isTrue(isUndefined(undefined));
        });

        it("should return false for values that are not undefined", () => {
            assert.isFalse(isUndefined("test"));
            assert.isFalse(isUndefined(3));
            assert.isFalse(isUndefined(null));
            assert.isFalse(isUndefined(true));
        });
    });

    describe("#isNull", () => {
        it("should return true for null", () => {
            assert.isTrue(isNull(null));
        });

        it("should return false for values that are not null", () => {
            assert.isFalse(isNull("test"));
            assert.isFalse(isNull(3));
            assert.isFalse(isNull(undefined));
            assert.isFalse(isNull(true));
        });
    });

    describe("#isObject", () => {
        it("should return true for objects", () => {
            assert.isTrue(isObject({ a: "b" }));
            assert.isTrue(isObject({}));
        });

        it("should return false for values that are not objects", () => {
            assert.isFalse(isObject("test"));
            assert.isFalse(isObject(3));
            assert.isFalse(isObject(undefined));
            assert.isFalse(isObject(true));
            assert.isFalse(isObject(null));
        });
    });

    describe("#isArray", () => {
        it("should return true for arrays", () => {
            assert.isTrue(isArray(["a", "b"]));
            assert.isTrue(isArray(["a", 3]));
            assert.isTrue(isArray([]));
        });

        it("should return false for values that are not arrays", () => {
            assert.isFalse(isArray("test"));
            assert.isFalse(isArray(3));
            assert.isFalse(isArray(undefined));
            assert.isFalse(isArray(true));
            assert.isFalse(isArray(null));
        });
    });

    describe("#isFunction", () => {
        it("should return true for functions", () => {
            assert.isTrue(isFunction(() => 0));
            assert.isTrue(isFunction(() => "test"));
        });

        it("should return false for values that are not functions", () => {
            assert.isFalse(isFunction("test"));
            assert.isFalse(isFunction(3));
            assert.isFalse(isFunction(undefined));
            assert.isFalse(isFunction(true));
            assert.isFalse(isFunction(null));
        });
    });

    describe("#isSet", () => {
        it("should return true for sets", () => {
            assert.isTrue(isSet(new Set()));
            assert.isTrue(isSet(new Set(["a", "b"])));
        });

        it("should return false for values that are not sets", () => {
            assert.isFalse(isSet("test"));
            assert.isFalse(isSet(3));
            assert.isFalse(isSet(undefined));
            assert.isFalse(isSet(true));
            assert.isFalse(isSet(null));
        });
    });

    describe("#isMap", () => {
        it("should return true for sets", () => {
            assert.isTrue(isMap(new Map()));
            assert.isTrue(
                isMap(
                    new Map([
                        ["a", "b"],
                        ["c", "d"],
                    ]),
                ),
            );
        });

        it("should return false for values that are not sets", () => {
            assert.isFalse(isMap("test"));
            assert.isFalse(isMap(3));
            assert.isFalse(isMap(undefined));
            assert.isFalse(isMap(true));
            assert.isFalse(isMap(null));
        });
    });

    describe("#stringify", () => {
        it("should return a valid string representation for all primitive types", () => {
            assert.strictEqual(stringify(null), "null");
            assert.strictEqual(stringify(undefined), "undefined");
            assert.strictEqual(stringify(3), "3");
            assert.strictEqual(stringify("test"), "test");
            assert.strictEqual(stringify(true), "true");
        });

        it(
            "should return a valid string representation for all object" +
                " versions of primitive types",
            () => {
                // noinspection JSPrimitiveTypeWrapperUsage
                assert.strictEqual(stringify(new Number(3)), "3");
                // noinspection JSPrimitiveTypeWrapperUsage
                assert.strictEqual(stringify(new String("test")), "test");
                // noinspection JSPrimitiveTypeWrapperUsage
                assert.strictEqual(stringify(new Boolean(true)), "true");
            },
        );
    });
});
