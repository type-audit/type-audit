import Is from './is';



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
