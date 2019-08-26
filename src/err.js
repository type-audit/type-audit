
/**
 * @private
 * @type {object}
 */
const TYPE_NAMES = {
    function: 'a function',
    object: 'an object',
    instanceOf: (objectClass) => `instance of ${objectClass.name}`,
    array: 'an array',
    notEmptyArray: 'not empty array',
    arrayOf: (itemType) => `array of ${typeof itemType === 'function' ? itemType.name : itemType}`,
    string: 'a string',
    notEmptyString: 'not empty string',
    number: 'a number',
    positiveNumber: 'positive number',
    notNegativeNumber: 'not negative number',
    integer: 'an integer',
    positiveInteger: 'positive integer',
    notNegativeInteger: 'not negative integer',
    boolean: 'a boolean'
};



/**
 * @public
 * Create error message
 * @param {function|string} naming Name on error (string or function that returns a string)
 * @param {string|object} typeInfo Info about type of checked value
 * @param {*} value Checked value
 * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
 * @return {string}
 */
export const makeMessage = (naming, typeInfo, value, isRequired) => {
    const isFunc = typeof naming === 'function';
    let name = isFunc ? naming() : naming;
    if (typeof name !== 'string' || name.length === 0) {
        throw new TypeError(
            isFunc ? `Argument "naming" returns a wrong result: ${name}` : `Wrong argument "naming": ${name}`
        );
    }
    const i = name.indexOf(':');
    if (0 < i && i < name.length - 1) {
        // If there is a colon, and it is not the first and not the last character, then:
        const key = name.substring(0, i);
        name = key === 'arg'
            ? `Argument "${name.substring(i + 1)}"`
            : `${key.charAt(0).toUpperCase()}${key.substring(1)} "${name.substring(i + 1)}"`;
    }
    const isComplexType = typeInfo != null && typeof typeInfo === 'object';
    const method = isComplexType ? typeInfo.name : typeInfo;
    if (typeof method !== 'string' || method.length === 0) {
        throw new TypeError(`Wrong argument "typeInfo": ${typeInfo}`);
    }
    if (!(method in TYPE_NAMES)) {
        throw new TypeError(`Argument "typeInfo" contains an unknown ${isComplexType ? 'name' : 'value'}: ${typeInfo}`);
    }
    const type = TYPE_NAMES[method];
    let typeName;
    if (typeof type === 'function') {
        if (!isComplexType || !('type' in typeInfo)) {
            throw new TypeError(`Argument "typeInfo" must contain a type specification: ${typeInfo}`);
        }
        typeName = type(typeInfo.type);
    }
    else {
        typeName = type;
    }
    return `${name} ${isRequired ? 'must be' : 'can be only'} ${typeName}: ${value}`;
};

/**
 * @public
 * Setup of error properties
 * @param {Error} err Configured error
 * @param {number} deep Depth of the stack drop
 * @return {Error}
 */
export const setup = (err, deep) => {
    const {message} = err;
    const stack = err.stack.split(/[\r\n]+/);
    stack.splice(stack[0].indexOf(message) !== -1 ? 1 : 0, deep);
    if (err.fileName !== undefined && err.lineNumber !== undefined) {
        // This for browsers like Mozilla
        const where = stack[0].match(/@([^\s]+):([0-9]+):([0-9]+)$/i);
        err.fileName = where[1];
        err.lineNumber = +where[2];
        err.columnNumber = +where[3];
    }
    err.stack = stack.join('\n');
    return err;
};
