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

import {isUndefined} from "./utils";

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
     *         "#": "ghi"
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
     * The handlers in `typeHandlers` are not applied to the value.
     *
     * The default alias string is `"="`.
     */
    aliasString?: string;
    /**
     * If an object or map contains a key that, when converted to a string,
     * begins with the value of `attributeString`, then the value mapped by
     * said key will be interpreted as attributes for the XML element for that
     * object.
     *
     * The keys of the value of `attributeString` are interpreted as attribute
     * names, while the values mapping to those keys are interpreted as
     * attribute values.
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
     * The handlers in `typeHandlers` are applied to the values.
     *
     * The default attribute string is `"@"`.
     */
    attributeString?: string;
    /**
     * Whether to enclose any text containing the characters `<` or `&`
     * in CDATA sections. If this is false, these characters shall be replaced
     * with XML escape characters instead.
     *
     * By default, this is disabled.
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
     * By default, this is an empty array.
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
     * Whether to replace any characters that are not valid in XML in particular
     * contexts with the Unicode replacement character, U+FFFD.
     *
     * At present this is limited to attribute names and values; element names
     * and character data; CDATA sections; and comments. This may be extended
     * in future.
     *
     * By default, this is disabled.
     */
    replaceInvalidChars?: boolean;
    /**
     * If a value has a type (as defined by calling `Object.prototype.toString`
     * on the value) equal to a key in `typeHandlers`, then said value will be
     * replaced by the return value of the function mapped to by the key in
     * `typeHandlers`. This function is called with the value as a parameter.
     *
     * If one of these functions returns the sole instance of {@link Absent},
     * then the value will be suppressed from the XML output altogether.
     *
     * For example, if `typeHandlers` is:
     * ```javascript
     * {
     *     "[object Date]": function(value) {
     *         return value.getYear();
     *     },
     *     "[object Null]": function(value) {
     *         return Absent.instance;
     *     }
     * }
     * ```
     * then the following object:
     * ```javascript
     * {
     *     "abc": new Date(2012, 10, 31),
     *     "def": null
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
     * The default value is an empty object.
     */
    typeHandlers?: ITypeHandlers;
    /**
     * Whether to use a self-closing tag for empty elements.
     *
     * For example, the following element will be used:
     * ```xml
     * <element/>
     * ```
     * instead of:
     * ```xml
     * <element></element>
     * ```
     *
     * By default, this is enabled.
     */
    useSelfClosingTagIfEmpty?: boolean;
    /**
     * Whether to throw an exception if basic XML validation fails while
     * building the document.
     *
     * By default, this is enabled.
     */
    validation?: boolean;
    /**
     * If an object or map contains a key that, when converted to a string,
     * begins with the value of `valueString`, then the value mapped by said key
     * will be represented as bare text within the XML element for that object.
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
     * The handlers in `typeHandlers` are applied to the value.
     *
     * The default value is `"#"`.
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
     * return a string or value that can be converted to a string, which will
     * become the name for each XML element for each item in the array or set.
     * Alternatively, this function may return `null` to indicate that no
     * wrapping should occur.
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
     * The default value is an empty object.
     */
    wrapHandlers?: IWrapHandlers;
}

/**
 * Implementation of the IOptions interface used to provide default values
 * to fields.
 */
export class Options implements IOptions {
    public aliasString = "=";
    public attributeString = "@";
    public cdataInvalidChars = false;
    public cdataKeys: string[] = [];
    public declaration: DeclarationOptions;
    public dtd: DtdOptions;
    public format: FormatOptions;
    public replaceInvalidChars = false;
    public typeHandlers: TypeHandlers;
    public useSelfClosingTagIfEmpty = true;
    public validation = true;
    public valueString = "#";
    public wrapHandlers: WrapHandlers;

