
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
