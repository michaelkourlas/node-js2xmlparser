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

/**
 * @private
 */
export function isUndefined(val: any): val is undefined {
    return Object.prototype.toString.call(val) === "[object Undefined]";
}

/**
 * @private
 */
export function isNull(val: any): val is null {
    return Object.prototype.toString.call(val) === "[object Null]";
}

/* tslint:disable:ban-types */
/**
 * @private
 */
export function isObject(val: any): val is Object {
    return Object.prototype.toString.call(val) === "[object Object]";
}

/* tslint:enable:ban-types */

/**
 * @private
 */
export function isArray(val: any): val is any[] {
    return Object.prototype.toString.call(val) === "[object Array]";
}

/* tslint:disable:ban-types */
/**
 * @private
 */
export function isFunction(val: any): val is Function {
    return Object.prototype.toString.call(val) === "[object Function]";
}

/* tslint:enable:ban-types */

/**
 * @private
 */
export function isSet(val: any): boolean {
    return Object.prototype.toString.call(val) === "[object Set]";
}

/**
 * @private
 */
export function isMap(val: any): boolean {
    return Object.prototype.toString.call(val) === "[object Map]";
}

/**
 * Returns a string representation of the specified value, as given by the
 * value's toString() method (if it has one) or the global String() function
 * (if it does not).
 *
 * @param value The value to convert to a string.
 *
 * @returns A string representation of the specified value.
 *
 * @private
 */
export function stringify(value: any): string {
    if (!isUndefined(value) && !isNull(value)) {
        if (!isFunction(value.toString)) {
            value = value.toString();
        }
    }
    return String(value);
}
