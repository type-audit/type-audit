import * as Utils from './test-utils';
import Is from '../src/is';



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

class TestClass1 {}
class TestClass2 {}

const TYPES = {
    func: 'function',
    obj: 'object',
    str: 'string',
    num: 'number',
    bool: 'boolean',
    'cls-1': TestClass1,
    'cls-2': TestClass2
};

const VALUES = {
    func: () => {},
    'arr-void': [],
    'arr-num': [0, 123, -123, 0.123, -0.123],
    'obj-1': {},
    'obj-2': {prop:'123'},
    'obj-c1': new TestClass1(),
    'obj-c2': new TestClass2(),
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

const ARRAY_VALUES = {
    // 'arr-void' contains in VALUES
    'arr-func': [VALUES.func],
    'arr-obj': [VALUES['obj-1'], VALUES['obj-2'], VALUES['obj-c1'], VALUES['obj-c2']],
    'arr-str': [VALUES['str-1'], VALUES['str-2']],
    // 'arr-num' contains in VALUES
    'arr-bool': [VALUES.true, VALUES.false],
    'arr-cls-1': [VALUES['obj-c1']],
    'arr-cls-2': [VALUES['obj-c2']],
    'arr-mixed': [VALUES['int-1'], VALUES['str-1'], VALUES['obj-1']],
    'arr-null': [VALUES.null],
    'arr-undef': [VALUES.undef]
};



describe('Module "Is"', () => {
    it('Содержит все нужные и не содержит посторонние методы', () => {
        const methods = Utils.getOwnMethods(Is);
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
        const properties = Utils.getOwnProperties(Is);
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
                    ['func', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        object:[
            {
                args:[
                    ['obj-1', null],
                    ['obj-2', null],
                    ['obj-c1', null],
                    ['obj-c2', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        array:[
            {
                args:[
                    ['arr-void', null],
                    ['arr-num', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        notEmptyArray:[
            {
                args:[
                    ['arr-num', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        string:[
            {
                args:[
                    ['str-1', null],
                    ['str-2', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        notEmptyString:[
            {
                args:[
                    ['str-2', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        number:[
            {
                args:[
                    ['int-1', null],
                    ['int-2', null],
                    ['int-3', null],
                    ['num-1', null],
                    ['num-2', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        positiveNumber:[
            {
                args:[
                    ['int-2', null],
                    ['num-1', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        notNegativeNumber:[
            {
                args:[
                    ['int-1', null],
                    ['int-2', null],
                    ['num-1', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        integer:[
            {
                args:[
                    ['int-1', null],
                    ['int-2', null],
                    ['int-3', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        positiveInteger:[
            {
                args:[
                    ['int-2', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        notNegativeInteger:[
            {
                args:[
                    ['int-1', null],
                    ['int-2', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ],
        boolean:[
            {
                args:[
                    ['true', null],
                    ['false', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
        ]
    }, SIMPLE_METHODS, VALUES, Utils.pick(VALUES, ['true', 'false'])))(
        'Метод "%s": (%O, %s)',
        (method, value, isRequired, result) => {
            expect(Is[method](value, isRequired)).toBe(result);
        }
    );

    it.each(Utils.expandTable({
        instanceOf:[
            {
                args:[
                    ['obj-c1', 'cls-1', null],
                    ['obj-c2', 'cls-2', null],
                    ['null', 'cls-1', 'false'],
                    ['null', 'cls-2', 'false'],
                    ['undef', 'cls-1', 'false'],
                    ['undef', 'cls-2', 'false']
                ],
                result:true},
            {result:false}
        ]
    }, TYPED_METHODS, VALUES, {'cls-1':TestClass1, 'cls-2':TestClass2}, Utils.pick(VALUES, ['true', 'false'])))(
        'Метод "%s": (%O, %O, %s)',
        (method, value, Clazz, isRequired, result) => {
            expect(Is[method](value, Clazz, isRequired)).toBe(result);
        }
    );

    it.each(Utils.expandTable({
        arrayOf:[
            {
                args:[
                    ['arr-void', 'func', null],
                    ['arr-void', 'obj', null],
                    ['arr-void', 'str', null],
                    ['arr-void', 'num', null],
                    ['arr-void', 'bool', null],
                    ['arr-void', 'cls-1', null],
                    ['arr-void', 'cls-2', null],
                    ['arr-func', 'func', null],
                    ['arr-obj', 'obj', null],
                    ['arr-cls-1', 'obj', null],
                    ['arr-cls-2', 'obj', null],
                    ['arr-str', 'str', null],
                    ['arr-num', 'num', null],
                    ['arr-bool', 'bool', null],
                    ['arr-cls-1', 'cls-1', null],
                    ['arr-cls-2', 'cls-2', null],
                    ['null', null, 'false'],
                    ['undef', null, 'false']
                ],
                result:true},
            {result:false}
        ]
    }, TYPED_METHODS, {...VALUES, ...ARRAY_VALUES}, TYPES, Utils.pick(VALUES, ['true', 'false'])))(
        'Метод "%s": (%O, %O, %s)',
        (method, value, type, isRequired, result) => {
            expect(Is[method](value, type, isRequired)).toBe(result);
        }
    );
});
