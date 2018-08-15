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
    isBoolean,
    isFunction,
    isObject,
    isString,
    isStringArray,
    isUndefined
} from "./utils";

/**
 * The options associated with parsing an object and formatting the resulting
 * XML.
 */
export interface IOptions {
    /**
     * If an object or map contains a key that, when converted to a string,
     * is equal to the value of `aliasString`, then the name of the XML element
     * containing the object will be replaced with the value associated with
     * said key.
     *
     * For example, if `aliasString` is `"="`, then the following object:
     * ```javascript
     * {
     *     "abc": {
     *         "=": "def"
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
     * If left undefined, the default value is `"="`.
     */
    aliasString?: string;
    /**
     * If an object or map contains a key that, when converted to a string,
     * begins with the value of `attributeString`, then the value mapped by
     * said key will be interpreted as attributes for the XML element for that
     * object.
     *
     * The attribute object must be an object containing keys that map to
     * primitives (string, number, boolean, null, or undefined).
     *
     * For example, if `attributeString` is `"@"`, then the following object:
     * ```javascript
     * {
     *     "abc": {
     *         "@1": {
     *             "ghi": "jkl",
     *             "mno": "pqr"
     *         },
     *         "stu": "vwx",
     *         "@2": {
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
     * If left undefined, the default value is `"@"`.
     */
    attributeString?: string;
    /**
     * If `cdataInvalidChars` is `true`, then any text containing the
     * characters `<` or `&` shall be enclosed in CDATA sections. Otherwise,
     * those characters shall be replaced with XML escape characters.
     *
     * If left undefined, the default value is `false`.
     */
    cdataInvalidChars?: boolean;
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
    declaration?: IDeclarationOptions;
    /**
     * The options associated with the XML document type definition.
     */
    dtd?: IDtdOptions;
    /**
     * The options associated with the formatting of the XML document.
     */
    format?: IFormatOptions;
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
     * begins with the value of `valueString`, then the value mapped by said key
     * will be represented as bare text within the XML element for that object.
     * The value must be a primitive (string, number, boolean, null, or
     * undefined).
     *
     * For example, if `valueString` is `"#"`, then the following object:
     * ```javascript
     * new Map([
     *     ["#1", "abc"],
     *     ["def", "ghi"],
     *     ["#2", "jkl"]
     * ])
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
     * If left undefined, the default value is `"#"`.
     */
    valueString?: string;
    /**
     * If an object or map contains a key that, when converted to a string, is
     * equal to a key in `wrapHandlers`, and the key in said object or map maps
     * to an array or set, then all items in the array or set will be wrapped
     * in an XML element with the same name as the key.
     *
     * The key in `wrapHandlers` must map to a function that is called with the
     * key name, as well as the array or set, as parameters. This function must
     * return a string, which will become the name for each XML element for
     * each item in the array or set. Alternatively, this function may return
     * `null` to indicate that no wrapping should occur.
     *
     * For example, if `wrapHandlers` is:
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
     * If `wrapHandlers` has a key named `"*"`, then that entry will
     * match all arrays and sets, unless there is a more specific entry.
     *
     * If left undefined, the default value is an empty object.
     */
    wrapHandlers?: IWrapHandlers;
}

/**
 * Implementation of the IOptions interface used to provide default values
 * to fields.
 *
 * @private
 */
export class Options implements IOptions {
    public aliasString: string = "=";
    public attributeString: string = "@";
    public cdataInvalidChars: boolean = false;
    public cdataKeys: string[] = [];
    public declaration: DeclarationOptions;
    public dtd: DtdOptions;
    public format: FormatOptions;
    public typeHandlers: TypeHandlers;
    public valueString: string = "#";
    public wrapHandlers: WrapHandlers;

    constructor(options: IOptions = {}) {
        if (!isObject(options)) {
            throw new TypeError("options should be an Object or undefined");
        }

        if (!isString(options.aliasString)) {
            if (!isUndefined(options.aliasString)) {
                throw new TypeError("options.aliasString should be a string or"
                                    + " undefined");
            }
        } else {
            this.aliasString = options.aliasString;
        }

        if (!isString(options.attributeString)) {
            if (!isUndefined(options.attributeString)) {
                throw new TypeError("options.attributeString should be a string"
                                    + " or undefined");
            }
        } else {
            this.attributeString = options.attributeString;
        }

        if (!isBoolean(options.cdataInvalidChars)) {
            if (!isUndefined(options.cdataInvalidChars)) {
                throw new TypeError("options.cdataInvalidChars should be a"
                                    + " boolean or undefined");
            }
        } else {
            this.cdataInvalidChars = options.cdataInvalidChars;
        }

        if (!isStringArray(options.cdataKeys)) {
            if (!isUndefined(options.cdataKeys)) {
                throw new TypeError("options.cdataKeys should be an Array or" +
                                    " undefined");
            }
        } else {
            this.cdataKeys = options.cdataKeys;
        }

        this.declaration = new DeclarationOptions(options.declaration);

        this.dtd = new DtdOptions(options.dtd);

        this.format = new FormatOptions(options.format);

        this.typeHandlers = new TypeHandlers(options.typeHandlers);

        if (!isString(options.valueString)) {
            if (!isUndefined(options.valueString)) {
                throw new TypeError("options.valueString should be a string"
                                    + " or undefined");
            }
        } else {
            this.valueString = options.valueString;
        }

        this.wrapHandlers = new WrapHandlers(options.wrapHandlers);
    }
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
     * The XML encoding to be included in the declaration. If defined, this
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
 * Implementation of the IDeclarationOptions interface used to provide default
 * values to fields.
 *
 * @private
 */
export class DeclarationOptions implements IDeclarationOptions {
    public include: boolean = true;
    public encoding?: string;
    public standalone?: string;
    public version?: string;

    constructor(declarationOptions: IDeclarationOptions = {}) {
        if (!isObject(declarationOptions)) {
            throw new TypeError("options.declaration should be an Object or"
                                + " undefined");
        }

        if (!isBoolean(declarationOptions.include)) {
            if (!isUndefined(declarationOptions.include)) {
                throw new TypeError("options.declaration.include should be a"
                                    + " boolean or undefined");
            }
        } else {
            this.include = declarationOptions.include;
        }

        // Validation performed by xmlcreate
        this.encoding = declarationOptions.encoding;
        this.standalone = declarationOptions.standalone;
        this.version = declarationOptions.version;
    }
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
     * The system identifier of the DTD, excluding quotation marks. If left
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
 * Implementation of the IDtdOptions interface used to provide default values
 * to fields.
 *
 * @private
 */
export class DtdOptions implements IDtdOptions {
    public include: boolean = false;
    public name?: string;
    public sysId?: string;
    public pubId?: string;

    constructor(dtdOptions: IDtdOptions = {}) {
        if (!isObject(dtdOptions)) {
            throw new TypeError("options.dtd should be an Object or undefined");
        }

        if (!isBoolean(dtdOptions.include)) {
            if (!isUndefined(dtdOptions.include)) {
                throw new TypeError("options.dtd.include should be a boolean"
                                    + " or undefined");
            }
        } else {
            this.include = dtdOptions.include;
        }

        // Validation performed by xmlcreate
        this.name = dtdOptions.name;
        this.sysId = dtdOptions.sysId;
        this.pubId = dtdOptions.pubId;
    }
}

/**
 * The options associated with the formatting of the XML document.
 */
export interface IFormatOptions {
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
 * Implementation of the IFormatOptions interface used to provide default values
 * to fields.
 *
 * @private
 */
export class FormatOptions implements IFormatOptions {
    public doubleQuotes?: boolean;
    public indent?: string;
    public newline?: string;
    public pretty?: boolean;

    constructor(formatOptions: IFormatOptions = {}) {
        if (!isObject(formatOptions)) {
            throw new TypeError("options.format should be an Object or"
                                + " undefined");
        }

        // Validation performed by xmlcreate
        this.doubleQuotes = formatOptions.doubleQuotes;
        this.indent = formatOptions.indent;
        this.newline = formatOptions.newline;
        this.pretty = formatOptions.pretty;
    }
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
 * Implementation of the ITypeHandlers interface used to provide default values
 * to fields.
 *
 * @private
 */
export class TypeHandlers implements ITypeHandlers {
    [type: string]: (value: any) => any;

    constructor(typeHandlers: ITypeHandlers = {}) {
        if (!isObject(typeHandlers)) {
            throw new TypeError("options.typeHandlers should be an Object or"
                                + " undefined");
        }

        for (const key in typeHandlers) {
            if (typeHandlers.hasOwnProperty(key)) {
                if (!isFunction(typeHandlers[key])) {
                    throw new TypeError("options.typeHandlers['" + key + "']" +
                                        " should be a Function");
                } else {
                    this[key] = typeHandlers[key];
                }
            }
        }
    }
}

/**
 * Map for the `wrapHandlers` property in the {@link IOptions} interface.
 */
export interface IWrapHandlers {
    /**
     * Mapping between the string version of a key in an object or map with a
     * value that is an array or set to a function taking the string version
     * of that key, as well as that array or set.
     *
     * This function returns either a string that will become the name for each
     * XML element for each item in the array or set, or `null` to indicate that
     * wrapping should not occur.
     */
    [key: string]: (key: string, value: any) => string | null;
}

/**
 * Implementation of the IWrapHandlers interface used to provide default values
 * to fields.
 *
 * @private
 */
export class WrapHandlers implements IWrapHandlers {
    [key: string]: (key: string, value: any) => string | null;

    constructor(wrapHandlers: IWrapHandlers = {}) {
        if (!isObject(wrapHandlers)) {
            throw new TypeError("options.wrapHandlers should be an Object or"
                                + " undefined");
        }

        for (const key in wrapHandlers) {
            if (wrapHandlers.hasOwnProperty(key)) {
                if (!isFunction(wrapHandlers[key])) {
                    throw new TypeError("options.wrapHandlers['" + key + "']" +
                                        " should be a Function");
                } else {
                    this[key] = wrapHandlers[key];
                }
            }
        }
    }
}

export interface IRootAttributes {
    [key: string]: string;
}
