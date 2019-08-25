import Is from './is';
import * as Err from './err';



/**
 * @private
 * The list of all check names from the class Is
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
 * The set of checks of data types of properties react components
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
 * Exported object
 * @public
 * @type {object}
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
         * @param {*} value Checked value
         * @param {string|function} typeInfo Info about type or class of checked value
         * @param {function|string} naming Name on error (string or function that returns a string)
         * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
         */
        ? (value, typeInfo, naming, isRequired) => {
            if (!Is[method](value, typeInfo, isRequired)) {
                throw Err.setup(new TypeError(Err.makeMessage(
                    naming, {name:method, type:typeInfo}, value, isRequired
                )), 1);
            }
        }
        /**
         * @public
         * @param {*} value Checked value
         * @param {function|string} naming Name on error (string or function that returns a string)
         * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
         */
        : (value, naming, isRequired) => {
            if (!Is[method](value, isRequired)) {
                throw Err.setup(new TypeError(Err.makeMessage(naming, method, value, isRequired)), 1);
            }
        };
});
Object.freeze(TypeAudit);

export default TypeAudit;
