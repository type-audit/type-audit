
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
 * @param {Array<object|Array>|object<object|Array>} list
 * @param {Array<number|string>} keys
 * @return {Array}
 */
const _select = (list, keys) => keys.map((item, key) => list[key][item]);

/**
 * @private
 * @param {Array} patterns
 * @param {Array} keys
 * @return {boolean}
 */
const _isRelevantKeys = (patterns, keys) => patterns.length === keys.length && patterns.every(
    (pattern, i) => pattern === null || pattern === keys[i]
);

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
                throw new TypeError(`Wrong property "args" in shortTable section for "${method}": ${args}`);
            }
            if (args.some((item) => _isRelevantKeys(item, keys))) {
                return result;
            }
        }
    }
    return defaultResult;
};



/**
 * @public
 * @param {object} shortTable
 * @param {object} arg1Values
 * @param {object} arg2Values
 * @param {object} arg3Values
 * @return {Array<Array>}
 */
export const expandTable = (shortTable, ...argValues) => {
    if (shortTable == null || typeof shortTable !== 'object' || Array.isArray(shortTable)) {
        throw new TypeError(`Wrong argument "shortTable": ${shortTable}`);
    }
    argValues.forEach((values, i) => {
        if (values == null || typeof values !== 'object' || Array.isArray(values)) {
            throw new TypeError(`Wrong argument "arg${i + 1}Values": ${values}`);
        }
    });
    const argKeys = argValues.map((values) => Object.keys(values));
    const argLengths = argKeys.map((values) => values.length);
    const argTotal = _multiplyAll(argLengths);
    return Object.keys(shortTable).reduce((table, method) => {
        const variants = shortTable[method];
        if (!Array.isArray(variants)) {
            throw new TypeError(`Wrong shortTable section for "${method}"`);
        }
        for (let i = 0; i < argTotal; i += 1) {
            const keys = _select(argKeys, _makeIndexes(argLengths, i));
            table.push([method, ..._select(argValues, keys), _getResult(variants, keys, method)]);
        }
        return table;
    }, []);
};
