
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
 * @param {function|string} naming Наименование при ошибке (строка или функция, возвращающая строку)
 * @param {string|object} typeInfo Информация о типе проверяемого значения
 * @param {*} value Проверяемое значение
 * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
 * @return {string}
 */
export const makeMessage = (naming, typeInfo, value, isRequired) => {
    let name;
    if (typeof naming === 'function') {
        name = naming();
    }
    else
    if (typeof naming === 'string' && naming.length !== 0) {
        const i = naming.indexOf(':');
        if (0 < i && i < naming.length - 1) {
            // Если двоеточие есть, и это не первый и не последний символ, то:
            const key = naming.substring(0, i);
            name = key === 'arg'
                ? `Argument "${naming.substring(i + 1)}"`
                : `${key.charAt(0).toUpperCase()}${key.substring(1)} "${naming.substring(i + 1)}"`;
        }
        else {
            name = naming;
        }
    }
    else {
        throw new TypeError(`Wrong argument "naming": ${naming}`);
    }
    const isComplexType = typeInfo != null && typeof typeInfo === 'object';
    let method = isComplexType ? typeInfo.name : typeInfo;
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
 * @param {Error} err Настраиваемая ошибка
 * @param {number} deep Глубина сброса стека
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
