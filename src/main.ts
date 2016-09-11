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

import {IOptions, validateOptions} from "./options";
import {isType, stringify} from "./utils";
import {XmlAttribute, XmlDocument, XmlElement} from "xmlcreate";

/**
 * Parses a string into XML.
 *
 * @param {string} str                            The string to parse into XML.
 * @param {XmlAttribute|XmlElement} parentElement The XML element or attribute
 *                                                that will contain the string.
 * @param {IOptions} options                      Options for parsing the
 *                                                string into XML.
 *
 * @private
 */
function parseString(str: string, parentElement: XmlAttribute | XmlElement,
                     options: IOptions): void
{
    let requiresCdata = (s: string) => {
        return (options.cdataInvalidChars && (s.indexOf("<") !== -1
                                              || s.indexOf("&") !== -1))
               || options.cdataKeys.indexOf(parentElement.name) !== -1
               || options.cdataKeys.indexOf("*") !== -1;
    };

    if (parentElement instanceof XmlElement && requiresCdata(str)) {
        let cdataStrs = str.split("]]>");
        for (let i = 0; i < cdataStrs.length; i++) {
            if (requiresCdata(cdataStrs[i])) {
                parentElement.cdata(cdataStrs[i]);
            } else {
                parentElement.text(cdataStrs[i]);
            }
            if (i < cdataStrs.length - 1) {
                parentElement.text("]]>");
            }
        }
    } else {
        parentElement.text(str);
    }
}

/**
 * Parses an attribute into XML.
 *
 * @param {string} name              The name of the attribute.
 * @param {string} value             The value of the attribute.
 * @param {XmlElement} parentElement The XML element that will contain the
 *                                   string.
 * @param {IOptions} options         Options for parsing the attribute into XML.
 *
 * @private
 */
function parseAttribute(name: string, value: string, parentElement: XmlElement,
                        options: IOptions): void
{
    let attribute = parentElement.attribute(name, "");
    if (!isType(value, "String")) {
        throw new Error("attribute value for name '" + name + "' should be a" +
                        " string");
    }
    parseString(value, attribute, options);
}

/**
 * Parses an object or Map entry into XML.
 *
 * @param {string} key               The key associated with the object or Map
 *                                   entry.
 * @param {*} value                  The object or map entry.
 * @param {XmlElement} parentElement The XML element that will contain the
 *                                   object or map entry.
 * @param {IOptions} options         Options for parsing the object or map
 *                                   entry into XML.
 *
 * @private
 */
function parseObjectOrMapEntry(key: string, value: any,
                               parentElement: XmlElement,
                               options: IOptions): void
{
    // Alias key
    if (key === options.aliasString) {
        if (!isType(value, "String")) {
            throw new Error("aliasString value for " + value
                            + " should be a string");
        }
        parentElement.name = value;
        return;
    }

    // Attributes key
    if (key.indexOf(options.attributeString) === 0) {
        if (isType(value, "Object")) {
            for (let subkey of Object.keys(value)) {
                parseAttribute(subkey, value[subkey], parentElement, options);
            }
        } else {
            throw new Error("attributes object for " + key + " should be an"
                            + " object");
        }
        return;
    }

    // Value key
    if (key.indexOf(options.valueString) === 0) {
        if (isType(value, "String") || isType(value, "Number")
            || isType(value, "Boolean") || isType(value, "Null")
            || isType(value, "Undefined"))
        {
            parseValue(key, value, parentElement, options);
            return;
        } else {
            throw new Error("value value " + value + " must be a primitive"
                            + " (string, number, null, or undefined)");
        }
    }

    // Standard handling (create new element for entry)
    let element = parentElement;
    if (!isType(value, "Array") && !isType(value, "Set")) {
        element = parentElement.element(key);
    }
    parseValue(key, value, element, options);
}

/**
 * Parses an Object or Map into XML.
 *
 * @param {*} objectOrMap            The object or map to parse into XML.
 * @param {XmlElement} parentElement The XML element that will contain the
 *                                   object.
 * @param {IOptions} options         Options for parsing the object into XML.
 *
 * @private
 */
function parseObjectOrMap(objectOrMap: any, parentElement: XmlElement,
                          options: IOptions): void
{
    if (isType(objectOrMap, "Map")) {
        objectOrMap.forEach((value: any, key: any) => {
            parseObjectOrMapEntry(stringify(key), value, parentElement,
                                  options);
        });
    } else {
        for (let key of Object.keys(objectOrMap)) {
            parseObjectOrMapEntry(key, objectOrMap[key], parentElement,
                                  options);
        }
    }
}

