/**
 * delete repeat element from array
 */
Array.prototype.unique = function () {
    return [...new Set(this)];
}