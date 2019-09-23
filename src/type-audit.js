import auditors from './auditors';
import * as Err from './err';
import prop from './prop';



/**
 * @public
 * @param {*} value Checked value
 * @param {function|string} naming Name on error (string or function that returns a string)
 * @param {function(*):boolean} auditor Checking function. The name of this function must be meaningful and understandable
 *                                      because it is used in the error message. Additional information provided in the
 *                                      "info" property is also used
 */
export const audit = (value, naming, auditor) => {
    if (!auditor(value)) {
        throw Err.setup(new TypeError(Err.makeMessage(naming, {name:auditor.name, ...auditor.info}, value)), 1);
    }
};



/**
 * Set of auditing methods
 * @public
 * @type {object}
 */
const TypeAudit = {
    /**
     * @public
     * @type {TypeAudit.is}
     */
    is: auditors,

    /**
     * @public
     * @type {TypeAudit.prop}
     */
    prop: prop
};
Object.getOwnPropertyNames(auditors).forEach((method) => {
    const getAuditor = auditors[method];
    if (typeof getAuditor === 'function') {
        TypeAudit[method] = 1 < getAuditor.length
            /**
             * @public
             * @param {*} value Checked value
             * @param {string|function} typeInfo Info about type or class of checked value
             * @param {function|string} naming Name on error (string or function that returns a string)
             * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
             */
            ? (value, typeInfo, naming, isRequired) => audit(value, naming, getAuditor(typeInfo, isRequired))
            /**
             * @public
             * @param {*} value Checked value
             * @param {function|string} naming Name on error (string or function that returns a string)
             * @param {boolean} [isRequired] Values null and undefined are not allowed (optional)
             */
            : (value, naming, isRequired) => audit(value, naming, getAuditor(isRequired));
    }
});
Object.freeze(TypeAudit);

export default TypeAudit;