/**
 * Parses an array or Set into XML.
 *
 * @param {string} key               The key associated with the array or set to
 *                                   parse into XML.
 * @param {*} arrayOrSet             The array or set to parse into XML.
 * @param {XmlElement} parentElement The XML element that will contain the
 *                                   function.
 * @param {IOptions} options         Options for parsing the array or set into
 *                                   XML.
 *
 * @private
 */
function parseArrayOrSet(key: string, arrayOrSet: any,
                         parentElement: XmlElement, options: IOptions): void
{
    let arrayNameFunc: (key: string, value: any) => string;
    if (options.wrapHandlers.hasOwnProperty("*")) {
        arrayNameFunc = options.wrapHandlers["*"];
    }
    if (options.wrapHandlers.hasOwnProperty(key)) {
        arrayNameFunc = options.wrapHandlers[key];
    }

    let arrayKey = key;
    let arrayElement = parentElement;
    if (!isType(arrayNameFunc, "Undefined")) {
        let arrayNameFuncKey = arrayNameFunc(arrayKey, arrayOrSet);
        if (isType(arrayNameFuncKey, "String")) {
            arrayKey = arrayNameFuncKey;
            arrayElement = parentElement.element(key);
        } else if (!isType(arrayNameFuncKey, "Null")) {
            throw new Error("wrapHandlers function for " + arrayKey
                            + " should return a string or null");
        }
    }

    arrayOrSet.forEach((item: any) => {
        let element = arrayElement;
        if (!isType(item, "Array") && !isType(item, "Set")) {
            element = arrayElement.element(arrayKey);
        }
        parseValue(arrayKey, item, element, options);
    });
}

/**
 * Parses an arbitrary JavaScript value into XML.
 *
 * @param {string} key               The key associated with the value to parse
 *                                   into XML.
 * @param {*} value                  The value to parse into XML.
 * @param {XmlElement} parentElement The XML element that will contain the
 *                                   value.
 * @param {IOptions} options         Options for parsing the value into XML.
 *
 * @private
 */
function parseValue(key: string, value: any, parentElement: XmlElement,
                    options: IOptions): void
{
    // If a handler for a particular type is user-defined, use that handler
    // instead of the defaults
    let type = Object.prototype.toString.call(value);
    let handler: (value: any) => any;
    if (options.typeHandlers.hasOwnProperty("*")) {
        handler = options.typeHandlers["*"];
    }
    if (options.typeHandlers.hasOwnProperty(type)) {
        handler = options.typeHandlers[type];
    }
    if (!isType(handler, "Undefined")) {
        value = handler(value);
    }

    if (isType(value, "Object") || isType(value, "Map")) {
        parseObjectOrMap(value, parentElement, options);
        return;
    }
    if (isType(value, "Array") || isType(value, "Set")) {
        parseArrayOrSet(key, value, parentElement, options);
        return;
    }

    parseString(stringify(value), parentElement, options);
}

/**
 * Returns a XML document corresponding to the specified value.
 *
 * @param {string} root      The name of the root XML element. When the value is
 *                           converted to XML, it will be a child of this root
 *                           element.
 * @param {*} value          The value to convert to XML.
 * @param {IOptions} options Options for parsing the value into XML.
 *
 * @returns {XmlDocument} An XML document corresponding to the specified value.
 *
 * @private
 */
function parseToDocument(root: string, value: any,
                         options: IOptions): XmlDocument
{
    let document: XmlDocument = new XmlDocument(root);
    if (options.declaration.include) {
        document.decl(options.declaration);
    }
    if (options.dtd.include) {
        document.dtd(options.dtd.name, options.dtd.sysId, options.dtd.pubId);
    }
    parseValue(root, value, <XmlElement> document.root(), options);
    return document;
}

/**
 * Returns a XML string representation of the specified object.
 *
 * @param {string} root        The name of the root XML element. When the
 *                             object is converted to XML, it will be a
 *                             child of this root element.
 * @param {*} object           The object to convert to XML.
 * @param {IOptions} [options] Options for parsing the object and
 *                             formatting the resulting XML.
 *
 * @returns {string} An XML string representation of the specified object.
 */
export function parse(root: string, object: any,
                      options: IOptions = {}): string {
    options = validateOptions(options);
    let document = parseToDocument(root, object, options);
    return document.toString(options.format);
}
