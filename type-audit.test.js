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
                    ['obj-c1', 'true'],
                    ['obj-c1', 'false'],
                    ['obj-c2', 'true'],
                    ['obj-c2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        array:[
            {
                args:[
                    ['arr-void', 'true'],
                    ['arr-void', 'false'],
                    ['arr-num', 'true'],
                    ['arr-num', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ],
        notEmptyArray:[
            {
                args:[
                    ['arr-num', 'true'],
                    ['arr-num', 'false'],
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

    it.each(Utils.expandTable({
        instanceOf:[
            {
                args:[
                    ['obj-c1', 'cls-1', 'true'],
                    ['obj-c1', 'cls-1', 'false'],
                    ['obj-c2', 'cls-2', 'true'],
                    ['obj-c2', 'cls-2', 'false'],
                    ['null', 'cls-1', 'false'],
                    ['null', 'cls-2', 'false'],
                    ['undef', 'cls-1', 'false'],
                    ['undef', 'cls-2', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ]
    }, TYPED_METHODS, VALUES, {'cls-1':TestClass1, 'cls-2':TestClass2}, Utils.pick(VALUES, ['true', 'false'])))(
        'Метод "%s": (%O, %O, %s)',
        (method, value, Clazz, isRequired, result) => {
            const call = () => TypeAudit[method](value, Clazz, 'value:test', isRequired);
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

    it.each(Utils.expandTable({
        arrayOf:[
            {
                args:[
                    ['arr-void', 'func', 'true'],
                    ['arr-void', 'func', 'false'],
                    ['arr-void', 'arr', 'true'],
                    ['arr-void', 'arr', 'false'],
                    ['arr-void', 'obj', 'true'],
                    ['arr-void', 'obj', 'false'],
                    ['arr-void', 'str', 'true'],
                    ['arr-void', 'str', 'false'],
                    ['arr-void', 'num', 'true'],
                    ['arr-void', 'num', 'false'],
                    ['arr-void', 'bool', 'true'],
                    ['arr-void', 'bool', 'false'],
                    ['arr-void', 'cls-1', 'true'],
                    ['arr-void', 'cls-1', 'false'],
                    ['arr-void', 'cls-2', 'true'],
                    ['arr-void', 'cls-2', 'false'],
                    ['arr-func', 'func', 'true'],
                    ['arr-func', 'func', 'false'],
                    ['arr-obj', 'obj', 'true'],
                    ['arr-obj', 'obj', 'false'],
                    ['arr-cls-1', 'obj', 'true'],
                    ['arr-cls-1', 'obj', 'false'],
                    ['arr-cls-2', 'obj', 'true'],
                    ['arr-cls-2', 'obj', 'false'],
                    ['arr-str', 'str', 'true'],
                    ['arr-str', 'str', 'false'],
                    ['arr-num', 'num', 'true'],
                    ['arr-num', 'num', 'false'],
                    ['arr-bool', 'bool', 'true'],
                    ['arr-bool', 'bool', 'false'],
                    ['arr-cls-1', 'cls-1', 'true'],
                    ['arr-cls-1', 'cls-1', 'false'],
                    ['arr-cls-2', 'cls-2', 'true'],
                    ['arr-cls-2', 'cls-2', 'false'],
                    ['null', 'func', 'false'],
                    ['null', 'arr', 'false'],
                    ['null', 'obj', 'false'],
                    ['null', 'str', 'false'],
                    ['null', 'num', 'false'],
                    ['null', 'bool', 'false'],
                    ['null', 'cls-1', 'false'],
                    ['null', 'cls-2', 'false'],
                    ['undef', 'func', 'false'],
                    ['undef', 'arr', 'false'],
                    ['undef', 'obj', 'false'],
                    ['undef', 'str', 'false'],
                    ['undef', 'num', 'false'],
                    ['undef', 'bool', 'false'],
                    ['undef', 'cls-1', 'false'],
                    ['undef', 'cls-2', 'false']
                ],
                result:undefined},
            {result:new TypeError()}
        ]
    }, TYPED_METHODS, {...VALUES, ...ARRAY_VALUES}, TYPES, Utils.pick(VALUES, ['true', 'false'])))(
        'Метод "%s": (%O, %O, %s)',
        (method, value, type, isRequired, result) => {
            const call = () => TypeAudit[method](value, type, 'value:test', isRequired);
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
});
