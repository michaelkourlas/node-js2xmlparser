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
export function isUndefined(val: unknown): val is undefined {
    return Object.prototype.toString.call(val) === "[object Undefined]";
}

/**
 * @private
 */
export function isNull(val: unknown): val is null {
    return Object.prototype.toString.call(val) === "[object Null]";
}

/**
 * @private
 */
export function isObject(val: unknown): val is Record<string, unknown> {
    return Object.prototype.toString.call(val) === "[object Object]";
}

/**
 * @private
 */
export function isArray(val: unknown): val is unknown[] {
    return Object.prototype.toString.call(val) === "[object Array]";
}

/**
 * @private
 */
export function isFunction(val: unknown): val is Function {
    return Object.prototype.toString.call(val) === "[object Function]";
}

/**
 * @private
 */
export function isSet(val: unknown): val is Set<unknown> {
    return Object.prototype.toString.call(val) === "[object Set]";
}

/**
 * @private
 */
export function isMap(val: unknown): val is Map<unknown, unknown> {
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringify(value: any): string {
    if (!isUndefined(value) && !isNull(value)) {
        if (!isFunction(value?.toString)) {
            value = value.toString();
        }
    }
    return String(value);
}
