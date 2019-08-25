import Is from './is';
import * as Err from './err';
import Prop from './prop';



/**
 * @private
 * The list of all check names from the class Is
 * @type {Array<string>}
 */
const checkers = Object.getOwnPropertyNames(Is).filter((item) => typeof Is[item] === 'function');



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
