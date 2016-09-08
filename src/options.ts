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

import {isType} from "./utils";

/**
 * The options associated with parsing an object and formatting the resulting
 * XML.
 */
export interface IOptions {
    /**
     * If an object or map contains a key that, when converted to a string,
     * is equal to the value of `alias`, then the name of the XML element
     * containing the object will be replaced with the value associated with
     * said key.
     *
     * For example, if `alias` is `"__alias"`, then the following object:
     * ```javascript
     * {
     *     "abc": {
     *         "__alias": "def"
     *         "__val": "ghi"
     *     }
     * }
     * ```
     * will result in the following XML for a root element named `"root"`:
     * ```xml
     * <root>
     *     <def>ghi</def>
     * </root>
     * ```
     *
     * If left undefined, the default value is `"__alias"`.
     */
    alias?: string;
    /**
     * If an object or map contains a key that, when converted to a string, is
     * equal to a key in `arraySetWrapHandlers`, and the key in said object or
     * map maps to an array or set, then all items in the array or set will be
     * wrapped in an XML element with the same name as the key.
     *
     * The key in `arraySetWrapHandlers` must map to a function that is called
     * with the key name, as well as the array or set, as parameters. This
     * function must return a string, which will become the name for each XML
     * element for each item in the array or set. Alternatively, this function
     * may return `null` to indicate that no wrapping should occur.
     *
     * For example, if `arraySetWrapHandlers` is:
     * ```javascript
     * {
     *     "abc": function(key, value) {
     *         return "def";
     *     }
     * }
     * ```
     * then the following object:
     * ```javascript
     * {
     *     "ghi": "jkl",
     *     "mno": {
     *         "pqr": ["s", "t"]
     *     },
     *     "uvw": {
     *         "abc": ["x", "y"]
     *     }
     * }
     * ```
     * will result in the following XML for a root element named `"root"`:
     * ```xml
     * <root>
     *     <ghi>jkl</ghi>
     *     <mno>
     *         <pqr>s</pqr>
     *         <pqr>t</pqr>
     *     </mno>
     *     <uwv>
     *         <abc>
     *             <def>x</def>
     *             <def>y</def>
     *         </abc>
     *     </uwv>
     * </root>
     * ```
     *
     * If `arraySetWrapHandlers` has a key named `"*"`, then that entry will
     * match all arrays and sets, unless there is a more specific entry.
     *
     * If left undefined, the default value is an empty object.
     */
    arraySetWrapHandlers?: IArraySetWrapHandlers;
    /**
     * If an object or map contains a key that, when converted to a string,
     * begins with the value of `attrPrefix`, then the value mapped by said key
     * will be interpreted as attributes for the XML element for that object.
     * The attribute object must be an object containing keys that map to
     * strings.
     *
     * For example, if `attrPrefix` is `"__attr"`, then the following object:
     * ```javascript
     * {
     *     "abc": {
     *         "__attr1": {
     *             "ghi": "jkl",
     *             "mno": "pqr"
     *         },
     *         "stu": "vwx",
     *         "__attr2": {
     *             "yza": "bcd"
     *         },
     *     }
     * }
     * ```
     * will result in the following XML for a root element named `"root"`:
     * ```xml
     * <root>
     *     <abc ghi='jkl' mno='pqr' yza='bcd'>
     *         <stu>vwx</stu>
     *     </abc>
     * </root>
     * ```
     *
     * If left undefined, the default value is `"__attr"`.
     */
    attrPrefix?: string;
    /**
     * If `cdata` is `true`, then any text containing the characters `<` or `&`
     * shall be enclosed in CDATA sections. Otherwise, those characters shall
     * be replaced with XML escape characters.
     *
     * If left undefined, the default value is `false`.
     */
    cdata?: boolean;
    /**
     * If an object or map contains a key that, when converted to a string, is
     * equal to an item in `cdataKeys`, then the value mapped by said key will
     * be enclosed in a CDATA section.
     *
     * For example, if `cdataKeys` is:
     * ```javascript
     * [
     *     "abc"
     * ]
     * ```
     * then the following object:
     * ```javascript
     * {
     *     "abc": "def&",
     *     "ghi": "jkl",
     *     "mno": "pqr<"
     * }
     * ```
     * will result in the following XML for a root element named `"root"`:
     * ```xml
     * <root>
     *     <abc><![CDATA[def&]]></ghi>
     *     <ghi>jlk</ghi>
     *     <mno>pqr&lt;</mno>
     * </root>
     * ```
     *
     * If `cdataKeys` has a key named `"*"`, then that entry will match all
     * keys.
     *
     * If left undefined, the default value is an empty array.
     */
    cdataKeys?: string[];
    /**
     * The options associated with the XML declaration.
     */
    decl?: IDeclarationOptions;
    /**
     * The options associated with the XML document type definition.
     */
    dtd?: IDtdOptions;
    /**
     * The options associated with the formatting of the XML document.
     */
    format?: IFormattingOptions;
    /**
     * If an value has a type (as defined by calling `Object.prototype.toString`
     * on the value) equal to a key in `typeHandlers`, then said value will be
     * replaced by the return value of the function mapped to by the key in
     * `typeHandlers`. This function is called with the value as a parameter.
     *
     * For example, if `typeHandlers` is:
     * ```javascript
     * {
     *     "[object Date]": function(value) {
     *         return value.getYear();
     *     }
     * }
     * ```
     * then the following object:
     * ```javascript
     * {
     *     "abc": new Date(2012, 10, 31)
     * }
     * ```
     * will result in the following XML for a root element named `"root"`:
     * ```xml
     * <root>
     *     <abc>2012</abc>
     * </root>
     * ```
     *
     * If `typeHandlers` has a key named `"*"`, then that entry will match all
     * values, unless there is a more specific entry.
     *
     * Note that normal parsing still occurs for the value returned by the
     * function; it is not directly converted to a string.
     *
     * If left undefined, the default value is an empty object.
     */
    typeHandlers?: ITypeHandlers;
    /**
     * If an object or map contains a key that, when converted to a string,
     * begins with the value of `valPrefix`, then the value mapped by said key
     * will be represented as bare text within the XML element for that object.
     * The value must be a primitive (string, number, boolean, null, or
     * undefined).
     *
     * For example, if `valPrefix` is `"__val"`, then the following object:
     * ```javascript
     * {
     *    "__val1": "abc",
     *    "def": "ghi",
     *    "__val2": "jkl"
     * }
     * ```
     * will result in the following XML for a root element named `"root"`:
     * ```xml
     * <root>
     *     abc
     *     <def>ghi</def>
     *     jkl
     * </root>
     * ```
     *
     * If left undefined, the default value is `"__val"`.
     */
    valPrefix?: string;
}

