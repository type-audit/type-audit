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
            members.every((name) => typeof Is[name] === 'function')
        ).toBeTruthy();
    });

    it('Не содержит посторонних методов', () => {
        const members = Object.getOwnPropertyNames(Is);
        expect(
            members.every((name) => SIMPLE_METHODS.indexOf(name) !== -1 || TYPED_METHODS.indexOf(name) !== -1)
        ).toBeTruthy();
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
                result:true},
            {result:false}
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
                result:true},
            {result:false}
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
                result:true},
            {result:false}
        ],
        notEmptyArray:[
            {
                args:[
                    ['arr-2', true],
                    ['arr-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:true},
            {result:false}
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
                result:true},
            {result:false}
        ],
        notEmptyString:[
            {
                args:[
                    ['str-2', true],
                    ['str-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:true},
            {result:false}
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
                result:true},
            {result:false}
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
                result:true},
            {result:false}
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
                result:true},
            {result:false}
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
                result:true},
            {result:false}
        ],
        positiveInteger:[
            {
                args:[
                    ['int-2', true],
                    ['int-2', false],
                    ['null', false],
                    ['undef', false]
                ],
                result:true},
            {result:false}
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
                result:true},
            {result:false}
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
                result:true},
            {result:false}
        ]
    }, SIMPLE_METHODS, VALUES))('Метод "%s": (%O, %s)', (method, value, isRequired, result) => {
        expect(Is[method](value, isRequired)).toBe(result);
    });
});
