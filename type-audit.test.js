import * as Utils from './test-utils';
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
    true: true,
    false: false,
    null: null,
    undef: undefined
};



describe('Module "TypeAudit"', () => {
    it('Содержит все нужные и не содержит посторонние методы', () => {
        const methods = Utils.getOwnMethods(TypeAudit);
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
        const properties = Utils.getOwnProperties(TypeAudit);
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
        const methods = Utils.getOwnMethods(TypeAudit.prop);
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
        const properties = Utils.getOwnProperties(TypeAudit.prop);
        expect(
            properties.length
        ).toBe(
            0
        );
    });

    it.each(Utils.expandTable({
        function:[
            {
                args:[
                    ['func', 'true'],
                    ['func', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        object:[
            {
                args:[
                    ['obj-1', 'true'],
                    ['obj-1', 'false'],
                    ['obj-2', 'true'],
                    ['obj-2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        array:[
            {
                args:[
                    ['arr-1', 'true'],
                    ['arr-1', 'false'],
                    ['arr-2', 'true'],
                    ['arr-2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        notEmptyArray:[
            {
                args:[
                    ['arr-2', 'true'],
                    ['arr-2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        string:[
            {
                args:[
                    ['str-1', 'true'],
                    ['str-1', 'false'],
                    ['str-2', 'true'],
                    ['str-2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        notEmptyString:[
            {
                args:[
                    ['str-2', 'true'],
                    ['str-2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        number:[
            {
                args:[
                    ['int-1', 'true'],
                    ['int-1', 'false'],
                    ['int-2', 'true'],
                    ['int-2', 'false'],
                    ['int-3', 'true'],
                    ['int-3', 'false'],
                    ['num-1', 'true'],
                    ['num-1', 'false'],
                    ['num-2', 'true'],
                    ['num-2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        positiveNumber:[
            {
                args:[
                    ['int-2', 'true'],
                    ['int-2', 'false'],
                    ['num-1', 'true'],
                    ['num-1', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        notNegativeNumber:[
            {
                args:[
                    ['int-1', 'true'],
                    ['int-1', 'false'],
                    ['int-2', 'true'],
                    ['int-2', 'false'],
                    ['num-1', 'true'],
                    ['num-1', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        integer:[
            {
                args:[
                    ['int-1', 'true'],
                    ['int-1', 'false'],
                    ['int-2', 'true'],
                    ['int-2', 'false'],
                    ['int-3', 'true'],
                    ['int-3', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        positiveInteger:[
            {
                args:[
                    ['int-2', 'true'],
                    ['int-2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        notNegativeInteger:[
            {
                args:[
                    ['int-1', 'true'],
                    ['int-1', 'false'],
                    ['int-2', 'true'],
                    ['int-2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        boolean:[
            {
                args:[
                    ['true', 'true'],
                    ['true', 'false'],
                    ['false', 'true'],
                    ['false', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ]
    }, SIMPLE_METHODS, VALUES, Utils.pick(VALUES, ['true', 'false'])))(
        'Метод "%s": (%O, %s)',
        (method, value, isRequired, result) => {
            const call = () => TypeAudit[method](value, 'value:test', isRequired);
            if (result instanceof Error) {
                const outcome = expect(call);
                outcome.toThrow(result.constructor);
                outcome.toThrow(new RegExp(`^Value "test" ${isRequired ? 'must be' : 'can be only'} .+: `));
            }
            else {
                expect(call()).toBe(result);
            }
        }
    );

    it.todo('Проверки типизированных методов');
});
