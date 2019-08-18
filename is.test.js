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

const VALUES = {
};



describe('Module "Is"', () => {
    it('Содержит нужное количество членов', () => {
        const members = Object.getOwnPropertyNames(Is);
        expect(
            members.length
        ).toBe(
            SIMPLE_METHODS.length + TYPED_METHODS.length
        );
    });

    it('Все члены являются методами', () => {
        const members = Object.getOwnPropertyNames(Is);
        expect(
            members.every(name => typeof Is[name] === 'function')
        ).toBeTruthy();
    });

    it('Не содержит посторонних методов', () => {
        const members = Object.getOwnPropertyNames(Is);
        expect(
            members.every(name => SIMPLE_METHODS.indexOf(name) !== -1 || TYPED_METHODS.indexOf(name) !== -1)
        ).toBeTruthy();
    });

    it.each([
        ['function', () => {}, true, true],
        ['function', () => {}, false, true],
        ['function', [], true, false],
        ['function', [], false, false],
        ['function', [123], true, false],
        ['function', [123], false, false],
        ['function', {}, true, false],
        ['function', {}, false, false],
        ['function', {prop:'123'}, true, false],
        ['function', {prop:'123'}, false, false],
        ['function', 'abc', true, false],
        ['function', 'abc', false, false],
        ['function', '', true, false],
        ['function', '', false, false],
        ['function', 123, true, false],
        ['function', 123, false, false],
        ['function', 0.123, true, false],
        ['function', 0.123, false, false],
        ['function', -123, true, false],
        ['function', -123, false, false],
        ['function', true, true, false],
        ['function', true, false, false],
        ['function', false, true, false],
        ['function', false, false, false],
        ['function', null, true, false],
        ['function', null, false, true],
        ['function', undefined, true, false],
        ['function', undefined, false, true]
    ])
    ('Метод "%s": (%O, %s)', (method, value, isRequired, result) => {
        expect(Is[method](value, isRequired)).toBe(result);
    });

});
