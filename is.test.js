import * as Utils from './test-utils';
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

const VALUES = {
    func: () => {},
    'arr-1': [],
    'arr-2': [123],
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
                    ['func', 'true'],
                    ['func', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
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
                result:true},
            {result:false}
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
                result:true},
            {result:false}
        ],
        notEmptyArray:[
            {
                args:[
                    ['arr-2', 'true'],
                    ['arr-2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
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
                result:true},
            {result:false}
        ],
        notEmptyString:[
            {
                args:[
                    ['str-2', 'true'],
                    ['str-2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
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
                result:true},
            {result:false}
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
                result:true},
            {result:false}
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
                result:true},
            {result:false}
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
                result:true},
            {result:false}
        ],
        positiveInteger:[
            {
                args:[
                    ['int-2', 'true'],
                    ['int-2', 'false'],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:true},
            {result:false}
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
                result:true},
            {result:false}
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
                    ['obj-c1', 'cls-1', 'true'],
                    ['obj-c1', 'cls-1', 'false'],
                    ['obj-c2', 'cls-2', 'true'],
                    ['obj-c2', 'cls-2', 'false'],
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

    it.todo('Проверки типизированных методов');
});
