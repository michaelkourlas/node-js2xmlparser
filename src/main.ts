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
import {XmlAttribute, XmlDocument, XmlElement} from "xmlcreate";
import {IOptions, Options} from "./options";
import {
    isArray,
    isMap,
    isNull,
    isObject,
    isSet,
    isUndefined,
    stringify
} from "./utils";

/**
 * Indicates that an object of a particular type should be suppressed from the
 * XML output.
 *
 * See the `typeHandlers` property in {@link IOptions} for more details.
 */
export class Absent {
    private static _instance = new Absent();

    private constructor() {
    }

    /**
     * Returns the sole instance of Absent.
     */
    public static get instance() {
        return Absent._instance;
    }
}

/**
 * Gets the type handler associated with a value.
 *
 * @private
 */
function getHandler(value: any,
                    options: Options): ((value: any) => any) | undefined
{
    const type = Object.prototype.toString.call(value);
    let handler: ((value: any) => any) | undefined;
    if (options.typeHandlers.hasOwnProperty("*")) {
        handler = options.typeHandlers["*"];
    }
    if (options.typeHandlers.hasOwnProperty(type)) {
        handler = options.typeHandlers[type];
    }
    return handler;
}

/**
 * Parses a string into XML and adds it to the parent element or attribute.
 *
 * @private
 */
function parseString(str: string,
                     parentElement: XmlAttribute<any> | XmlElement<any>,
                     options: Options): void
{
    const requiresCdata = (s: string) => {
        return (options.cdataInvalidChars && (s.indexOf("<") !== -1
                                              || s.indexOf("&") !== -1))
               || options.cdataKeys.indexOf(parentElement.name) !== -1
               || options.cdataKeys.indexOf("*") !== -1;
    };

    if (parentElement instanceof XmlElement) {
        if (requiresCdata(str)) {
            const cdataStrs = str.split("]]>");
            for (let i = 0; i < cdataStrs.length; i++) {
                if (requiresCdata(cdataStrs[i])) {
                    parentElement.cdata(
                        {
                            charData: cdataStrs[i],
                            replaceInvalidCharsInCharData:
                            options.replaceInvalidChars
                        });
                } else {
                    parentElement.charData(
                        {
                            charData: cdataStrs[i],
                            replaceInvalidCharsInCharData:
                            options.replaceInvalidChars
                        });
                }
                if (i < cdataStrs.length - 1) {
                    parentElement.charData(
                        {
                            charData: "]]>",
                            replaceInvalidCharsInCharData:
                            options.replaceInvalidChars
                        });
                }
            }
        } else {
            parentElement.charData(
                {
                    charData: str.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, ""),
                    replaceInvalidCharsInCharData: options.replaceInvalidChars
                });
        }
    } else {
        parentElement.text(
            {
                charData: str.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, ""),
                replaceInvalidCharsInCharData: options.replaceInvalidChars
            });
    }
}

/**
 * Parses an attribute into XML and adds it to the parent element.
 *
 * @private
 */
function parseAttribute(name: string, value: string,
                        parentElement: XmlElement<any>,
                        options: Options): void
{
    const attribute = parentElement.attribute(
        {
            name,
            replaceInvalidCharsInName: options.replaceInvalidChars
        });
    parseString(stringify(value), attribute, options);
}

/**
 * Parses an object or Map entry into XML and adds it to the parent element.
 *
 * @private
 */
function parseObjectOrMapEntry(key: string, value: any,
                               parentElement: XmlElement<any>,
                               options: Options): void
{
    // Alias key
    if (key === options.aliasString) {
        parentElement.name = stringify(value);
        return;
    }

    // Attributes key
    if (key.indexOf(options.attributeString) === 0) {
        for (const subkey of Object.keys(value)) {
            parseAttribute(subkey, stringify(value[subkey]),
                           parentElement, options);
        }
        return;
    }

    // Value key
    if (key.indexOf(options.valueString) === 0) {
        parseValue(key, stringify(value), parentElement, options);
        return;
    }

    // Standard handling (create new element for entry)
    let element = parentElement;
    if (!isArray(value) && !isSet(value)) {
        // If handler for value returns absent, then do not add element
        const handler = getHandler(value, options);
        if (!isUndefined(handler)) {
            if (handler(value) === Absent.instance) {
                return;
            }
        }

        element = parentElement.element(
            {
                name: key,
                replaceInvalidCharsInName: options.replaceInvalidChars,
                useSelfClosingTagIfEmpty: options.useSelfClosingTagIfEmpty
            });
    }
    parseValue(key, value, element, options);
}

