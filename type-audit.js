
/**
 * @type {object}
 */
const TYPE_NAMES = {
    function: 'a function',
    object: 'an object',
    instanceOf: (objectClass) => () => `instance of ${objectClass.name}`,
    array: 'an array',
    notEmptyArray: 'not empty array',
    arrayOf: (itemType) => () => `array of ${typeof itemType === 'function' ? itemType.name : itemType}`,
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
 * Класс, содержащий статические методы проверки
 */
class Is {
    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static function(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'function');
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static object(value, isRequired) {
        return isRequired ? (value != null && typeof value === 'object') : (value == null || typeof value === 'object');
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {function} valueClass Класс проверяемого значения
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static instanceOf(value, valueClass, isRequired) {
        if (typeof valueClass !== 'function') {
            throw new TypeError(`Wrong argument "valueClass": ${valueClass}`);
        }
        return (!isRequired && value == null) || (value instanceof valueClass);
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static array(value, isRequired) {
        return (!isRequired && value == null) || Array.isArray(value);
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static notEmptyArray(value, isRequired) {
        return (!isRequired && value == null) || (Array.isArray(value) && value.length !== 0);
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {string|function} itemType Тип/класс элемента проверяемого значения
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static arrayOf(value, itemType, isRequired) {
        const argType = typeof itemType;
        const isClass = argType === 'function';
        if (!isClass && !(argType === 'string' && itemType.length !== 0)) {
            throw new TypeError(`Wrong argument "itemType": ${itemType}`);
        }
        return (!isRequired && value == null) || (
            Array.isArray(value)
                && value.every(isClass ? (item) => item instanceof itemType : (item) => typeof item === itemType)
        );
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static string(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'string');
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static notEmptyString(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'string' && value.length !== 0);
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static number(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number');
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static positiveNumber(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number' && 0 < value);
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static notNegativeNumber(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number' && 0 <= value);
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static integer(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number' && Math.round(value) === value);
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static positiveInteger(value, isRequired) {
        return (!isRequired && value == null)
            || (typeof value === 'number' && 0 < value && Math.round(value) === value);
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static notNegativeInteger(value, isRequired) {
        return (!isRequired && value == null)
            || (typeof value === 'number' && 0 <= value && Math.round(value) === value);
    }

    /**
     * @public
     * @static
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    static boolean(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'boolean');
    }
}

/**
 * Список всех имён проверок из класса Is
 * @type {Array<string>}
 */
const checkers = Object.getOwnPropertyNames(Is).filter(
    ((excludes, item) => !excludes.includes(item)).bind(undefined, Object.getOwnPropertyNames(class {}))
);

/**
 * Количество дополнительных аргументов проверок из класса Is
 * @type {object<number>}
 */
const argLevels = checkers.reduce((result, method) => {
    const level = Is[method].length - 2;
    if (0 < level) {
        result[method] = level;
    }
    return result;
}, {});



/**
 * @protected
 * @param {function|string} naming Наименование при ошибке (строка или функция, возвращающая строку)
 * @param {string} type Тип проверяемого значения
 * @param {*} value Проверяемое значение
 * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
 * @return {string}
 */
const _errMessage = (naming, type, value, isRequired) => {
    let name;
    if (Is.function(naming, true)) {
        name = naming();
    }
    else
    if (Is.notEmptyString(naming, true)) {
        const i = naming.indexOf(':');
        if (0 < i && i < naming.length - 1) {
            // Если двоеточие есть, и это не первый и не последний символ, то:
            const key = naming.substring(0, i);
            name = (key === 'arg'
                ? 'Argument'
                : `${key.charAt(0).toUpperCase()}${key.substring(1)} "${naming.substring(i + 1)}"`);
        }
        else {
            name = naming;
        }
    }
    else {
        throw new TypeError(`Wrong argument "naming": ${naming}`);
    }
    return `${name} ${isRequired ? 'must be' : 'can be only'} ${type}': ${value}`;
};

/**
 * @protected
 * @param {string} message Текст сообщения об ошибке
 * @return {Error}
 */
const _error = (message) => {
    let err = new TypeError(message);
    const stack = err.stack.split(/[\r\n]+/);
    stack.splice(stack[0].indexOf(message) !== -1 ? 1 : 0, 2);
    if (err.fileName !== undefined && err.lineNumber !== undefined) {
        const where = stack[0].match(/@([^\s]+):([0-9]+):([0-9]+)$/i);
        err = new TypeError(message, where[1], +where[2], +where[3]);
    }
    err.stack = stack.join('\n');
    return err;
};



const _propGetChecker = (method, typeInfo, isRequired) => (props, propName, componentName) => {
    const needTypeInfo = 0 < argLevels[method];
    const checker = Is[method];
    const value = props[propName];
    if (needTypeInfo ? !checker(value, typeInfo, isRequired) : !checker(value, isRequired)) {
        const type = TYPE_NAMES[method];
        return _error(_errMessage(
            `Prop "${propName}" in component "${componentName}"`,
            needTypeInfo ? type(typeInfo) : type, value, isRequired
        ));
    }
};

/**
 * Набор проверок типов данных свойств react-компонентов
 */
const Prop = checkers.reduce((result, method) => {
    const needTypeInfo = 0 < argLevels[method];
    const f = needTypeInfo ? (typeInfo) => _propGetChecker(method, typeInfo, false) : _propGetChecker(method, false);
    f.isRequired = needTypeInfo
        ? (typeInfo) => _propGetChecker(method, typeInfo, true)
        : _propGetChecker(method, true);
    result[method] = f;
    return result;
}, {});



/**
 * Класс с методами проверки типов значений
 */
export default class TypeAudit {
    /**
     * @public
     * @static
     * @type {TypeAudit.is}
     */
    static is = Is;

    /**
     * @public
     * @static
     * @type {TypeAudit.prop}
     */
    static prop = Prop;
}

checkers.forEach((method) => {
    const needTypeInfo = 0 < argLevels[method];
    let checker;
    if (needTypeInfo) {
        /**
         * @public
         * @static
         * @param {*} value Проверяемое значение
         * @param {string|function} typeInfo Инормация о типе/классе проверяемого значения
         * @param {function|string} naming Наименование при ошибке (строка или функция, возвращающая строку)
         * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
         */
        checker = (value, typeInfo, naming, isRequired) => {
            if (!Is[method](value, typeInfo, isRequired)) {
                throw _error(_errMessage(naming, TYPE_NAMES[method](typeInfo), value, isRequired));
            }
        };
    }
    else {
        /**
         * @public
         * @static
         * @param {*} value Проверяемое значение
         * @param {function|string} naming Наименование при ошибке (строка или функция, возвращающая строку)
         * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
         */
        checker = (value, naming, isRequired) => {
            if (!Is[method](value, isRequired)) {
                throw _error(_errMessage(naming, TYPE_NAMES[method], value, isRequired));
            }
        };
    }
    if (checker !== undefined) {
        Object.defineProperty(TypeAudit, method, {configurable:true, enumerable:false, writable:true, value:checker});
    }
});
