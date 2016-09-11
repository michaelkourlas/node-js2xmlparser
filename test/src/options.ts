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
    ITypeHandlers,
    IWrapHandlers,
    validateOptions
} from "../../lib/options";
import {assert} from "chai";

describe("options", () => {
    describe("#validateOptions", () => {
        describe("aliasString", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    aliasString: "="
                };
                let originalOptions = options.aliasString;
                assert.strictEqual(
                    validateOptions(options).aliasString,
                    originalOptions);

                options.aliasString = "test";
                originalOptions = options.aliasString;
                assert.strictEqual(
                    validateOptions(options).aliasString,
                    originalOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    aliasString: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                assert.strictEqual(validateOptions(options).aliasString, "=");
            });
        });

        describe("attributeString", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    attributeString: "@"
                };
                let stringifiedOptions = options.attributeString;
                assert.strictEqual(
                    validateOptions(options).attributeString,
                    stringifiedOptions);

                options.attributeString = "test";
                stringifiedOptions = options.attributeString;
                assert.strictEqual(
                    validateOptions(options).attributeString,
                    stringifiedOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    attributeString: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                assert.strictEqual(validateOptions(options).attributeString,
                                   "@");
            });
        });

        describe("cdataInvalidChars", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    cdataInvalidChars: false
                };
                let originalOptions = options.cdataInvalidChars;
                assert.strictEqual(
                    validateOptions(options).cdataInvalidChars,
                    originalOptions);

                options.cdataInvalidChars = true;
                originalOptions = options.cdataInvalidChars;
                assert.strictEqual(
                    validateOptions(options).cdataInvalidChars,
                    originalOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    cdataInvalidChars: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                assert.strictEqual(validateOptions(options).cdataInvalidChars,
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
                    cdataKeys: null
                };
                assert.throws(() => validateOptions(options));

                options = {
                    cdataKeys: [false]
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

        describe("declaration", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    declaration: {
                        include: true
                    }
                };
                let stringifiedOptions = JSON.stringify(options.declaration);
                assert.strictEqual(
                    JSON.stringify(validateOptions(options).declaration),
                    stringifiedOptions);

                options.declaration = {
                    include: false
                };
                stringifiedOptions = JSON.stringify(options.declaration);
                assert.strictEqual(
                    JSON.stringify(validateOptions(options).declaration),
                    stringifiedOptions);
            });

            it("should throw an error if the specified options object"
               + " contains invalid options", () => {
                let options: any = {
                    declaration: {
                        include: null
                    }
                };
                assert.throws(() => validateOptions(options));

                options = {
                    declaration: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                let validatedOptions = validateOptions(options);
                assert.strictEqual(
                    JSON.stringify(validatedOptions.declaration),
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

        describe("valueString", () => {
            it("should leave the specified property unchanged if valid", () => {
                let options = {
                    valueString: "#"
                };
                let originalOptions = options.valueString;
                assert.strictEqual(
                    validateOptions(options).valueString,
                    originalOptions);

                options.valueString = "test";
                originalOptions = options.valueString;
                assert.strictEqual(
                    validateOptions(options).valueString,
                    originalOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    valueString: null
                };
                assert.throws(() => validateOptions(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                let options = {};
                assert.strictEqual(validateOptions(options).valueString,
                                   "#");
            });
        });

        describe("wrapHandlers", () => {
            it("should leave the specified property unchanged if valid", () => {
                let wrapHandlers: IWrapHandlers = {
                    "test1": () => {
                        return "test2";
                    },
                    "test3": () => {
                        return "test4";
                    }
                };
                let options = {
                    wrapHandlers
                };
                let stringifiedOptions = JSON.stringify(
                    options.wrapHandlers);
                assert.strictEqual(
                    JSON.stringify(
                        validateOptions(options).wrapHandlers),
                    stringifiedOptions);

                options.wrapHandlers = {};
                stringifiedOptions = JSON.stringify(
                    options.wrapHandlers);
                assert.strictEqual(
                    JSON.stringify(
                        validateOptions(options).wrapHandlers),
                    stringifiedOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    wrapHandlers: null
                };
                assert.throws(() => validateOptions(options));

                options = {
                    wrapHandlers: {
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
                        options).wrapHandlers),
                    JSON.stringify({}));
            });
        });
    });
});
