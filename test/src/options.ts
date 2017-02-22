/**
 * Copyright (C) 2016-2017 Michael Kourlas
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
import {assert} from "chai";
import {ITypeHandlers, IWrapHandlers, Options} from "../../lib/options";

describe("options", () => {
    describe("#Options", () => {
        describe("aliasString", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    aliasString: "="
                };
                assert.strictEqual(new Options(options).aliasString,
                                   options.aliasString);

                options.aliasString = "test";
                assert.strictEqual(new Options(options).aliasString,
                                   options.aliasString);
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
                assert.strictEqual(
                    new Options(options).attributeString,
                    options.attributeString);

                options.attributeString = "test";
                assert.strictEqual(
                    new Options(options).attributeString,
                    options.attributeString);
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
                assert.strictEqual(
                    new Options(options).cdataInvalidChars,
                    options.cdataInvalidChars);

                options.cdataInvalidChars = true;
                assert.strictEqual(
                    new Options(options).cdataInvalidChars,
                    options.cdataInvalidChars);
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
                assert.deepEqual(new Options(options).cdataKeys,
                                 options.cdataKeys);

                options.cdataKeys = [];
                assert.deepEqual(new Options(options).cdataKeys,
                                 options.cdataKeys);
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
                assert.deepEqual(new Options(options).cdataKeys, []);
            });
        });

        describe("declaration", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    declaration: {
                        encoding: undefined,
                        include: true,
                        standalone: undefined,
                        version: undefined
                    }
                };
                assert.deepEqual(new Options(options).declaration,
                                 options.declaration);

                options.declaration = {
                    encoding: undefined,
                    include: false,
                    standalone: undefined,
                    version: undefined
                };
                assert.deepEqual(new Options(options).declaration,
                                 options.declaration);
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
                assert.deepEqual(new Options(options).declaration,
                                 {
                                     encoding: undefined,
                                     include: true,
                                     standalone: undefined,
                                     version: undefined
                                 });
            });
        });

        describe("dtd", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    dtd: {
                        include: false,
                        name: undefined,
                        pubId: undefined,
                        sysId: undefined
                    }
                };
                assert.deepEqual(new Options(options).dtd,
                                 options.dtd);

                options.dtd = {
                    include: true,
                    name: undefined,
                    pubId: undefined,
                    sysId: undefined
                };
                assert.deepEqual(new Options(options).dtd,
                                 options.dtd);
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
                assert.deepEqual(new Options(options).dtd,
                                 {
                                     include: false,
                                     name: undefined,
                                     pubId: undefined,
                                     sysId: undefined
                                 });
            });
        });

        describe("format", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    format: {
                        doubleQuotes: undefined,
                        indent: undefined,
                        newline: undefined,
                        pretty: undefined
                    }
                };
                assert.deepEqual(new Options(options).format,
                                 options.format);
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
                assert.deepEqual(new Options(options).format,
                                 {
                                     doubleQuotes: undefined,
                                     indent: undefined,
                                     newline: undefined,
                                     pretty: undefined
                                 });
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
                assert.deepEqual(new Options(options).typeHandlers,
                                 options.typeHandlers);

                options.typeHandlers = {};
                assert.deepEqual(new Options(options).typeHandlers,
                                 options.typeHandlers);
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
                assert.deepEqual(new Options(options).typeHandlers, {});
            });
        });

        describe("valueString", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    valueString: "#"
                };
                assert.strictEqual(
                    new Options(options).valueString,
                    options.valueString);

                options.valueString = "test";
                assert.strictEqual(
                    new Options(options).valueString,
                    options.valueString);
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
                assert.deepEqual(new Options(options).wrapHandlers,
                                 options.wrapHandlers);

                options.wrapHandlers = {};
                assert.deepEqual(new Options(options).wrapHandlers,
                                 options.wrapHandlers);
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
                assert.deepEqual(new Options(options).wrapHandlers, {});
            });
        });
    });
});
