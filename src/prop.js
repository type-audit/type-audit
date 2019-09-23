import auditors from './auditors';
import * as Err from './err';



/**
 * @private
 * @param {function(*):boolean} auditor Checking function
 * @return {function(props:object, propName:string, componentName:string):Error}
 */
const getChecker = (auditor) => (props, propName, componentName) => {
    const value = props[propName];
    if (!auditor(value)) {
        return Err.setup(new TypeError(Err.makeMessage(
            `Prop "${propName}" in component "${componentName}"`,
            {name:auditor.name, ...auditor.info},
            value
        )), 1);
    }
};

/**
 * The set of checks of data types of properties react components
 * @public
 * @type {object}
 */
const prop = {};
Object.getOwnPropertyNames(auditors).forEach((method) => {
    const getAuditor = auditors[method];
    if (typeof getAuditor === 'function') {
        const needTypeInfo = 1 < getAuditor.length;
        const func = needTypeInfo
            ? (typeInfo) => getChecker(getAuditor(typeInfo, false))
            : getChecker(getAuditor(false));
        func.isRequired = needTypeInfo
            ? (typeInfo) => getChecker(getAuditor(typeInfo, true))
            : getChecker(getAuditor(true));
        prop[method] = func;
    }
});
Object.freeze(prop);

export default prop;
