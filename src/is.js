/**
 * Set of checking methods
 */
const Is = {
    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    function(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'function');
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    object(value, isRequired) {
        return value == null ? !isRequired : (typeof value === 'object' && !Array.isArray(value));
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {function} valueClass Class of checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    instanceOf(value, valueClass, isRequired) {
        if (typeof valueClass !== 'function') {
            throw new TypeError(`Wrong argument "valueClass": ${valueClass}`);
        }
        return (!isRequired && value == null) || (value instanceof valueClass);
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    array(value, isRequired) {
        return (!isRequired && value == null) || Array.isArray(value);
    },

    /**
     * @public

     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    notEmptyArray(value, isRequired) {
        return (!isRequired && value == null) || (Array.isArray(value) && value.length !== 0);
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {string|function} itemType Type or class of elements of checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    arrayOf(value, itemType, isRequired) {
        const argType = typeof itemType;
        const isClass = argType === 'function';
        if (!isClass && !(argType === 'string' && itemType.length !== 0)) {
            throw new TypeError(`Wrong argument "itemType": ${itemType}`);
        }
        return (!isRequired && value == null) || (Array.isArray(value) && value.every(isClass
            ? (item) => item instanceof itemType
            : (itemType === 'array'
                ? (item) => Array.isArray(item)
                : (itemType === 'object'
                    ? (item) => item !== null && typeof item === 'object' && !Array.isArray(item)
                    : (item) => typeof item === itemType)))
        );
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    string(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'string');
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    notEmptyString(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'string' && value.length !== 0);
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    number(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number');
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    positiveNumber(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number' && 0 < value);
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    notNegativeNumber(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number' && 0 <= value);
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    integer(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number' && Math.round(value) === value);
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    positiveInteger(value, isRequired) {
        return (!isRequired && value == null)
            || (typeof value === 'number' && 0 < value && Math.round(value) === value);
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    notNegativeInteger(value, isRequired) {
        return (!isRequired && value == null)
            || (typeof value === 'number' && 0 <= value && Math.round(value) === value);
    },

    /**
     * @public
     * @param {*} value Checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {boolean}
     */
    boolean(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'boolean');
    }
};
Object.freeze(Is);

export default Is;