/**
 * Parses an Object or Map into XML and adds it to the parent element.
 *
 * @private
 */
function parseObjectOrMap(objectOrMap: any, parentElement: XmlElement<any>,
                          options: Options): void
{
    if (isMap(objectOrMap)) {
        objectOrMap.forEach((value: any, key: any) => {
            parseObjectOrMapEntry(stringify(key), value, parentElement,
                                  options);
        });
    } else {
        for (const key of Object.keys(objectOrMap)) {
            parseObjectOrMapEntry(key, objectOrMap[key], parentElement,
                                  options);
        }
    }
}

/**
 * Parses an array or Set into XML and adds it to the parent element.
 *
 * @private
 */
function parseArrayOrSet(key: string, arrayOrSet: any,
                         parentElement: XmlElement<any>,
                         options: Options): void
{
    let arrayNameFunc: ((key: string, value: any) => string | null) | undefined;
    if (options.wrapHandlers.hasOwnProperty("*")) {
        arrayNameFunc = options.wrapHandlers["*"];
    }
    if (options.wrapHandlers.hasOwnProperty(key)) {
        arrayNameFunc = options.wrapHandlers[key];
    }

    let arrayKey = key;
    let arrayElement = parentElement;
    if (!isUndefined(arrayNameFunc)) {
        const arrayNameFuncKey = arrayNameFunc(arrayKey, arrayOrSet);
        if (!isNull(arrayNameFuncKey)) {
            arrayKey = arrayNameFuncKey;
            arrayElement = parentElement.element(
                {
                    name: key,
                    replaceInvalidCharsInName: options.replaceInvalidChars,
                    useSelfClosingTagIfEmpty: options.useSelfClosingTagIfEmpty
                }
            );
        }
    }

    arrayOrSet.forEach((item: any) => {
        let element = arrayElement;
        if (!isArray(item) && !isSet(item)) {
            // If handler for value returns absent, then do not add element
            const handler = getHandler(item, options);
            if (!isUndefined(handler)) {
                if (handler(item) === Absent.instance) {
                    return;
                }
            }

            element = arrayElement.element(
                {
                    name: arrayKey,
                    replaceInvalidCharsInName: options.replaceInvalidChars,
                    useSelfClosingTagIfEmpty: options.useSelfClosingTagIfEmpty
                }
            );
        }
        parseValue(arrayKey, item, element, options);
    });
}

/**
 * Parses an arbitrary JavaScript value into XML and adds it to the parent
 * element.
 *
 * @private
 */
function parseValue(key: string, value: any, parentElement: XmlElement<any>,
                    options: Options): void
{
    // If a handler for a particular type is user-defined, use that handler
    // instead of the defaults
    const handler = getHandler(value, options);
    if (!isUndefined(handler)) {
        value = handler(value);
    }

    if (isObject(value) || isMap(value)) {
        parseObjectOrMap(value, parentElement, options);
        return;
    }
    if (isArray(value) || isSet(value)) {
        parseArrayOrSet(key, value, parentElement, options);
        return;
    }

    parseString(stringify(value), parentElement, options);
}

/**
 * Converts the specified object to XML and adds the XML representation to the
 * specified XmlDocument object using the specified options.
 *
 * This function does not add a root element. In addition, it does not add an
 * XML declaration or DTD, and the associated options in {@link IOptions} are
 * ignored. If desired, these must be added manually.
 */
export function parseToExistingElement(element: XmlElement<any>, object: any,
                                       options?: IOptions)
{
    const opts: Options = new Options(options);
    parseValue(element.name, object, element, opts);
}

/**
 * Returns a XML string representation of the specified object using the
 * specified options.
 *
 * `root` is the name of the root XML element. When the object is converted
 * to XML, it will be a child of this root element.
 */
export function parse(root: string, object: any, options?: IOptions): string {
    const opts = new Options(options);
    const document = new XmlDocument(
        {
            validation: opts.validation
        }
    );
    if (opts.declaration.include) {
        document.decl(opts.declaration);
    }
    if (opts.dtd.include) {
        document.dtd(
            {
                // Validated in options.ts
                name: opts.dtd.name!,
                pubId: opts.dtd.pubId,
                sysId: opts.dtd.sysId
            }
        );
    }
    const rootElement = document.element(
        {
            name: root,
            replaceInvalidCharsInName: opts.replaceInvalidChars,
            useSelfClosingTagIfEmpty: opts.useSelfClosingTagIfEmpty
        }
    );
    parseToExistingElement(rootElement, object, options);
    return document.toString(opts.format);
}
