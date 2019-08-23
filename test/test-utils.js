
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
