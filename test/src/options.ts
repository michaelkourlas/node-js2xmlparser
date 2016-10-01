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

import {ITypeHandlers, IWrapHandlers, Options} from "../../lib/options";
import {assert} from "chai";

describe("options", () => {
    describe("#Options", () => {
        describe("aliasString", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    aliasString: "="
                };
                let originalOptions = options.aliasString;
                assert.strictEqual(new Options(options).aliasString,
                                   originalOptions);

                options.aliasString = "test";
                originalOptions = options.aliasString;
                assert.strictEqual(new Options(options).aliasString,
                                   originalOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                const options: any = {
                    aliasString: null
                };
                assert.throws(() => new Options(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                const options = {};
                assert.strictEqual(new Options(options).aliasString, "=");
            });
        });

        describe("attributeString", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    attributeString: "@"
                };
                let stringifiedOptions = options.attributeString;
                assert.strictEqual(
                    new Options(options).attributeString,
                    stringifiedOptions);

                options.attributeString = "test";
                stringifiedOptions = options.attributeString;
                assert.strictEqual(
                    new Options(options).attributeString,
                    stringifiedOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                const options: any = {
                    attributeString: null
                };
                assert.throws(() => new Options(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                const options = {};
                assert.strictEqual(new Options(options).attributeString,
                                   "@");
            });
        });

        describe("cdataInvalidChars", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    cdataInvalidChars: false
                };
                let originalOptions = options.cdataInvalidChars;
                assert.strictEqual(
                    new Options(options).cdataInvalidChars,
                    originalOptions);

                options.cdataInvalidChars = true;
                originalOptions = options.cdataInvalidChars;
                assert.strictEqual(
                    new Options(options).cdataInvalidChars,
                    originalOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                const options: any = {
                    cdataInvalidChars: null
                };
                assert.throws(() => new Options(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                const options = {};
                assert.strictEqual(new Options(options).cdataInvalidChars,
                                   false);
            });
        });

        describe("cdataKeys", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    cdataKeys: ["test", "test2"]
                };
                let stringifiedOptions = JSON.stringify(options.cdataKeys);
                assert.strictEqual(
                    JSON.stringify(new Options(options).cdataKeys),
                    stringifiedOptions);

                options.cdataKeys = [];
                stringifiedOptions = JSON.stringify(options.cdataKeys);
                assert.strictEqual(
                    JSON.stringify(new Options(options).cdataKeys),
                    stringifiedOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    cdataKeys: null
                };
                assert.throws(() => new Options(options));

                options = {
                    cdataKeys: [false]
                };
                assert.throws(() => new Options(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                const options = {};
                assert.strictEqual(
                    JSON.stringify(new Options(options).cdataKeys),
                    JSON.stringify([]));
            });
        });

        describe("declaration", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    declaration: {
                        include: true
                    }
                };
                let stringifiedOptions = JSON.stringify(options.declaration);
                assert.strictEqual(
                    JSON.stringify(new Options(options).declaration),
                    stringifiedOptions);

                options.declaration = {
                    include: false
                };
                stringifiedOptions = JSON.stringify(options.declaration);
                assert.strictEqual(
                    JSON.stringify(new Options(options).declaration),
                    stringifiedOptions);
            });

            it("should throw an error if the specified options object"
               + " contains invalid options", () => {
                let options: any = {
                    declaration: {
                        include: null
                    }
                };
                assert.throws(() => new Options(options));

                options = {
                    declaration: null
                };
                assert.throws(() => new Options(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                const options = {};
                const validatedOptions = new Options(options);
                assert.strictEqual(
                    JSON.stringify(validatedOptions.declaration),
                    JSON.stringify({include: true}));
            });
        });

        describe("dtd", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    dtd: {
                        include: false
                    }
                };
                let stringifiedOptions = JSON.stringify(options.dtd);
                assert.strictEqual(
                    JSON.stringify(new Options(options).dtd),
                    stringifiedOptions);

                options.dtd = {
                    include: true
                };
                stringifiedOptions = JSON.stringify(options.dtd);
                assert.strictEqual(
                    JSON.stringify(new Options(options).dtd),
                    stringifiedOptions);
            });

            it("should throw an error if the specified options object"
               + " contains invalid options", () => {
                let options: any = {
                    dtd: {
                        include: null
                    }
                };
                assert.throws(() => new Options(options));

                options = {
                    dtd: null
                };
                assert.throws(() => new Options(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                const options = {};
                const validatedOptions = new Options(options);
                assert.strictEqual(
                    JSON.stringify(validatedOptions.dtd),
                    JSON.stringify({include: false}));
            });
        });

        describe("format", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    format: {}
                };
                const stringifiedOptions = JSON.stringify(options.format);
                assert.strictEqual(
                    JSON.stringify(new Options(options).format),
                    stringifiedOptions);
            });

            it("should throw an error if the specified options object"
               + " contains invalid options", () => {
                const options: any = {
                    format: null
                };
                assert.throws(() => new Options(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                const options = {};
                const validatedOptions = new Options(options);
                assert.strictEqual(
                    JSON.stringify(validatedOptions.format),
                    JSON.stringify({}));
            });
        });

        describe("typeHandlers", () => {
            it("should leave the specified property unchanged if valid", () => {
                const typeHandlers: ITypeHandlers = {
                    "test1": () => {
                        return "test2";
                    },
                    "test3": () => {
                        return "test4";
                    }
                };
                const options = {
                    typeHandlers
                };
                let stringifiedOptions = JSON.stringify(
                    options.typeHandlers);
                assert.strictEqual(
                    JSON.stringify(
                        new Options(options).typeHandlers),
                    stringifiedOptions);

                options.typeHandlers = {};
                stringifiedOptions = JSON.stringify(
                    options.typeHandlers);
                assert.strictEqual(
                    JSON.stringify(
                        new Options(options).typeHandlers),
                    stringifiedOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    typeHandlers: null
                };
                assert.throws(() => new Options(options));

                options = {
                    typeHandlers: {
                        "test": null
                    }
                };
                assert.throws(() => new Options(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                const options = {};
                assert.strictEqual(
                    JSON.stringify(new Options(options).typeHandlers),
                    JSON.stringify({}));
            });
        });

        describe("valueString", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    valueString: "#"
                };
                let originalOptions = options.valueString;
                assert.strictEqual(
                    new Options(options).valueString,
                    originalOptions);

                options.valueString = "test";
                originalOptions = options.valueString;
                assert.strictEqual(
                    new Options(options).valueString,
                    originalOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                const options: any = {
                    valueString: null
                };
                assert.throws(() => new Options(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                const options = {};
                assert.strictEqual(new Options(options).valueString,
                                   "#");
            });
        });

        describe("wrapHandlers", () => {
            it("should leave the specified property unchanged if valid", () => {
                const wrapHandlers: IWrapHandlers = {
                    "test1": () => {
                        return "test2";
                    },
                    "test3": () => {
                        return "test4";
                    }
                };
                const options = {
                    wrapHandlers
                };
                let stringifiedOptions = JSON.stringify(
                    options.wrapHandlers);
                assert.strictEqual(
                    JSON.stringify(
                        new Options(options).wrapHandlers),
                    stringifiedOptions);

                options.wrapHandlers = {};
                stringifiedOptions = JSON.stringify(
                    options.wrapHandlers);
                assert.strictEqual(
                    JSON.stringify(
                        new Options(options).wrapHandlers),
                    stringifiedOptions);
            });

            it("should throw an error if the value of the property is"
               + " invalid", () => {
                let options: any = {
                    wrapHandlers: null
                };
                assert.throws(() => new Options(options));

                options = {
                    wrapHandlers: {
                        "test": null
                    }
                };
                assert.throws(() => new Options(options));
            });

            it("should return a validated version of the specified property"
               + " if undefined", () => {
                const options = {};
                assert.strictEqual(
                    JSON.stringify(new Options(options).wrapHandlers),
                    JSON.stringify({}));
            });
        });
    });
});
