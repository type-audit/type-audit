import Is from './is';
import * as Err from './err';



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
const checkers = Object.getOwnPropertyNames(Is).filter((item) => typeof Is[item] === 'function');

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



const _propGetChecker = (method, typeInfo, isRequired) => (props, propName, componentName) => {
    const needTypeInfo = 0 < argLevels[method];
    const checker = Is[method];
    const value = props[propName];
    if (needTypeInfo ? !checker(value, typeInfo, isRequired) : !checker(value, isRequired)) {
        const type = TYPE_NAMES[method];
        return Err.setup(new TypeError(Err.makeMessage(
            `Prop "${propName}" in component "${componentName}"`,
            needTypeInfo ? type(typeInfo) : type, value, isRequired
        )), 1);
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
Object.freeze(Prop);



/**
 * Экспортируемый объект
 */
const TypeAudit = {
    /**
     * @public
     * @type {TypeAudit.is}
     */
    is: Is,

    /**
     * @public
     * @type {TypeAudit.prop}
     */
    prop: Prop
};

checkers.forEach((method) => {
    const needTypeInfo = 0 < argLevels[method];
    let checker;
    if (needTypeInfo) {
        /**
         * @public
         * @param {*} value Проверяемое значение
         * @param {string|function} typeInfo Инормация о типе/классе проверяемого значения
         * @param {function|string} naming Наименование при ошибке (строка или функция, возвращающая строку)
         * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
         */
        checker = (value, typeInfo, naming, isRequired) => {
            if (!Is[method](value, typeInfo, isRequired)) {
                throw Err.setup(new TypeError(Err.makeMessage(
                    naming, TYPE_NAMES[method](typeInfo), value, isRequired
                )), 1);
            }
        };
    }
    else {
        /**
         * @public
         * @param {*} value Проверяемое значение
         * @param {function|string} naming Наименование при ошибке (строка или функция, возвращающая строку)
         * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
         */
        checker = (value, naming, isRequired) => {
            if (!Is[method](value, isRequired)) {
                throw Err.setup(new TypeError(Err.makeMessage(naming, TYPE_NAMES[method], value, isRequired)), 1);
            }
        };
    }
    if (checker !== undefined) {
        TypeAudit[method] = checker;
    }
});
Object.freeze(TypeAudit);

export default TypeAudit;
