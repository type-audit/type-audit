
/**
 * @private
 * @param {function} auditor Checking function
 * @param {object} info Information about auditor
 * @return {function}
 */
const withInfo = (auditor, info) => {
    Object.defineProperty(auditor, 'info', {value:Object.freeze(info)});
    return auditor;
};



/**
 * Set of auditing methods
 * @public
 * @type {object}
 */
const auditors = {
    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    func(isRequired) {
        const func = (value) => (!isRequired && value == null) || (typeof value === 'function');
        return withInfo(func, {isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    object(isRequired) {
        const object = (value) => value == null ? !isRequired : (typeof value === 'object' && !Array.isArray(value));
        return withInfo(object, {isRequired});
    },

    /**
     * @public
     * @param {function} valueClass Class of checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    instanceOf(valueClass, isRequired) {
        if (typeof valueClass !== 'function') {
            throw new TypeError(`Wrong argument "valueClass": ${valueClass}`);
        }
        const instanceOf = (value) => (!isRequired && value == null) || (value instanceof valueClass);
        return withInfo(instanceOf, {type:valueClass, isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    array(isRequired) {
        const array = (value) => (!isRequired && value == null) || Array.isArray(value);
        return withInfo(array, {isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    notEmptyArray(isRequired) {
        const notEmptyArray = (value) => (!isRequired && value == null) || (Array.isArray(value) && value.length !== 0);
        return withInfo(notEmptyArray, {isRequired});
    },

    /**
     * @public
     * @param {string|function} itemType Type or class of elements of checked value
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    arrayOf(itemType, isRequired) {
        const argType = typeof itemType;
        const isClass = argType === 'function';
        if (!isClass && !(argType === 'string' && itemType.length !== 0)) {
            throw new TypeError(`Wrong argument "itemType": ${itemType}`);
        }
        const itemAuditor = isClass
            ? (item) => item instanceof itemType
            : (itemType === 'array'
                ? (item) => Array.isArray(item)
                : (itemType === 'object'
                    ? (item) => item !== null && typeof item === 'object' && !Array.isArray(item)
                    : (item) => typeof item === itemType));
        const arrayOf = (value) => (!isRequired && value == null) || (Array.isArray(value) && value.every(itemAuditor));
        return withInfo(arrayOf, {type:itemType, isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    string(isRequired) {
        const string = (value) => (!isRequired && value == null) || (typeof value === 'string');
        return withInfo(string, {isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    notEmptyString(isRequired) {
        const notEmptyString = (value) =>
            (!isRequired && value == null) || (typeof value === 'string' && value.length !== 0);
        return withInfo(notEmptyString, {isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    number(isRequired) {
        const number = (value) => (!isRequired && value == null) || (typeof value === 'number');
        return withInfo(number, {isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    positiveNumber(isRequired) {
        const positiveNumber = (value) => (!isRequired && value == null) || (typeof value === 'number' && 0 < value);
        return withInfo(positiveNumber, {isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    notNegativeNumber(isRequired) {
        const notNegativeNumber = (value) => (!isRequired && value == null) || (typeof value === 'number' && 0 <= value);
        return withInfo(notNegativeNumber, {isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    integer(isRequired) {
        const integer = (value) =>
            (!isRequired && value == null) || (typeof value === 'number' && Math.round(value) === value);
        return withInfo(integer, {isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    positiveInteger(isRequired) {
        const positiveInteger = (value) =>
            (!isRequired && value == null) || (typeof value === 'number' && 0 < value && Math.round(value) === value);
        return withInfo(positiveInteger, {isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    notNegativeInteger(isRequired) {
        const notNegativeInteger = (value) =>
            (!isRequired && value == null) || (typeof value === 'number' && 0 <= value && Math.round(value) === value);
        return withInfo(notNegativeInteger, {isRequired});
    },

    /**
     * @public
     * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
     * @return {function(*):boolean}
     */
    bool(isRequired) {
        const bool = (value) => (!isRequired && value == null) || (typeof value === 'boolean');
        return withInfo(bool, {isRequired});
    }
};
Object.freeze(auditors);

export default auditors;
