/**
 * Polyfill for the project. Only add what you use.
 */

if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}