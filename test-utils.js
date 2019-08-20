
/**
 * @public
 * @param {object} obj
 * @return {Array<string>}
 */
export const getOwnMethods = (obj) => Object.getOwnPropertyNames(obj).filter((name) => typeof obj[name] === 'function');

/**
 * @public
 * @param {object} obj
 * @return {Array<string>}
 */
export const getOwnProperties = (obj) => Object.getOwnPropertyNames(obj).filter(
    (name) => typeof obj[name] !== 'function'
);

/**
 * @public
 * @param {object} obj
 * @param {Array<string>} props
 * @return {object}
 */
export const pick = (obj, props) => props.reduce(
    (result, prop) => {
        const value = obj[prop];
        if (value !== undefined) {
            result[prop] = value;
        }
        return result;
    },
    {}
);



/**
 * @private
 * @param {Array<number>} numbers
 * @return {number}
 */
const _multiplyAll = (numbers) => {
    if (numbers.length === 0) {
        return 0;
    }
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i += 1) {
        result *= numbers[i];
    }
    return result;
};

/**
 * @private
 * @param {Array<number>} lengths
 * @param {number} index
 * @return {Array<number>}
 */
const _makeIndexes = (lengths, index) => {
    const indexes = [];
    for (let j = lengths.length - 1, value = index; 0 <= j; j -= 1) {
        const length = lengths[j];
        const k = value % length;
        indexes[j] = k;
        value = (value - k) / length;
    }
    return indexes;
};

/**
 * @private
 * @param {Array<object|Array>} list
 * @param {Array<number|string>} keys
 * @return {Array}
 */
const _select = (list, keys) => keys.map((item, key) => list[key][item]);

/**
 * @private
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {boolean}
 */
const _isEqualArrays = (arr1, arr2) => arr1.length === arr2.length && arr1.every((item, i) => item === arr2[i]);

/**
 * @private
 * @param {Array<object>} variants
 * @param {Array<string>} keys
 * @param {string} method
 * @return {*}
 */
const _getResult = (variants, keys, method) => {
    let defaultResult;
    for (let i = 0; i < variants.length; i += 1) {
        const {args, result} = variants[i];
        if (args === undefined) {
            defaultResult = result;
        }
        else {
            if (!Array.isArray(args)) {
                throw new Error(`Wrong property "args" in shortTable section for "${method}": ${args}`);
            }
            if (args.some((item) => _isEqualArrays(keys, item))) {
                return result;
            }
        }
    }
    return defaultResult;
};



/**
 * @public
 * @param {object} shortTable
 * @param {Array<string>} methods
 * @param {object} arg1Values
 * @param {object} arg2Values
 * @param {object} arg3Values
 * @return {Array<Array>}
 */
export const expandTable = (shortTable, methods, ...argValues) => {
    if (shortTable == null || typeof shortTable !== 'object') {
        throw new Error(`Wrong argument "shortTable:" ${shortTable}`);
    }
    if (!Array.isArray(methods) || !methods.every((item) => typeof item === 'string')) {
        throw new Error(`Wrong argument "methods:" ${methods}`);
    }
    argValues.forEach((values, i) => {
        if (values == null || typeof values !== 'object') {
            throw new Error(`Wrong argument "arg${i + 1}Values:" ${values}`);
        }
    });
    const argKeys = argValues.map((values) => Object.keys(values));
    const argLengths = argKeys.map((values) => values.length);
    const argTotal = _multiplyAll(argLengths);
    return Object.keys(shortTable).reduce((table, method) => {
        if (!methods.includes(method)) {
            throw new Error(`Wrong shortTable method "${method}"`);
        }
        const variants = shortTable[method];
        if (!Array.isArray(variants)) {
            throw new Error(`Wrong shortTable section for "${method}"`);
        }
        for (let i = 0; i < argTotal; i += 1) {
            const keys = _select(argKeys, _makeIndexes(argLengths, i));
            table.push([method, ..._select(argValues, keys), _getResult(variants, keys, method)]);
        }
        return table;
    }, []);
};
