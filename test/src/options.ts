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

import {
    IArraySetWrapHandlers,
    ITypeHandlers,
    validateOptions
} from "../../lib/options";
import {assert} from "chai";

describe("options", () => {
    describe("#validateOptions", () => {
        describe("alias", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    alias: "__alias"
                };
                let originalOptions = options.alias;
                assert.strictEqual(
                    validateOptions(options).alias,
                    originalOptions);

                options.alias = "test";
                originalOptions = options.alias;
                assert.strictEqual(
                    validateOptions(options).alias,
                    originalOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    alias: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                assert.strictEqual(validateOptions(options).alias, "__alias");
            });
        });

        describe("arraySetWrapHandlers", () => {
            it("should leave the specified property unchanged if valid", () => {
                let arraySetWrapHandlers: IArraySetWrapHandlers = {
                    "test1": () => {
                        return "test2";
                    },
                    "test3": () => {
                        return "test4";
                    }
                };
                let options = {
                    arraySetWrapHandlers
                };
                let stringifiedOptions = JSON.stringify(
                    options.arraySetWrapHandlers);
                assert.strictEqual(
                    JSON.stringify(
                        validateOptions(options).arraySetWrapHandlers),
                    stringifiedOptions);

                options.arraySetWrapHandlers = {};
                stringifiedOptions = JSON.stringify(
                    options.arraySetWrapHandlers);
                assert.strictEqual(
                    JSON.stringify(
                        validateOptions(options).arraySetWrapHandlers),
                    stringifiedOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    arraySetWrapHandlers: null
                };
                assert.throws(() => validateOptions(options));

                options = {
                    arraySetWrapHandlers: {
                        "test": null
                    }
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                assert.strictEqual(
                    JSON.stringify(validateOptions(
                        options).arraySetWrapHandlers),
                    JSON.stringify({}));
            });
        });

        describe("attrPrefix", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    attrPrefix: "__attr"
                };
                let stringifiedOptions = options.attrPrefix;
                assert.strictEqual(
                    validateOptions(options).attrPrefix,
                    stringifiedOptions);

                options.attrPrefix = "test";
                stringifiedOptions = options.attrPrefix;
                assert.strictEqual(
                    validateOptions(options).attrPrefix,
                    stringifiedOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    attrPrefix: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                assert.strictEqual(validateOptions(options).attrPrefix,
                                   "__attr");
            });
        });

        describe("cdata", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    cdata: false
                };
                let originalOptions = options.cdata;
                assert.strictEqual(
                    validateOptions(options).cdata,
                    originalOptions);

                options.cdata = true;
                originalOptions = options.cdata;
                assert.strictEqual(
                    validateOptions(options).cdata,
                    originalOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    cdata: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                assert.strictEqual(validateOptions(options).cdata,
                                   false);
            });
        });

        describe("cdataKeys", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    cdataKeys: ["test", "test2"]
                };
                let stringifiedOptions = JSON.stringify(options.cdataKeys);
                assert.strictEqual(
                    JSON.stringify(validateOptions(options).cdataKeys),
                    stringifiedOptions);

                options.cdataKeys = [];
                stringifiedOptions = JSON.stringify(options.cdataKeys);
                assert.strictEqual(
                    JSON.stringify(validateOptions(options).cdataKeys),
                    stringifiedOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    cdata: null
                };
                assert.throws(() => validateOptions(options));

                options = {
                    cdata: [false]
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                assert.strictEqual(
                    JSON.stringify(validateOptions(options).cdataKeys),
                    JSON.stringify([]));
            });
        });

        describe("decl", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    decl: {
                        include: true
                    }
                };
                let stringifiedOptions = JSON.stringify(options.decl);
                assert.strictEqual(
                    JSON.stringify(validateOptions(options).decl),
                    stringifiedOptions);

                options.decl = {
                    include: false
                };
                stringifiedOptions = JSON.stringify(options.decl);
                assert.strictEqual(
                    JSON.stringify(validateOptions(options).decl),
                    stringifiedOptions);
            });

            it("should throw an error if the specified options object"
               + " contains invalid options", () => {
                let options: any = {
                    decl: {
                        include: null
                    }
                };
                assert.throws(() => validateOptions(options));

                options = {
                    decl: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                let validatedOptions = validateOptions(options);
                assert.strictEqual(
                    JSON.stringify(validatedOptions.decl),
                    JSON.stringify({include: true}));
            });
        });

        describe("dtd", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    dtd: {
                        include: false
                    }
                };
                let stringifiedOptions = JSON.stringify(options.dtd);
                assert.strictEqual(
                    JSON.stringify(validateOptions(options).dtd),
                    stringifiedOptions);

                options.dtd = {
                    include: true
                };
                stringifiedOptions = JSON.stringify(options.dtd);
                assert.strictEqual(
                    JSON.stringify(validateOptions(options).dtd),
                    stringifiedOptions);
            });

            it("should throw an error if the specified options object"
               + " contains invalid options", () => {
                let options: any = {
                    dtd: {
                        include: null
                    }
                };
                assert.throws(() => validateOptions(options));

                options = {
                    dtd: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                let validatedOptions = validateOptions(options);
                assert.strictEqual(
                    JSON.stringify(validatedOptions.dtd),
                    JSON.stringify({include: false}));
            });
        });

        describe("format", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    format: {}
                };
                let stringifiedOptions = JSON.stringify(options.format);
                assert.strictEqual(
                    JSON.stringify(validateOptions(options).format),
                    stringifiedOptions);
            });

            it("should throw an error if the specified options object"
               + " contains invalid options", () => {
                let options: any = {
                    format: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                let validatedOptions = validateOptions(options);
                assert.strictEqual(
                    JSON.stringify(validatedOptions.format),
                    JSON.stringify({}));
            });
        });

        describe("typeHandlers", () => {
            it("should leave the specified property unchanged if valid", () => {
                let typeHandlers: ITypeHandlers = {
                    "test1": () => {
                        return "test2";
                    },
                    "test3": () => {
                        return "test4";
                    }
                };
                let options = {
                    typeHandlers
                };
                let stringifiedOptions = JSON.stringify(
                    options.typeHandlers);
                assert.strictEqual(
                    JSON.stringify(
                        validateOptions(options).typeHandlers),
                    stringifiedOptions);

                options.typeHandlers = {};
                stringifiedOptions = JSON.stringify(
                    options.typeHandlers);
                assert.strictEqual(
                    JSON.stringify(
                        validateOptions(options).typeHandlers),
                    stringifiedOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    typeHandlers: null
                };
                assert.throws(() => validateOptions(options));

                options = {
                    typeHandlers: {
                        "test": null
                    }
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                assert.strictEqual(
                    JSON.stringify(validateOptions(
                        options).typeHandlers),
                    JSON.stringify({}));
            });
        });

        describe("valPrefix", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    valPrefix: "__val"
                };
                let originalOptions = options.valPrefix;
                assert.strictEqual(
                    validateOptions(options).valPrefix,
                    originalOptions);

                options.valPrefix = "test";
                originalOptions = options.valPrefix;
                assert.strictEqual(
                    validateOptions(options).valPrefix,
                    originalOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    valPrefix: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                assert.strictEqual(validateOptions(options).valPrefix,
                                   "__val");
            });
        });
    });
});