/**
 * Map for the `arraySetWrapHandlers` property in the {@link IOptions}
 * interface.
 */
export interface IArraySetWrapHandlers {
    /**
     * Mapping between the string version of a key in an object or map with a
     * value that is an array or set to a function taking the string version
     * of that key, as well as that array or set.
     *
     * This function returns either a string that will become the name for each
     * XML element for each item in the array or set, or `null` to indicate that
     * wrapping should not occur.
     */
    [key: string]: (key: string, value: any) => string;
}

/**
 * Map for the `typeHandlers` property in the {@link IOptions} interface.
 */
export interface ITypeHandlers {
    /**
     * Mapping between the type of a value in an object to a function taking
     * this value and returning a replacement value.
     */
    [type: string]: (value: any) => any;
}

/**
 * The options associated with the XML declaration. An example of an XML
 * declaration is as follows:
 *
 * ```xml
 * <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
 * ```
 */
export interface IDeclarationOptions {
    /**
     * If `include` is true, an XML declaration is included in the generated
     * XML. If left undefined, the default value is `true`.
     */
    include?: boolean;
    /**
     * The XML encoding to be included in the declaration. If defined, this +
     * value must be a valid encoding. If left undefined, no encoding is
     * included.
     */
    encoding?: string;
    /**
     * The XML standalone attribute to be included. If defined, this value must
     * be `"yes"` or `"no"`. If left undefined, no standalone attribute is
     * included.
     */
    standalone?: string;
    /**
     * The XML version to be included in the declaration. If defined, this
     * value must be a valid XML version number. If left undefined, the default
     * version is `"1.0"`.
     */
    version?: string;
}

