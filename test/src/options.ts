/**
 * Copyright (C) 2016-2019 Michael Kourlas
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
import { ITypeHandlers, IWrapHandlers, Options } from "../../lib/options";

describe("options", () => {
    describe("#Options", () => {
        describe("aliasString", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    aliasString: "=",
                };
                assert.strictEqual(
                    new Options(options).aliasString,
                    options.aliasString,
                );

                options.aliasString = "test";
                assert.strictEqual(
                    new Options(options).aliasString,
                    options.aliasString,
                );
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.strictEqual(new Options(options).aliasString, "=");
                },
            );
        });

        describe("attributeString", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    attributeString: "@",
                };
                assert.strictEqual(
                    new Options(options).attributeString,
                    options.attributeString,
                );

                options.attributeString = "test";
                assert.strictEqual(
                    new Options(options).attributeString,
                    options.attributeString,
                );
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.strictEqual(
                        new Options(options).attributeString,
                        "@",
                    );
                },
            );
        });

        describe("cdataInvalidChars", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    cdataInvalidChars: false,
                };
                assert.strictEqual(
                    new Options(options).cdataInvalidChars,
                    options.cdataInvalidChars,
                );

                options.cdataInvalidChars = true;
                assert.strictEqual(
                    new Options(options).cdataInvalidChars,
                    options.cdataInvalidChars,
                );
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.strictEqual(
                        new Options(options).cdataInvalidChars,
                        false,
                    );
                },
            );
        });

        describe("cdataKeys", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    cdataKeys: ["test", "test2"],
                };
                assert.deepEqual(
                    new Options(options).cdataKeys,
                    options.cdataKeys,
                );

                options.cdataKeys = [];
                assert.deepEqual(
                    new Options(options).cdataKeys,
                    options.cdataKeys,
                );
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.deepEqual(new Options(options).cdataKeys, []);
                },
            );
        });

        describe("declaration", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    declaration: {
                        encoding: undefined,
                        include: true,
                        standalone: undefined,
                        version: undefined,
                    },
                };
                assert.deepEqual(
                    new Options(options).declaration,
                    options.declaration,
                );

                options.declaration = {
                    encoding: undefined,
                    include: false,
                    standalone: undefined,
                    version: undefined,
                };
                assert.deepEqual(
                    new Options(options).declaration,
                    options.declaration,
                );
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.deepEqual(new Options(options).declaration, {
                        encoding: undefined,
                        include: true,
                        standalone: undefined,
                        version: undefined,
                    });
                },
            );
        });

        describe("dtd", () => {
            it("should leave the specified property unchanged if valid", () => {
                {
                    const options = {
                        dtd: {
                            include: false,
                            name: undefined,
                            pubId: undefined,
                            sysId: undefined,
                        },
                    };
                    assert.deepEqual(new Options(options).dtd, options.dtd);
                }

                {
                    const options = {
                        dtd: {
                            include: true,
                            name: "abc",
                            pubId: undefined,
                            sysId: undefined,
                        },
                    };
                    assert.deepEqual(new Options(options).dtd, options.dtd);
                }
            });

            it(
                "should throw an error if the specified options object" +
                    " contains invalid options",
                () => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const options: any = {
                        dtd: {
                            include: true,
                        },
                    };
                    assert.throws(() => new Options(options));
                },
            );

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.deepEqual(new Options(options).dtd, {
                        include: false,
                        name: undefined,
                        pubId: undefined,
                        sysId: undefined,
                    });
                },
            );
        });

        describe("format", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    format: {
                        doubleQuotes: undefined,
                        indent: undefined,
                        newline: undefined,
                        pretty: undefined,
                    },
                };
                assert.deepEqual(new Options(options).format, options.format);
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.deepEqual(new Options(options).format, {
                        doubleQuotes: undefined,
                        indent: undefined,
                        newline: undefined,
                        pretty: undefined,
                    });
                },
            );
        });

        describe("replaceInvalidChars", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    replaceInvalidChars: false,
                };
                assert.strictEqual(
                    new Options(options).replaceInvalidChars,
                    options.replaceInvalidChars,
                );

                options.replaceInvalidChars = true;
                assert.strictEqual(
                    new Options(options).replaceInvalidChars,
                    options.replaceInvalidChars,
                );
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.strictEqual(
                        new Options(options).replaceInvalidChars,
                        false,
                    );
                },
            );
        });

        describe("typeHandlers", () => {
            it("should leave the specified property unchanged if valid", () => {
                const typeHandlers: ITypeHandlers = {
                    test1: () => {
                        return "test2";
                    },
                    test3: () => {
                        return "test4";
                    },
                };
                const options = {
                    typeHandlers,
                };
                assert.deepEqual(
                    new Options(options).typeHandlers,
                    options.typeHandlers,
                );

                options.typeHandlers = {};
                assert.deepEqual(
                    new Options(options).typeHandlers,
                    options.typeHandlers,
                );
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.deepEqual(new Options(options).typeHandlers, {});
                },
            );
        });

        describe("useSelfClosingTagIfEmpty", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    useSelfClosingTagIfEmpty: true,
                };
                assert.strictEqual(
                    new Options(options).useSelfClosingTagIfEmpty,
                    options.useSelfClosingTagIfEmpty,
                );

                options.useSelfClosingTagIfEmpty = false;
                assert.strictEqual(
                    new Options(options).useSelfClosingTagIfEmpty,
                    options.useSelfClosingTagIfEmpty,
                );
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.strictEqual(
                        new Options(options).useSelfClosingTagIfEmpty,
                        true,
                    );
                },
            );
        });

        describe("validation", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    validation: true,
                };
                assert.strictEqual(
                    new Options(options).validation,
                    options.validation,
                );

                options.validation = false;
                assert.strictEqual(
                    new Options(options).validation,
                    options.validation,
                );
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.strictEqual(new Options(options).validation, true);
                },
            );
        });

        describe("valueString", () => {
            it("should leave the specified property unchanged if valid", () => {
                const options = {
                    valueString: "#",
                };
                assert.strictEqual(
                    new Options(options).valueString,
                    options.valueString,
                );

                options.valueString = "test";
                assert.strictEqual(
                    new Options(options).valueString,
                    options.valueString,
                );
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.strictEqual(new Options(options).valueString, "#");
                },
            );
        });

        describe("wrapHandlers", () => {
            it("should leave the specified property unchanged if valid", () => {
                const wrapHandlers: IWrapHandlers = {
                    test1: () => {
                        return "test2";
                    },
                    test3: () => {
                        return "test4";
                    },
                };
                const options = {
                    wrapHandlers,
                };
                assert.deepEqual(
                    new Options(options).wrapHandlers,
                    options.wrapHandlers,
                );

                options.wrapHandlers = {};
                assert.deepEqual(
                    new Options(options).wrapHandlers,
                    options.wrapHandlers,
                );
            });

            it(
                "should return a validated version of the specified property" +
                    " if undefined",
                () => {
                    const options = {};
                    assert.deepEqual(new Options(options).wrapHandlers, {});
                },
            );
        });
    });
});