    constructor(options: IOptions = {}) {
        if (!isUndefined(options.validation)) {
            this.validation = options.validation;
        }

        if (!isUndefined(options.aliasString)) {
            this.aliasString = options.aliasString;
        }

        if (!isUndefined(options.attributeString)) {
            this.attributeString = options.attributeString;
        }

        if (!isUndefined(options.cdataInvalidChars)) {
            this.cdataInvalidChars = options.cdataInvalidChars;
        }

        if (!isUndefined(options.cdataKeys)) {
            this.cdataKeys = options.cdataKeys;
        }

        this.declaration = new DeclarationOptions(options.declaration);

        this.dtd = new DtdOptions(this.validation, options.dtd);

        this.format = new FormatOptions(options.format);

        if (!isUndefined(options.replaceInvalidChars)) {
            this.replaceInvalidChars = options.replaceInvalidChars;
        }

        this.typeHandlers = new TypeHandlers(options.typeHandlers);

        if (!isUndefined(options.useSelfClosingTagIfEmpty)) {
            this.useSelfClosingTagIfEmpty = options.useSelfClosingTagIfEmpty;
        }

        if (!isUndefined(options.valueString)) {
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
     * Whether to include a declaration in the generated XML. By default,
     * one is included.
     */
    include?: boolean;
    /**
     * The encoding attribute to be included in the declaration. If defined,
     * this value must be a valid encoding. By default, no encoding attribute
     * is included.
     */
    encoding?: string;
    /**
     * The value of the standalone attribute to be included in the declaration.
     * If defined, this value must be "yes" or "no". By default, no standalone
     * attribute is included.
     */
    standalone?: string;
    /**
     * The XML version to be included in the declaration. If defined, this
     * value must be a valid XML version number. Defaults to "1.0".
     */
    version?: string;
}

/**
 * Implementation of the IDeclarationOptions interface used to provide default
 * values to fields.
 */
export class DeclarationOptions implements IDeclarationOptions {
    public include = true;
    public encoding?: string;
    public standalone?: string;
    public version?: string;

    constructor(declarationOptions: IDeclarationOptions = {}) {
        if (!isUndefined(declarationOptions.include)) {
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
 * example of a DTD is as follows:
 *
 * ```xml
 * <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
 *                       "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
 * ```
 */
export interface IDtdOptions {
    /**
     * Whether to include a DTD in the generated XML. By default, no DTD is
     * included.
     */
    include?: boolean;
    /**
     * The name of the DTD. This value cannot be left undefined if `include`
     * is true.
     */
    name?: string;
    /**
     * The system identifier of the DTD, excluding quotation marks. By default,
     * no system identifier is included.
     */
    sysId?: string;
    /**
     * The public identifier of the DTD, excluding quotation marks. If a public
     * identifier is provided, a system identifier must be provided as well.
     * By default, no public identifier is included.
     */
    pubId?: string;
}

/**
 * Implementation of the IDtdOptions interface used to provide default values
 * to fields.
 */
export class DtdOptions implements IDtdOptions {
    public include = false;
    public name?: string;
    public sysId?: string;
    public pubId?: string;

    constructor(validation: boolean, dtdOptions: IDtdOptions = {}) {
        if (!isUndefined(dtdOptions.include)) {
            this.include = dtdOptions.include;
        }

        if (validation && isUndefined(dtdOptions.name) && this.include) {
            throw new Error(
                "options.dtd.name should be defined if" +
                    " options.dtd.include is true"
            );
        }

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
     * Whether double quotes or single quotes should be used in XML attributes.
     * By default, single quotes are used.
     */
    doubleQuotes?: boolean;
    /**
     * The indent string used for pretty-printing. The default indent string is
     * four spaces.
     */
    indent?: string;
    /**
     * The newline string used for pretty-printing. The default newline string
     * is "\n".
     */
    newline?: string;
    /**
     * Whether pretty-printing is enabled. By default, pretty-printing is
     * enabled.
     */
    pretty?: boolean;
}

/**
 * Implementation of the IFormatOptions interface used to provide default values
 * to fields.
 */
export class FormatOptions implements IFormatOptions {
    public doubleQuotes?: boolean;
    public indent?: string;
    public newline?: string;
    public pretty?: boolean;

    constructor(formatOptions: IFormatOptions = {}) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [type: string]: (value: any) => unknown;
}

/**
 * Implementation of the ITypeHandlers interface used to provide default values
 * to fields.
 */
export class TypeHandlers implements ITypeHandlers {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [type: string]: (value: any) => unknown;

    constructor(typeHandlers: ITypeHandlers = {}) {
        for (const key in typeHandlers) {
            if (Object.prototype.hasOwnProperty.call(typeHandlers, key)) {
                this[key] = typeHandlers[key];
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (key: string, value: any) => string | null;
}

/**
 * Implementation of the IWrapHandlers interface used to provide default values
 * to fields.
 */
export class WrapHandlers implements IWrapHandlers {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (key: string, value: any) => string | null;

    constructor(wrapHandlers: IWrapHandlers = {}) {
        for (const key in wrapHandlers) {
            if (Object.prototype.hasOwnProperty.call(wrapHandlers, key)) {
                this[key] = wrapHandlers[key];
            }
        }
    }
}
