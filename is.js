/**
 * Класс, содержащий статические методы проверки
 */
export default class Is {
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
