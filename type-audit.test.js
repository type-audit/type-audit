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

const VALUES = {
    func: () => {},
    'arr-1': [],
    'arr-2': [123],
    'obj-1': {},
    'obj-2': {prop:'123'},
    'str-1': '',
    'str-2': 'abc',
    'int-1': 0,
    'int-2': 123,
    'int-3': -123,
    'num-1': 0.123,
    'num-2': -0.123,
    'bool-1': true,
    'bool-2': false,
    null: null,
    undef: undefined
};



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



/**
 * @param {object} shortTable
 * @param {Array<string>} methods
 * @param {object} values
 * @return {Array<Array>}
 */
const _expandTableSimple = (shortTable, methods, values) => {
    if (shortTable == null || typeof shortTable !== 'object') {
        throw new Error(`Wrong argument "shortTable:" ${shortTable}`);
    }
    if (!Array.isArray(methods) || !methods.every((item) => typeof item === 'string')) {
        throw new Error(`Wrong argument "methods:" ${methods}`);
    }
    if (values == null || typeof values !== 'object') {
        throw new Error(`Wrong argument "values:" ${values}`);
    }
    return methods.reduce((table, method) => {
        const variants = shortTable[method];
        if (variants !== undefined) {
            if (!Array.isArray(variants)) {
                throw new Error(`Wrong shortTable section for "${method}"`);
            }
            Object.keys(values).forEach((name) => {
                const value = values[name];
                [true, false].forEach((isRequired) => {
                    let result;
                    let defaultResult;
                    let done = false;
                    for (let i = 0; i < variants.length; i += 1) {
                        const variant = variants[i];
                        const {args} = variant;
                        if (args !== undefined) {
                            if (!Array.isArray(args)) {
                                throw new Error(`Wrong property "args" in shortTable section for "${method}": ${args}`);
                            }
                            if (args.some((arg) => arg[0] === name && arg[1] === isRequired)) {
                                result = variant.result;
                                done = true;
                                break;
                            }
                        }
                        else {
                            defaultResult = variant.result;
                        }
                    }
                    table.push([method, value, isRequired, done ? result : defaultResult]);
                });
            });
        }
        return table;
    }, []);
};



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

    it.each(_expandTableSimple({
        function:[
            {
                args:[
                    ['func', true],
                    ['func', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        object:[
            {
                args:[
                    ['obj-1', true],
                    ['obj-1', false],
                    ['obj-2', true],
                    ['obj-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        array:[
            {
                args:[
                    ['arr-1', true],
                    ['arr-1', false],
                    ['arr-2', true],
                    ['arr-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        notEmptyArray:[
            {
                args:[
                    ['arr-2', true],
                    ['arr-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        string:[
            {
                args:[
                    ['str-1', true],
                    ['str-1', false],
                    ['str-2', true],
                    ['str-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        notEmptyString:[
            {
                args:[
                    ['str-2', true],
                    ['str-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        number:[
            {
                args:[
                    ['int-1', true],
                    ['int-1', false],
                    ['int-2', true],
                    ['int-2', false],
                    ['int-3', true],
                    ['int-3', false],
                    ['num-1', true],
                    ['num-1', false],
                    ['num-2', true],
                    ['num-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        positiveNumber:[
            {
                args:[
                    ['int-2', true],
                    ['int-2', false],
                    ['num-1', true],
                    ['num-1', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        notNegativeNumber:[
            {
                args:[
                    ['int-1', true],
                    ['int-1', false],
                    ['int-2', true],
                    ['int-2', false],
                    ['num-1', true],
                    ['num-1', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        integer:[
            {
                args:[
                    ['int-1', true],
                    ['int-1', false],
                    ['int-2', true],
                    ['int-2', false],
                    ['int-3', true],
                    ['int-3', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        positiveInteger:[
            {
                args:[
                    ['int-2', true],
                    ['int-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        notNegativeInteger:[
            {
                args:[
                    ['int-1', true],
                    ['int-1', false],
                    ['int-2', true],
                    ['int-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        boolean:[
            {
                args:[
                    ['bool-1', true],
                    ['bool-1', false],
                    ['bool-2', true],
                    ['bool-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:undefined},
            {result:new TypeError()}
        ]
    }, SIMPLE_METHODS, VALUES))('Метод "%s": (%O, %s)', (method, value, isRequired, result) => {
        const call = () => TypeAudit[method](value, 'value:test', isRequired);
        if (result instanceof Error) {
            const outcome = expect(call);
            outcome.toThrow(result.constructor);
            // TODO: Если TYPE_NAMES будут перенесены в is.js, то нужно использовать здесь для замены ".+"
            outcome.toThrow(new RegExp(`^Value "test" ${isRequired ? 'must be' : 'can be only'} .+: `));
        }
        else {
            expect(call()).toBe(result);
        }
    });

    it.todo('Проверки типизированных методов');
});
