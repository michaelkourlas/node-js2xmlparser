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
import {XmlAttribute, XmlDocument, XmlElement} from "xmlcreate";
import {IOptions, IRootAttributes, Options } from "./options";
import {
    isArray,
    isMap,
    isNull,
    isObject,
    isPrimitive,
    isSet,
    isString,
    isUndefined,
    stringify
} from "./utils";

/**
 * Parses a string into XML.
 *
 * @param str The string to parse into XML.
 * @param parentElement The XML element or attribute that will contain the
 *                      string.
 * @param options Options for parsing the string into XML.
 *
 * @private
 */
function parseString(str: string, parentElement: XmlAttribute | XmlElement,
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
                    parentElement.cdata(cdataStrs[i]);
                } else {
                    parentElement.charData(cdataStrs[i]);
                }
                if (i < cdataStrs.length - 1) {
                    parentElement.charData("]]>");
                }
            }
        } else {
            parentElement.charData(str);
        }
    } else {
        parentElement.text(str);
    }
}

/**
 * Parses an attribute into XML.
 *
 * @param name The name of the attribute.
 * @param value The value of the attribute.
 * @param parentElement The XML element that will contain the string.
 * @param options Options for parsing the attribute into XML.
 *
 * @private
 */
function parseAttribute(name: string, value: string, parentElement: XmlElement,
                        options: Options): void
{
    const attribute = parentElement.attribute(name, "");
    if (isPrimitive(value)) {
        parseString(stringify(value), attribute, options);
    } else {
        throw new Error("attribute value for name '" + name + "' should be a"
                        + " primitive (string, number, boolean, null, or"
                        + " undefined)");
    }
}

/**
 * Parses an object or Map entry into XML.
 *
 * @param key The key associated with the object or Map entry.
 * @param value The object or map entry.
 * @param parentElement The XML element that will contain the object or map
 *                      entry.
 * @param options Options for parsing the object or map entry into XML.
 *
 * @private
 */
function parseObjectOrMapEntry(key: string, value: any,
                               parentElement: XmlElement,
                               options: Options): void
{
    // Alias key
    if (key === options.aliasString) {
        if (!isString(value)) {
            throw new Error("aliasString value for " + value
                            + " should be a string");
        }
        parentElement.name = value;
        return;
    }

    // Attributes key
    if (key.indexOf(options.attributeString) === 0) {
        if (isObject(value)) {
            for (const subkey of Object.keys(value)) {
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
        if (isPrimitive(value)) {
            parseValue(key, value, parentElement, options);
            return;
        } else {
            throw new Error("value " + value + " should be a primitive"
                            + " (string, number, boolean, null, or undefined)");
        }
    }

    // Standard handling (create new element for entry)
    let element = parentElement;
    if (!isArray(value) && !isSet(value)) {
        element = parentElement.element(key);
    }
    parseValue(key, value, element, options);
}

/**
 * Parses an Object or Map into XML.
 *
 * @param objectOrMap The object or map to parse into XML.
 * @param parentElement The XML element that will contain the object.
 * @param options Options for parsing the object into XML.
 *
 * @private
 */
function parseObjectOrMap(objectOrMap: any, parentElement: XmlElement,
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
 * Parses an array or Set into XML.
 *
 * @param key The key associated with the array or set to parse into XML.
 * @param arrayOrSet The array or set to parse into XML.
 * @param parentElement The XML element that will contain the function.
 * @param options Options for parsing the array or set into XML.
 *
 * @private
 */
function parseArrayOrSet(key: string, arrayOrSet: any,
                         parentElement: XmlElement, options: Options): void
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
        if (isString(arrayNameFuncKey)) {
            arrayKey = arrayNameFuncKey;
            arrayElement = parentElement.element(key);
        } else if (!isNull(arrayNameFuncKey)) {
            throw new Error("wrapHandlers function for " + arrayKey
                            + " should return a string or null");
        }
    }

    arrayOrSet.forEach((item: any) => {
        let element = arrayElement;
        if (!isArray(item) && !isSet(item)) {
            element = arrayElement.element(arrayKey);
        }
        parseValue(arrayKey, item, element, options);
    });
}

/**
 * Parses an arbitrary JavaScript value into XML.
 *
 * @param key The key associated with the value to parse into XML.
 * @param value The value to parse into XML.
 * @param parentElement The XML element that will contain the value.
 * @param options Options for parsing the value into XML.
 *
 * @private
 */
function parseValue(key: string, value: any, parentElement: XmlElement,
                    options: Options): void
{
    // If a handler for a particular type is user-defined, use that handler
    // instead of the defaults
    const type = Object.prototype.toString.call(value);
    let handler: ((value: any) => any) | undefined;
    if (options.typeHandlers.hasOwnProperty("*")) {
        handler = options.typeHandlers["*"];
    }
    if (options.typeHandlers.hasOwnProperty(type)) {
        handler = options.typeHandlers[type];
    }
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
 * Returns a XML document corresponding to the specified value.
 *
 * @param root The name of the root XML element. When the value is converted to
 *             XML, it will be a child of this root element.
 * @param value The value to convert to XML.
 * @param options Options for parsing the value into XML.
 * @param attributes Extra attributes to use in the root element.
 *
 * @returns An XML document corresponding to the specified value.
 *
 * @private
 */
function parseToDocument(root: string, value: any,
                         options: Options,
                         attributes?: IRootAttributes): XmlDocument
{
    const document: XmlDocument = new XmlDocument(root);
    if (options.declaration.include) {
        document.decl(options.declaration);
    }
    if (options.dtd.include) {
        document.dtd(options.dtd.name!, options.dtd.sysId, options.dtd.pubId);
    }
    if (attributes) {
        Object.keys(attributes).forEach((attribute) => {
            document.root().attribute(attribute, attributes[attribute]).up();
        });
    }
    parseValue(root, value, document.root() as XmlElement, options);
    return document;
}

/**
 * Returns a XML string representation of the specified object.
 *
 * @param root The name of the root XML element. When the object is converted
 *             to XML, it will be a child of this root element.
 * @param object The object to convert to XML.
 * @param options Options for parsing the object and formatting the resulting
 *                XML.
 * @param attributes Extra attributes to use in the root element.
 *
 * @returns An XML string representation of the specified object.
 */
export function parse(root: string,
                      object: any,
                      options?: IOptions,
                      attributes?: IRootAttributes): string {
    const opts: Options = new Options(options);
    const document = parseToDocument(root, object, opts, attributes);
    return document.toString(opts.format);
}
