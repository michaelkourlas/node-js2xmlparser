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

import {parse} from "../lib/main";

/**
 * This example demonstrates a very simple usage of js2xmlparser.
 */
const example1 = () => {
    const obj = {
        "firstName": "John",
        "lastName": "Smith"
    };
    console.log(parse("person", obj));
    console.log();
};
example1();

/**
 * This example demonstrates a more complex usage of j2xmlparser.
 */
const example2 = () => {
    const obj = {
        "firstName": "John",
        "lastName": "Smith",
        "dateOfBirth": new Date(1964, 7, 26),
        "address": {
            "@": {
                "type": "home"
            },
            "streetAddress": "3212 22nd St",
            "city": "Chicago",
            "state": "Illinois",
            "zip": 10000
        },
        "phone": [
            {
                "@": {
                    "type": "home"
                },
                "#": "123-555-4567"
            },
            {
                "@": {
                    "type": "cell"
                },
                "#": "890-555-1234"
            },
            {
                "@": {
                    "type": "work"
                },
                "#": "567-555-8901"
            }
        ],
        "email": "john@smith.com"
    };
    console.log(parse("person", obj));
    console.log();
};
example2();

/**
 * This example demonstrates some of js2xmlparser's options.
 */
const example3 = () => {
    const options = {
        aliasString: "exAlias",
        attributeString: "exAttr",
        cdataKeys: [
            "exCdata",
            "exCdata2"
        ],
        declaration: {
            include: true,
            encoding: "UTF-16",
            standalone: "yes",
            version: "1.1"
        },
        dtd: {
            include: true,
            name: "exName",
            sysId: "exSysId",
            pubId: "exPubId"
        },
        format: {
            doubleQuotes: true,
            indent: "\t",
            newline: "\r\n",
            pretty: true
        },
        typeHandlers: {
            "[object Number]": (value: any) => {
                return value + 17;
            }
        },
        valueString: "exVal",
        wrapHandlers: {
            "exArr": () => {
                return "exArrInner";
            }
        }
    };

    const obj = {
        "ex1": "ex2",
        "exVal_1": 123,
        "ex3": ["ex4", "ex5"],
        "ex6": {
            "exAttr_1": {
                "ex7": "ex8",
                "ex9": "ex10"
            },
            "ex11": "ex12",
            "ex13": {
                "ex14": "ex15"
            },
            "ex16": [
                "ex17",
                {
                    "ex18": "ex19"
                }
            ],
            "exArr": [
                "ex20",
                {
                    "ex21": "ex22"
                }
            ],
            "exAttr_2": {
                "ex23": "ex24",
                "ex25": "ex26"
            }
        },
        "exVal_2": "ex27",
        "ex28": [
            "ex29",
            "ex30"
        ],
        "ex31": true,
        "ex32": undefined,
        "ex33": null,
        "ex34": 3.4,
        "ex35": () => {
            return "ex36";
        },
        "ex37": "i<j&",
        "exCdata": "i<j&",
        "exCdata2": "ddd",
        "ex38": {
            "exAlias": "ex39",
            "ex40": "ex41"
        },
        "ex42": ["ex43", "ex44", "ex45", ["ex46", "ex47"],
                 new Set(["ex48", "ex49"])],
        "ex50": new Map([
                            ["ex51", "ex52"],
                            ["exVal_1", "ex53"],
                            ["ex54", "ex55"],
                            ["exAttr_1",
                                {
                                    "ex56": "ex57",
                                    "ex58": "ex59"
                                }
                            ] as any
                        ])
    };
    console.log(parse("ex0", obj, options));
    console.log();
};
example3();
