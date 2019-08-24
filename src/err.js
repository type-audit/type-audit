
/**
 * @param {function|string} naming Наименование при ошибке (строка или функция, возвращающая строку)
 * @param {function|string} type Тип проверяемого значения
 * @param {*} value Проверяемое значение
 * @param {boolean} [isRequired] Значение null или undefined не допускается (опционально)
 * @return {string}
 */
export const makeMessage = (naming, type, value, isRequired) => {
    let name;
    if (typeof naming === 'function') {
        name = naming();
    }
    else
    if (typeof naming === 'string' && naming.length !== 0) {
        const i = naming.indexOf(':');
        if (0 < i && i < naming.length - 1) {
            // Если двоеточие есть, и это не первый и не последний символ, то:
            const key = naming.substring(0, i);
            name = key === 'arg'
                ? `Argument "${naming.substring(i + 1)}"`
                : `${key.charAt(0).toUpperCase()}${key.substring(1)} "${naming.substring(i + 1)}"`;
        }
        else {
            name = naming;
        }
    }
    else {
        throw new TypeError(`Wrong argument "naming": ${naming}`);
    }
    return `${name} ${isRequired ? 'must be' : 'can be only'} ${typeof type === 'function' ? type() : type}: ${value}`;
};

/**
 * @param {string} message Текст сообщения об ошибке
 * @return {Error}
 */
export const create = (message) => {
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