/**
 * The options associated with the XML document type definition (DTD). An
 * example of an XML document type definition is as follows:
 *
 * ```xml
 * <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
 *                       "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
 * ```
 */
export interface IDtdOptions {
    /**
     * If `include` is `true`, an XML DTD is included in the resulting XML. If
     * left undefined, the default value is `true`.
     */
    include?: boolean;
    /**
     * The name of the DTD. This value cannot be left undefined if `include`
     * is `true`.
     */
    name?: string;
    /**
     * The system identifier of the DTD, excluding  quotation marks. If left
     * undefined, no system identifier is included.
     */
    sysId?: string;
    /**
     * The public identifier of the DTD, excluding quotation marks. If `pubId`
     * is defined, `sysId` must be defined as well. If left undefined, no
     * public identifier is included.
     */
    pubId?: string;
}

/**
 * The options associated with the formatting of the XML document.
 */
export interface IFormattingOptions {
    /**
     * If `doubleQuotes` is `true`, double quotes are used in XML attributes.
     * Otherwise, single quotes are used in XML attributes. If left undefined,
     * the default value is `false`.
     */
    doubleQuotes?: boolean;
    /**
     * The indent string used for pretty-printing. If left undefined, the
     * default value is four spaces.
     */
    indent?: string;
    /**
     * The newline string used for pretty-printing. If left undefined, the
     * default value is `"\n"`.
     */
    newline?: string;
    /**
     * If `pretty` is `true`, pretty-printing is enabled. If left undefined,
     * the default value is `true`.
     */
    pretty?: boolean;
}

/**
 * @private
 */
const defaults: IOptions = {
    alias: "__alias",
    arraySetWrapHandlers: {},
    attrPrefix: "__attr",
    cdata: false,
    cdataKeys: [],
    decl: {
        include: true
    },
    dtd: {
        include: false
    },
    format: {},
    typeHandlers: {},
    valPrefix: "__val"
};
Object.freeze(defaults);

/* tslint:disable max-line-length */
/**
 * Validates the arraySetWrapHandlers property of an options object.
 *
 * @param {IArraySetWrapHandlers} arraySetWrapHandlers The arraySetWrapHandlers
 *                                                     object.
 *
 * @return {IArraySetWrapHandlers} The updated arraySetWrapHandlers object.
 *
 * @private
 */
function validateArraySetWrapHandlers(arraySetWrapHandlers: IArraySetWrapHandlers): IArraySetWrapHandlers {
    /* tslint:enable max-line-length */
    for (let key in arraySetWrapHandlers) {
        if (arraySetWrapHandlers.hasOwnProperty(key)) {
            if (!isType(arraySetWrapHandlers[key], "Function")) {
                throw new TypeError("options.arraySetWrapHandlers"
                                    + "['" + key + "'] should be a Function");
            }
        }
    }
    return arraySetWrapHandlers;
}

/**
 * Validates the cdataKeys property of an options object.
 *
 * @param {string[]} cdataKeys The cdataKeys object.
 *
 * @returns {string[]} The updated cdataKeys object.
 *
 * @private
 */
function validateCdataKeys(cdataKeys: string[]): string[] {
    for (let key of cdataKeys) {
        if (!isType(key, "String")) {
            throw new TypeError(key + " should be a string");
        }
    }
    return cdataKeys;
}

/**
 * Validates the declOptions property of an options object.
 *
 * @param {IDeclarationOptions} declOptions The declOptions object.
 *
 * @returns {IDeclarationOptions} The updated declOptions object.
 *
 * @private
 */
function validateDecl(declOptions: IDeclarationOptions): IDeclarationOptions {
    if (!isType(declOptions.include, "Boolean", "Undefined")) {
        throw new TypeError("declOptions.include should be a string or" +
                            " undefined");
    }
    if (!isType(declOptions.include, "Boolean")) {
        declOptions.include = defaults.decl.include;
    }

    return declOptions;
}

/**
 * Validates the dtdOptions property of an options object.
 *
 * @param {IDtdOptions} dtdOptions The dtdOptions object.
 *
 * @returns {IDtdOptions} The updated dtdOptions object.
 *
 * @private
 */
