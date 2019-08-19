import TypeAudit from './type-audit';
import Is from './is';



const SIMPLE_METHODS = [
    'function',
    'object',
    'array',
    'notEmptyArray',
    'string',
    'notEmptyString',
    'number',
    'positiveNumber',
    'notNegativeNumber',
    'integer',
    'positiveInteger',
    'notNegativeInteger',
    'boolean'
];

const TYPED_METHODS = [
    'arrayOf',
    'instanceOf'
];



/**
 * @param {object} obj
 * @return {Array<string>}
 */
const _getOwnMethods = (obj) => Object.getOwnPropertyNames(obj).filter((name) => typeof obj[name] === 'function');

/**
 * @param {object} obj
 * @return {Array<string>}
 */
const _getOwnProperties = (obj) => Object.getOwnPropertyNames(obj).filter((name) => typeof obj[name] !== 'function');



describe('Module "TypeAudit"', () => {
    it('Содержит все нужные и не содержит посторонние методы', () => {
        const methods = _getOwnMethods(TypeAudit);
        expect(
            methods.length
        ).toBe(
            SIMPLE_METHODS.length + TYPED_METHODS.length
        );
        expect(
            methods.every((name) => SIMPLE_METHODS.indexOf(name) !== -1 || TYPED_METHODS.indexOf(name) !== -1)
        ).toBeTruthy();
    });

    it('Содержит все нужные и не содержит посторонние свойства', () => {
        const PROPS = ['is', 'prop'];
        const properties = _getOwnProperties(TypeAudit);
        expect(
            properties.length
        ).toBe(
            PROPS.length
        );
        expect(
            properties.every((name) => PROPS.indexOf(name) !== -1)
        ).toBeTruthy();
    });

    it('Свойство "is" в норме', () => {
        expect(
            TypeAudit.is === Is
        ).toBeTruthy();
    });

    it('Свойство "prop" в наличии', () => {
        const {prop} = TypeAudit;
        expect(
            prop != null && typeof prop === 'object' && !Array.isArray(prop)
        ).toBeTruthy();
    });

    it('Свойство "prop" содержит все нужные и не содержит посторонние методы', () => {
        const methods = _getOwnMethods(TypeAudit.prop);
        expect(
            methods.length
        ).toBe(
            SIMPLE_METHODS.length + TYPED_METHODS.length
        );
        expect(
            methods.every((name) => SIMPLE_METHODS.indexOf(name) !== -1 || TYPED_METHODS.indexOf(name) !== -1)
        ).toBeTruthy();
    });

    it('Свойство "prop" содержит все нужные и не содержит посторонние свойства', () => {
        const properties = _getOwnProperties(TypeAudit.prop);
        expect(
            properties.length
        ).toBe(
            0
        );
    });

    it.todo('Проверки простых методов');

    it.todo('Проверки типизированных методов');
});
