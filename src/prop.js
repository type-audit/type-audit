import Is from './is';
import * as Err from './err';



/**
 * @private
 * The list of all check names from the class Is
 * @type {Array<string>}
 */
const checkers = Object.getOwnPropertyNames(Is).filter((item) => typeof Is[item] === 'function');



const _getChecker = (method, isRequired, ...typeArgs) => (props, propName, componentName) => {
    const needTypeInfo = typeArgs.length !== 0;
    const checker = Is[method];
    const value = props[propName];
    if (needTypeInfo ? !checker(value, typeArgs[0], isRequired) : !checker(value, isRequired)) {
        return Err.setup(new TypeError(Err.makeMessage(
            `Prop "${propName}" in component "${componentName}"`,
            needTypeInfo ? {name:method, type:typeArgs[0]} : method,
            value,
            isRequired
        )), 1);
    }
};

/**
 * The set of checks of data types of properties react components
 * @public
 * @type {object}
 */
const Prop = checkers.reduce((result, method) => {
    const needTypeInfo = 2 < Is[method].length;
    const func = needTypeInfo ? (typeInfo) => _getChecker(method, false, typeInfo) : _getChecker(method, false);
    func.isRequired = needTypeInfo ? (typeInfo) => _getChecker(method, true, typeInfo) : _getChecker(method, true);
    result[method] = func;
    return result;
}, {});
Object.freeze(Prop);

export default Prop;