function validateDtd(dtdOptions: IDtdOptions): IDtdOptions {
    if (!isType(dtdOptions.include, "Boolean", "Undefined")) {
        throw new TypeError("dtdOptions.include should be a string or" +
                            " undefined");
    }
    if (!isType(dtdOptions.include, "Boolean")) {
        dtdOptions.include = defaults.dtd.include;
    }

    return dtdOptions;
}

/**
 * Validates the typeHandlers property of an options object.
 *
 * @param {ITypeHandlers} typeHandlers The typeHandlers object.
 *
 * @returns {ITypeHandlers} The updated typeHandlers object.
 *
 * @private
 */
function validateTypeHandlers(typeHandlers: ITypeHandlers): ITypeHandlers {
    for (let key in typeHandlers) {
        if (typeHandlers.hasOwnProperty(key)) {
            if (!isType(typeHandlers[key], "Function")) {
                throw new TypeError("options.typeHandlers['" + key + "']" +
                                    " should be a Function");
            }
        }
    }
    return typeHandlers;
}

/**
 * Validates an options object and replaces undefined values with their
 * appropriate defaults.
 *
 * @param {IOptions} options The options object to validate.
 *
 * @returns {IOptions} The updated options object.
 *
 * @private
 */
export function validateOptions(options: IOptions): IOptions {
    if (!isType(options.alias, "String", "Undefined")) {
        throw new TypeError("options.alias should be a string or undefined");
    }
    if (!isType(options.alias, "String")) {
        options.alias = defaults.alias;
    }

    if (!isType(options.arraySetWrapHandlers, "Object", "Undefined")) {
        throw new TypeError("options.arraySetWrapHandlers should be an"
                            + " Object or undefined");
    }
    if (!isType(options.arraySetWrapHandlers, "Object")) {
        options.arraySetWrapHandlers = defaults.arraySetWrapHandlers;
    }
    options.arraySetWrapHandlers = validateArraySetWrapHandlers(
        options.arraySetWrapHandlers);

    if (!isType(options.attrPrefix, "String", "Undefined")) {
        throw new TypeError("options.attrPrefix should be a string or" +
                            " undefined");
    }
    if (!isType(options.attrPrefix, "String")) {
        options.attrPrefix = defaults.attrPrefix;
    }

    if (!isType(options.cdata, "Boolean", "Undefined")) {
        throw new TypeError("options.cdata should be a boolean or undefined");
    }
    if (!isType(options.cdata, "Boolean")) {
        options.cdata = defaults.cdata;
    }

    if (!isType(options.cdataKeys, "Array", "Undefined")) {
        throw new TypeError("options.cdataKeys should be an Array or" +
                            " undefined");
    }
    if (!isType(options.cdataKeys, "Array")) {
        options.cdataKeys = defaults.cdataKeys;
    }
    options.cdataKeys = validateCdataKeys(options.cdataKeys);

    if (!isType(options.decl, "Object", "Undefined")) {
        throw new TypeError("options.decl should be an Object or undefined");
    }
    if (!isType(options.decl, "Object")) {
        options.decl = defaults.decl;
    }
    options.decl = validateDecl(options.decl);

    if (!isType(options.dtd, "Object", "Undefined")) {
        throw new TypeError("options.dtd should be an Object or undefined");
    }
    if (!isType(options.dtd, "Object")) {
        options.dtd = defaults.dtd;
    }
    options.dtd = validateDtd(options.dtd);

    if (!isType(options.format, "Object", "Undefined")) {
        throw new TypeError("options.format should be an Object or undefined");
    }
    if (!isType(options.format, "Object")) {
        options.format = defaults.format;
    }

    if (!isType(options.typeHandlers, "Object", "Undefined")) {
        throw new TypeError("options.typeHandlers should be an Object or" +
                            " undefined");
    }
    if (!isType(options.typeHandlers, "Object")) {
        options.typeHandlers = defaults.typeHandlers;
    }
    options.typeHandlers = validateTypeHandlers(options.typeHandlers);

    if (!isType(options.valPrefix, "String", "Undefined")) {
        throw new TypeError("options.valPrefix should be a string or" +
                            " undefined");
    }
    if (!isType(options.valPrefix, "String")) {
        options.valPrefix = defaults.valPrefix;
    }

    return options;
}
