import Is from './is';
import * as Err from './err';



/**
 * Список всех имён проверок из класса Is
 * @type {Array<string>}
 */
const checkers = Object.getOwnPropertyNames(Is).filter((item) => typeof Is[item] === 'function');



const _propGetChecker = (method, typeInfo, isRequired) => (props, propName, componentName) => {
    const needTypeInfo = 2 < Is[method].length;
    const checker = Is[method];
    const value = props[propName];
    if (needTypeInfo ? !checker(value, typeInfo, isRequired) : !checker(value, isRequired)) {
        return Err.setup(new TypeError(Err.makeMessage(
            `Prop "${propName}" in component "${componentName}"`,
            needTypeInfo ? {name:method, type:typeInfo} : method, value, isRequired
        )), 1);
    }
};

/**
 * Набор проверок типов данных свойств react-компонентов
 */
const Prop = checkers.reduce((result, method) => {
    const needTypeInfo = 2 < Is[method].length;
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
    const needTypeInfo = 2 < Is[method].length;
    TypeAudit[method] = needTypeInfo
        /**
         * @public
         * @param {*} value Проверяемое значение
         * @param {string|function} typeInfo Инормация о типе/классе проверяемого значения
         * @param {function|string} naming Наименование при ошибке (строка или функция, возвращающая строку)
         * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
         */
        ? (value, typeInfo, naming, isRequired) => {
            if (!Is[method](value, typeInfo, isRequired)) {
                throw Err.setup(new TypeError(Err.makeMessage(naming, {name:method, type:typeInfo}, value, isRequired)), 1);
            }
        }
        /**
         * @public
         * @param {*} value Проверяемое значение
         * @param {function|string} naming Наименование при ошибке (строка или функция, возвращающая строку)
         * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
         */
        : (value, naming, isRequired) => {
            if (!Is[method](value, isRequired)) {
                throw Err.setup(new TypeError(Err.makeMessage(naming, method, value, isRequired)), 1);
            }
        };
});
Object.freeze(TypeAudit);

export default TypeAudit;
