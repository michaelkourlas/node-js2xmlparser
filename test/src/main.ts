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
import {parse} from "../../lib/main";
import {IOptions, ITypeHandlers, IWrapHandlers} from "../../lib/options";
import {isSet, isString} from "../../lib/utils";

const simpleOptions: IOptions = {
    declaration: {
        include: false
    },
    format: {
        pretty: false
    }
};

describe("parser", () => {
    describe("#parse", () => {
        describe("primitives", () => {
            it("should parse primitives correctly", () => {
                assert.strictEqual(parse("root", "string", simpleOptions),
                                   "<root>string</root>");
                assert.strictEqual(parse("root", 3, simpleOptions),
                                   "<root>3</root>");
                assert.strictEqual(parse("root", true, simpleOptions),
                                   "<root>true</root>");
                assert.strictEqual(parse("root", undefined, simpleOptions),
                                   "<root>undefined</root>");
                assert.strictEqual(parse("root", null, simpleOptions),
                                   "<root>null</root>");
            });

            it("should parse object versions of primitives correctly", () => {
                /* tslint:disable no-construct */
                // noinspection JSPrimitiveTypeWrapperUsage
                assert.strictEqual(parse("root", new String("string"),
                                         simpleOptions),
                                   "<root>string</root>");
                // noinspection JSPrimitiveTypeWrapperUsage
                assert.strictEqual(parse("root", new Number(3), simpleOptions),
                                   "<root>3</root>");
                // noinspection JSPrimitiveTypeWrapperUsage
                assert.strictEqual(parse("root", new Boolean(true),
                                         simpleOptions),
                                   "<root>true</root>");
                /* tslint:enable no-construct */
            });
        });

        describe("object, maps, arrays, and sets", () => {
            it("should parse simple objects and maps correctly", () => {
                assert.strictEqual(parse("root", {}, simpleOptions),
                                   "<root/>");
                assert.strictEqual(parse("root", {"test": "123"},
                                         simpleOptions),
                                   "<root><test>123</test></root>");
                assert.strictEqual(parse("root",
                                         {"test": "123", "test2": "456"},
                                         simpleOptions),
                                   "<root><test>123</test><test2>456</test2>"
                                   + "</root>");
                assert.strictEqual(parse("root", new Map(), simpleOptions),
                                   "<root/>");
                assert.strictEqual(
                    parse("root", new Map([["test", "123"]]),
                          simpleOptions), "<root><test>123</test></root>");
                assert.strictEqual(
                    parse("root",
                          new Map([["test", "123"],
                              ["test2", "456"]]),
                          simpleOptions),
                    "<root><test>123</test><test2>456</test2></root>");
            });

            it("should parse simple arrays and sets correctly", () => {
                assert.strictEqual(parse("root", [], simpleOptions),
                                   "<root/>");
                assert.strictEqual(parse("root", ["test", "123"],
                                         simpleOptions),
                                   "<root><root>test</root><root>123</root>"
                                   + "</root>");
                assert.strictEqual(parse("root", new Set(), simpleOptions),
                                   "<root/>");
                assert.strictEqual(parse("root", new Set(["test", "123"]),
                                         simpleOptions),
                                   "<root><root>test</root><root>123</root>"
                                   + "</root>");
            });

            it("should parse other JavaScript built-ins correctly", () => {
                assert.strictEqual(parse("root", () => "test", simpleOptions),
                                   "<root>function () { return \"test\"; }"
                                   + "</root>");
                assert.strictEqual(parse("root", /test/, simpleOptions),
                                   "<root>/test/</root>");
            });

            it("should parse primitives in objects and maps", () => {
                /* tslint:disable no-construct */
                // noinspection JSPrimitiveTypeWrapperUsage
                assert.strictEqual(
                    parse(
                        "root",
                        {
                            "test": "str",
                            "test2": 3,
                            "test3": true,
                            "test4": undefined,
                            "test5": null,
                            "test6": new String("str2"),
                            "test7": new Number(6),
                            "test8": new Boolean(false)
                        },
                        simpleOptions),
                    "<root><test>str</test><test2>3</test2><test3>true</test3>"
                    + "<test4>undefined</test4><test5>null</test5><test6>str2"
                    + "</test6><test7>6</test7><test8>false</test8></root>");
                // noinspection JSPrimitiveTypeWrapperUsage
                assert.strictEqual(
                    parse(
                        "root",
                        new Map<string, any>([
                            ["test", "str"],
                            ["test2", 3],
                            ["test3", true],
                            ["test4", undefined],
                            ["test5", null],
                            ["test6", new String("str2")],
                            ["test7", new Number(6)],
                            ["test8", new Boolean(false)]
                        ]),
                        simpleOptions),
                    "<root><test>str</test><test2>3</test2><test3>true</test3>"
                    + "<test4>undefined</test4><test5>null</test5><test6>str2"
                    + "</test6><test7>6</test7><test8>false</test8></root>");
                // noinspection JSPrimitiveTypeWrapperUsage
                assert.strictEqual(
                    parse(
                        "root",
                        new Map([
                            [false, "str1"],
                            [undefined, "str2"],
                            [null, "str3"]
                        ]),
                        simpleOptions),
                    "<root><false>str1</false><undefined>str2</undefined>"
                    + "<null>str3</null></root>");
                /* tslint:enable no-construct */
            });

            it("should parse primitives in arrays and sets", () => {
                /* tslint:disable no-construct */
                // noinspection JSPrimitiveTypeWrapperUsage
                assert.strictEqual(
                    parse(
                        "root",
                        ["test", 3, false, undefined, null, new String("str1"),
                         new Number(5), new Boolean(false)],
                        simpleOptions),
                    "<root><root>test</root><root>3</root><root>false</root>"
                    + "<root>undefined</root><root>null</root><root>str1"
                    + "</root><root>5</root><root>false</root></root>");
                // noinspection JSPrimitiveTypeWrapperUsage
                assert.strictEqual(
                    parse(
                        "root",
                        new Set(["test", 3, false, undefined, null,
                                 new String("str1"), new Number(5),
                                 new Boolean(false)]),
                        simpleOptions),
                    "<root><root>test</root><root>3</root><root>false</root>"
                    + "<root>undefined</root><root>null</root><root>str1"
                    + "</root><root>5</root><root>false</root></root>");
                /* tslint:enable no-construct */
            });

            it("should parse nested objects and maps", () => {
                assert.strictEqual(
                    parse(
                        "root", {
                            "test": {
                                "test15": "test16",
                                "test17": {
                                    "test18": "test19",
                                    "test20": "test21"
                                },
                                "test2": new Map<string, any>([
                                    ["test3", "test4"],
                                    [
                                        "test5",
                                        {
                                            "test6": "test7",
                                            "test8": "test9"
                                        }
                                    ],
                                    [
                                        "test10",
                                        new Map([
                                            ["test11", "test12"],
                                            ["test13", "test14"]
                                        ])]
                                ])
                            }
                        }, simpleOptions),
                    "<root><test><test15>test16</test15><test17>"
                    + "<test18>test19</test18><test20>test21</test20>"
                    + "</test17><test2><test3>test4</test3><test5><test6>"
                    + "test7</test6><test8>test9</test8></test5><test10>"
                    + "<test11>test12</test11><test13>test14</test13>"
                    + "</test10></test2></test></root>");
            });

            it("should parse nested arrays and sets", () => {
                assert.strictEqual(
                    parse(
                        "root",
                        [
                            ["a", "b", "c", ["d", "e"]],
                            new Set(["f", "g", "h", new Set(["i", "j"]),
                                ["k", "l"]])
                        ], simpleOptions),
                    "<root><root>a</root><root>b</root><root>c</root><root>"
                    + "d</root><root>e</root><root>f</root><root>g</root>"
                    + "<root>h</root><root>i</root><root>j</root><root>k"
                    + "</root><root>l</root></root>");
            });

            it("should parse complex combinations of objects, maps, arrays,"
               + " and sets", () => {
                assert.strictEqual(
                    parse(
                        "root",
                        {
                            "test1": {
                                "test12": new Set([
                                    "test13",
                                    {
                                        "test14": "test15",
                                        "test16": "test17"
                                    },
                                    new Map([
                                        ["test18", "test19"],
                                        ["test20", "test21"]
                                    ])
                                ]),
                                "test2": [
                                    "test3",
                                    {
                                        "test4": "test5",
                                        "test6": "test7"
                                    },
                                    new Map([
                                        ["test8", "test9"],
                                        ["test10", "test11"]
                                    ])
                                ],
                                "test43": "test44"
                            },
                            "test22": new Map<string, any>([
                                ["test45", "test46"],
                                ["test23", [
                                    "test24",
                                    {
                                        "test25": "test26",
                                        "test27": "test28"
                                    },
                                    new Map([
                                        ["test29", "test30"],
                                        ["test31", "test32"]
                                    ])
                                ]],
                                ["test33", new Set([
                                    "test34",
                                    {
                                        "test35": "test36",
                                        "test37": "test38"
                                    },
                                    new Map([
                                        ["test39", "test40"],
                                        ["test41", "test42"]
                                    ])
                                ])]
                            ])
                        },
                        simpleOptions),
                    "<root><test1><test12>test13</test12><test12><test14>"
                    + "test15</test14><test16>test17</test16></test12>"
                    + "<test12><test18>test19</test18><test20>test21</test20>"
                    + "</test12><test2>test3</test2><test2><test4>test5"
                    + "</test4><test6>test7</test6></test2><test2><test8>"
                    + "test9</test8><test10>test11</test10></test2><test43>"
                    + "test44</test43></test1><test22><test45>test46</test45>"
                    + "<test23>test24</test23><test23><test25>test26</test25>"
                    + "<test27>test28</test27></test23><test23><test29>test30"
                    + "</test29><test31>test32</test31></test23><test33>test34"
                    + "</test33><test33><test35>test36</test35><test37>test38"
                    + "</test37></test33><test33><test39>test40</test39>"
                    + "<test41>test42</test41></test33></test22></root>");
            });
        });

        describe("options", () => {
            describe("aliasString", () => {
                const aliasStringOptions: IOptions = {
                    aliasString: "_customAliasString",
                    declaration: {
                        include: false
                    },
                    format: {
                        pretty: false
                    }
                };

                it("should correctly handle use of the aliasString"
                   + " option", () => {
                    assert.strictEqual(parse("root", {
                        "=": "testRoot",
                        "test1": "test2",
                        "test3": "test4"
                    }, simpleOptions), "<testRoot><test1>test2</test1>"
                                       + "<test3>test4</test3></testRoot>");
                    assert.strictEqual(parse("root", new Map([
                        ["=", "testRoot"],
                        ["test1", "test2"],
                        ["test3", "test4"]
                    ]), simpleOptions), "<testRoot><test1>test2</test1>"
                                        + "<test3>test4</test3></testRoot>");
                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": "test2",
                                "test3": {
                                    "=": "test4",
                                    "test5": "test6"
                                },
                                "test7": new Map([
                                    ["=", "test8"],
                                    ["test9", "test10"]
                                ])
                            }, simpleOptions),
                        "<root><test1>test2</test1><test4><test5>test6</test5>"
                        + "</test4><test8><test9>test10</test9></test8>"
                        + "</root>");
                    assert.strictEqual(
                        parse(
                            "root",
                            new Map<string, any>([
                                ["test1", "test2"],
                                ["test3", {
                                    "=": "test4",
                                    "test5": "test6"
                                }],
                                ["test7", new Map([
                                    ["=", "test8"],
                                    ["test9", "test10"]
                                ])]
                            ]), simpleOptions),
                        "<root><test1>test2</test1><test4><test5>test6</test5>"
                        + "</test4><test8><test9>test10</test9></test8>"
                        + "</root>");
                    assert.strictEqual(
                        parse(
                            "root",
                            [
                                {
                                    "=": "test1",
                                    "test2": "test3"
                                },
                                new Map([
                                    ["=", "test4"],
                                    ["test5", "test6"]
                                ]),
                                {
                                    "test7": "test8",
                                    "test9": [
                                        {
                                            "=": "test10",
                                            "test11": "test12"
                                        },
                                        new Map([
                                            ["=", "test13"],
                                            ["test14", "test15"]
                                        ])
                                    ]
                                }
                            ],
                            simpleOptions
                        ),
                        "<root><test1><test2>test3</test2></test1><test4>"
                        + "<test5>test6</test5></test4><root><test7>test8"
                        + "</test7><test10><test11>test12</test11></test10>"
                        + "<test13><test14>test15</test14></test13></root>"
                        + "</root>");
                    assert.strictEqual(
                        parse(
                            "root",
                            new Set([
                                {
                                    "=": "test1",
                                    "test2": "test3"
                                },
                                new Map([
                                    ["=", "test4"],
                                    ["test5", "test6"]
                                ]),
                                {
                                    "test7": "test8",
                                    "test9": new Set([
                                        {
                                            "=": "test10",
                                            "test11": "test12"
                                        },
                                        new Map([
                                            ["=", "test13"],
                                            ["test14", "test15"]
                                        ])
                                    ])
                                }
                            ]),
                            simpleOptions
                        ),
                        "<root><test1><test2>test3</test2></test1><test4>"
                        + "<test5>test6</test5></test4><root><test7>test8"
                        + "</test7><test10><test11>test12</test11></test10>"
                        + "<test13><test14>test15</test14></test13></root>"
                        + "</root>");
                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "_customAliasString": "test1",
                                "test2": "test3",
                                "test4": {
                                    "_customAliasString": "test5",
                                    "test6": "test7"
                                }
                            },
                            aliasStringOptions
                        ),
                        "<test1><test2>test3</test2><test5><test6>test7"
                        + "</test6></test5></test1>");
                });
            });

            describe("attributeString", () => {
                const attributeStringOptions: IOptions = {
                    attributeString: "attributeString",
                    declaration: {
                        include: false
                    },
                    format: {
                        pretty: false
                    }
                };

                it("should correctly handle use of the attributeString"
                   + " option", () => {
                    // noinspection HtmlUnknownAttribute
                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "@": {
                                    "test1": "test2",
                                    "test3": "test4",
                                    "test5": 3,
                                    "test6": null,
                                    "test7": undefined,
                                    "test8": true
                                }
                            },
                            simpleOptions
                        ),
                        "<root test1='test2' test3='test4' test5='3' "
                        + "test6='null' test7='undefined' test8='true'/>"
                    );

                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test5": {
                                    "@": {
                                        "test1": "test2",
                                        "test3": "test4"
                                    },
                                    "test6": "test7"
                                }
                            },
                            simpleOptions
                        ),
                        "<root><test5 test1='test2' test3='test4'><test6>"
                        + "test7</test6></test5></root>"
                    );

                    assert.throws(() => {
                        parse(
                            "root",
                            {
                                "attributeString": {
                                    "test1": "test2",
                                    "test3": "test4"
                                },
                                "test5": {
                                    "@": {
                                        "test1": "test2",
                                        "test3": "test4"
                                    }
                                }
                            },
                            attributeStringOptions
                        );
                    });

                    assert.throws(() => {
                        parse(
                            "root",
                            {
                                "@": "test"
                            },
                            simpleOptions
                        );
                    });

                    assert.throws(() => {
                        parse(
                            "root",
                            {
                                "@": {
                                    "test": {}
                                }
                            },
                            simpleOptions
                        );
                    });
                });
            });

            describe("cdataInvalidChars", () => {
                const cdataInvalidCharsOptions: IOptions = {
                    cdataInvalidChars: true,
                    declaration: {
                        include: false
                    },
                    format: {
                        pretty: false
                    }
                };

                it("should correctly handle use of the cdataInvalidChars"
                   + " option", () => {
                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": "a&b",
                                "test2": "c<d",
                                "test3": "a&b<c]]>d&e<f"
                            },
                            simpleOptions
                        ),
                        "<root><test1>a&amp;b</test1><test2>c&lt;d</test2>"
                        + "<test3>a&amp;b&lt;c]]&gt;d&amp;e&lt;f</test3></root>"
                    );

                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": "a&b",
                                "test2": "c<d",
                                "test3": "a&b<c]]>d&e<f]]>cdata_not_required"
                            },
                            cdataInvalidCharsOptions
                        ),
                        "<root><test1><![CDATA[a&b]]></test1><test2>"
                        + "<![CDATA[c<d]]></test2><test3><![CDATA[a&b<c]]>"
                        + "]]&gt;<![CDATA[d&e<f]]>]]&gt;cdata_not_required"
                        + "</test3></root>"
                    );
                });
            });

            describe("cdataKeys", () => {
                const cdataKeysOptions: IOptions = {
                    cdataKeys: [
                        "test1"
                    ],
                    declaration: {
                        include: false
                    },
                    format: {
                        pretty: false
                    }
                };
                const cdataKeysWildcardOptions: IOptions = {
                    cdataKeys: [
                        "test1",
                        "*"
                    ],
                    declaration: {
                        include: false
                    },
                    format: {
                        pretty: false
                    }
                };

                it("should correctly handle use of the cdataKeys"
                   + " option", () => {
                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": "ab",
                                "test2": {
                                    "test1": "ab&"
                                },
                                "test3": "ab&",
                                "test4": "cd",
                                "test5": {
                                    "test1": "ab&]]>no_cdata_required"
                                }
                            },
                            cdataKeysOptions
                        ),
                        "<root><test1><![CDATA[ab]]></test1><test2><test1>"
                        + "<![CDATA[ab&]]></test1></test2><test3>ab&amp;"
                        + "</test3><test4>cd</test4><test5><test1>"
                        + "<![CDATA[ab&]]>]]&gt;<![CDATA[no_cdata_required]]>"
                        + "</test1></test5></root>"
                    );

                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": "ab",
                                "test2": {
                                    "test1": "ab&"
                                },
                                "test3": "ab&",
                                "test4": "cd",
                                "test5": {
                                    "test1": "ab&]]>no_cdata_required"
                                }
                            },
                            cdataKeysWildcardOptions
                        ),
                        "<root><test1><![CDATA[ab]]></test1><test2><test1>"
                        + "<![CDATA[ab&]]></test1></test2><test3>"
                        + "<![CDATA[ab&]]></test3><test4><![CDATA[cd]]>"
                        + "</test4><test5><test1><![CDATA[ab&]]>]]&gt;"
                        + "<![CDATA[no_cdata_required]]></test1></test5></root>"
                    );
                });
            });

            describe("declaration", () => {
                const declOptions: IOptions = {
                    declaration: {
                        encoding: "UTF-8",
                        include: true,
                        standalone: "yes",
                        version: "1.0"
                    },
                    format: {
                        pretty: false
                    }
                };

                it("should correctly handle use of the decl option", () => {
                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": "test2"
                            },
                            declOptions
                        ),
                        "<?xml version='1.0' encoding='UTF-8'"
                        + " standalone='yes'?><root><test1>test2</test1></root>"
                    );
                });
            });

            describe("dtd", () => {
                const dtdOptions: IOptions = {
                    declaration: {
                        include: false
                    },
                    dtd: {
                        include: true,
                        name: "a",
                        pubId: "c",
                        sysId: "b"
                    },
                    format: {
                        pretty: false
                    }
                };

                it("should correctly handle use of the dtd option", () => {
                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": "test2"
                            },
                            dtdOptions
                        ),
                        "<!DOCTYPE a PUBLIC 'c' 'b'><root><test1>test2"
                        + "</test1></root>"
                    );
                });
            });

            describe("format", () => {
                const formatOptions: IOptions = {
                    declaration: {
                        include: false
                    },
                    format: {
                        doubleQuotes: true,
                        indent: "\t",
                        newline: "\r\n",
                        pretty: true
                    }
                };

                it("should correctly handle use of the dtd option", () => {
                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": "test2"
                            },
                            formatOptions
                        ),
                        "<root>\r\n\t<test1>test2</test1>\r\n</root>"
                    );
                });
            });

            describe("typeHandlers", () => {
                const typeHandlers: ITypeHandlers = {
                    "[object Number]": (val: any) => val + 17
                };
                const typeHandlersOptions: IOptions = {
                    declaration: {
                        include: false
                    },
                    format: {
                        pretty: false
                    },
                    typeHandlers
                };

                const typeHandlersWildcard: ITypeHandlers = {
                    "*": (val: any) => {
                        if (isString(val)) {
                            return val + "abc";
                        } else {
                            return val;
                        }
                    },
                    "[object Number]": (val: any) => val + 17
                };
                const typeHandlersWildcardOptions: IOptions = {
                    declaration: {
                        include: false
                    },
                    format: {
                        pretty: false
                    },
                    typeHandlers: typeHandlersWildcard
                };

                it("should correctly handle use of the typeHandlers"
                   + " option", () => {
                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": 3,
                                "test2": "test3"
                            },
                            typeHandlersOptions
                        ),
                        "<root><test1>20</test1><test2>test3</test2></root>"
                    );

                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": 3,
                                "test2": "test3"
                            },
                            typeHandlersWildcardOptions
                        ),
                        "<root><test1>20</test1><test2>test3abc</test2></root>"
                    );
                });
            });

            describe("valueString", () => {
                const valueStringOptions: IOptions = {
                    declaration: {
                        include: false
                    },
                    format: {
                        pretty: false
                    },
                    valueString: "valueString"
                };

                it("should correctly handle use of the valueString"
                   + " option", () => {
                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": {
                                    "#": "test6",
                                    "test2": "test3",
                                    "test4": "test5"
                                },
                                "test13": {
                                    "#": 3
                                },
                                "test14": {
                                    "#": true
                                },
                                "test15": {
                                    "#": null
                                },
                                "test16": {
                                    "#": undefined
                                },
                                "test7": new Map([
                                    ["test8", "test9"],
                                    ["#", "test10"],
                                    ["test11", "test12"]
                                ])
                            },
                            simpleOptions
                        ),
                        "<root><test1>test6<test2>test3</test2><test4>test5"
                        + "</test4></test1><test13>3</test13><test14>true"
                        + "</test14><test15>null</test15><test16>undefined"
                        + "</test16><test7><test8>test9</test8>test10<test11>"
                        + "test12</test11></test7></root>"
                    );

                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": {
                                    "test2": "test3",
                                    "test4": "test5",
                                    "valueString": "test6"
                                }
                            },
                            valueStringOptions
                        ),
                        "<root><test1><test2>test3</test2><test4>test5"
                        + "</test4>test6</test1></root>"
                    );

                    assert.throws(() => {
                        parse(
                            "root",
                            {
                                "test13": {
                                    "#": {
                                        "test18": "test19"
                                    },
                                    "test14": "test15",
                                    "test16": "test17"
                                }
                            },
                            simpleOptions
                        );
                    });
                });
            });

            describe("wrapHandlers", () => {
                const wrapHandlers: IWrapHandlers = {
                    "test1": () => "test2",
                    "test17": () => null,
                    "test3": (key: string, value: any) =>
                    "test4" + key + (isSet(value)
                        ? value.values().next().value : value[0])
                };
                const wrapHandlersOptions: IOptions = {
                    declaration: {
                        include: false
                    },
                    format: {
                        pretty: false
                    },
                    wrapHandlers
                };

                const wrapHandlersWildcard: IWrapHandlers = {
                    "*": () => "test5",
                    "test1": () => "test2",
                    "test3": (key: string, value: any) =>
                    "test4" + key + (isSet(value)
                        ? value.values().next().value : value[0])
                };
                const wrapHandlersWildcardOptions: IOptions = {
                    declaration: {
                        include: false
                    },
                    format: {
                        pretty: false
                    },
                    wrapHandlers: wrapHandlersWildcard
                };

                it("should correctly handle use of the wrapHandlers"
                   + " option", () => {
                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": [
                                    "test6",
                                    "test7"
                                ],
                                "test10": new Map<string, any>([
                                    ["test1", [
                                        "test11",
                                        "test12"
                                    ]],
                                    ["test3", new Set([
                                        "test13",
                                        "test14"
                                    ])]
                                ]),
                                "test17": [
                                    "test18",
                                    "test19"
                                ],
                                "test3": new Set([
                                    "test8",
                                    "test9"
                                ])
                            },
                            wrapHandlersOptions),
                        "<root><test1><test2>test6</test2><test2>test7"
                        + "</test2></test1><test10><test1><test2>test11"
                        + "</test2><test2>test12</test2></test1><test3>"
                        + "<test4test3test13>test13</test4test3test13>"
                        + "<test4test3test13>test14</test4test3test13>"
                        + "</test3></test10><test17>test18</test17>"
                        + "<test17>test19</test17><test3><test4test3test8>"
                        + "test8</test4test3test8><test4test3test8>test9"
                        + "</test4test3test8></test3></root>");

                    assert.strictEqual(
                        parse(
                            "root",
                            {
                                "test1": [
                                    "test6",
                                    "test7"
                                ],
                                "test10": new Map<string, any>([
                                    ["test1", [
                                        "test11",
                                        "test12"
                                    ]],
                                    ["test3", new Set([
                                        "test13",
                                        "test14"
                                    ])]
                                ]),
                                "test17": [
                                    "test18",
                                    "test19"
                                ],
                                "test3": new Set([
                                    "test8",
                                    "test9"
                                ])
                            },
                            wrapHandlersWildcardOptions),
                        "<root><test1><test2>test6</test2><test2>test7</test2>"
                        + "</test1><test10><test1><test2>test11</test2><test2>"
                        + "test12</test2></test1><test3><test4test3test13>"
                        + "test13</test4test3test13><test4test3test13>test14"
                        + "</test4test3test13></test3></test10><test17><test5>"
                        + "test18</test5><test5>test19</test5></test17><test3>"
                        + "<test4test3test8>test8</test4test3test8>"
                        + "<test4test3test8>test9</test4test3test8></test3>"
                        + "</root>");
                });
            });
        });
    });
});
