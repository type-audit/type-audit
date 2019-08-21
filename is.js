/**
 * Набор методов проверки
 */
const Is = {
    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    function(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'function');
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    object(value, isRequired) {
        return value == null ? !isRequired : (typeof value === 'object' && !Array.isArray(value));
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {function} valueClass Класс проверяемого значения
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    instanceOf(value, valueClass, isRequired) {
        if (typeof valueClass !== 'function') {
            throw new TypeError(`Wrong argument "valueClass": ${valueClass}`);
        }
        return (!isRequired && value == null) || (value instanceof valueClass);
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    array(value, isRequired) {
        return (!isRequired && value == null) || Array.isArray(value);
    },

    /**
     * @public

     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    notEmptyArray(value, isRequired) {
        return (!isRequired && value == null) || (Array.isArray(value) && value.length !== 0);
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {string|function} itemType Тип/класс элемента проверяемого значения
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    arrayOf(value, itemType, isRequired) {
        const argType = typeof itemType;
        const isClass = argType === 'function';
        if (!isClass && !(argType === 'string' && itemType.length !== 0)) {
            throw new TypeError(`Wrong argument "itemType": ${itemType}`);
        }
        return (!isRequired && value == null) || (Array.isArray(value) && value.every(isClass
            ? (item) => item instanceof itemType
            : (itemType === 'object'
                ? (item) => item !== null && typeof item === itemType
                : (item) => typeof item === itemType))
        );
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    string(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'string');
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    notEmptyString(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'string' && value.length !== 0);
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    number(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number');
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    positiveNumber(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number' && 0 < value);
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    notNegativeNumber(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number' && 0 <= value);
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    integer(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'number' && Math.round(value) === value);
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    positiveInteger(value, isRequired) {
        return (!isRequired && value == null)
            || (typeof value === 'number' && 0 < value && Math.round(value) === value);
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    notNegativeInteger(value, isRequired) {
        return (!isRequired && value == null)
            || (typeof value === 'number' && 0 <= value && Math.round(value) === value);
    },

    /**
     * @public
     * @param {*} value Проверяемое значение
     * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
     * @return {boolean}
     */
    boolean(value, isRequired) {
        return (!isRequired && value == null) || (typeof value === 'boolean');
    }
};
Object.freeze(Is);

export default Is;
