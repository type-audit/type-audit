import * as Utils from './test-utils';
import pick from 'lodash.pick';
//import omit from 'lodash.omit';
import {expandTable} from './jest-more-expand-table';
import TypeAudit from '../src/type-audit';
import auditors from '../src/auditors';
import prop from '../src/prop';



const SIMPLE_METHODS = [
    'func',
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
    'bool'
];

const TYPED_METHODS = [
    'arrayOf',
    'instanceOf'
];

class TestClass1 {}
class TestClass2 {}

const TYPES = {
    func: 'function',
    arr: 'array',
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
    'obj-1': {},
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
    'arr-arr': [VALUES['arr-void']],
    'arr-obj': [VALUES['obj-1'], VALUES['obj-c1'], VALUES['obj-c2']],
    'arr-str': [VALUES['str-1'], VALUES['str-2']],
    'arr-num': [0, 123, -123, 0.123, -0.123],
    'arr-bool': [VALUES.true, VALUES.false],
    'arr-cls-1': [VALUES['obj-c1']],
    'arr-cls-2': [VALUES['obj-c2']],
    'arr-mixed': [VALUES['int-1'], VALUES['str-1'], VALUES['obj-1']],
    'arr-null': [VALUES.null],
    'arr-undef': [VALUES.undef]
};



describe('Module "TypeAudit"', () => {
    it('Contains all necessary and not contains any extra methods', () => {
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

    it('Contains all necessary and not contains any extra properties', () => {
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

    it('Property "is" is ok', () => {
        expect(
            TypeAudit.is === auditors
        ).toBeTruthy();
    });

    it('Property "prop" is ok', () => {
        expect(
            TypeAudit.prop === prop
        ).toBeTruthy();
    });

    it.each(expandTable({
        func:[
            {
                args:[
                    ['func', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined
            },
            {result:new TypeError()}
        ],
        object:[
            {
                args:[
                    ['obj-1', null],
                    ['obj-c1', null],
                    ['obj-c2', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined
            },
            {result:new TypeError()}
        ],
        array:[
            {
                args:[
                    ['arr-void', null],
                    ['arr-num', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined
            },
            {result:new TypeError()}
        ],
        notEmptyArray:[
            {
                args:[
                    ['arr-num', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined
            },
            {result:new TypeError()}
        ],
        string:[
            {
                args:[
                    ['str-1', null],
                    ['str-2', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined
            },
            {result:new TypeError()}
        ],
        notEmptyString:[
            {
                args:[
                    ['str-2', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined
            },
            {result:new TypeError()}
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
                result:undefined
            },
            {result:new TypeError()}
        ],
        positiveNumber:[
            {
                args:[
                    ['int-2', null],
                    ['num-1', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined
            },
            {result:new TypeError()}
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
                result:undefined
            },
            {result:new TypeError()}
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
                result:undefined
            },
            {result:new TypeError()}
        ],
        positiveInteger:[
            {
                args:[
                    ['int-2', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined
            },
            {result:new TypeError()}
        ],
        notNegativeInteger:[
            {
                args:[
                    ['int-1', null],
                    ['int-2', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined
            },
            {result:new TypeError()}
        ],
        bool:[
            {
                args:[
                    ['true', null],
                    ['false', null],
                    ['null', 'false'],
                    ['undef', 'false']
                ],
                result:undefined
            },
            {result:new TypeError()}
        ]
    }, VALUES, pick(VALUES, ['true', 'false'])))(
        'Method "%s" returns expected result: (%O, %s)',
        (method, value, isRequired, result) => {
            const call = () => TypeAudit[method](value, 'arg:test', isRequired);
            if (result instanceof Error) {
                const outcome = expect(call);
                outcome.toThrow(result.constructor);
                outcome.toThrow(new RegExp(`^Argument "test" ${isRequired ? 'must be' : 'can be only'} .+: `));
            }
            else {
                expect(call()).toBe(result);
            }
        }
    );

    it.each(expandTable({
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
                result:undefined
            },
            {result:new TypeError()}
        ]
    }, VALUES, pick(TYPES, ['cls-1', 'cls-2']), pick(VALUES, ['true', 'false'])))(
        'Method "%s" returns expected result: (%O, %O, %s)',
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

    /*it.each(expandTable({
        instanceOf:[
            {result:new TypeError()}
        ]
    }, pick(VALUES, ['str-1']), omit(VALUES, ['func']), pick(VALUES, ['true'])))(
        'Method "%s" throws error at wrong value class: (%O, %O, %s)',
        (method, value, Clazz, isRequired, result) => {
            const call = () => TypeAudit[method](value, Clazz, 'value:test', isRequired);
            if (result instanceof Error) {
                const outcome = expect(call);
                outcome.toThrow(result.constructor);
                outcome.toThrow(/^Wrong argument "valueClass": /);
            }
            else {
                expect(call()).toBe(result);
            }
        }
    );*/

    it.each(expandTable({
        arrayOf:[
            {
                args:[
                    ['arr-void', 'func', null],
                    ['arr-void', 'arr', null],
                    ['arr-void', 'obj', null],
                    ['arr-void', 'str', null],
                    ['arr-void', 'num', null],
                    ['arr-void', 'bool', null],
                    ['arr-void', 'cls-1', null],
                    ['arr-void', 'cls-2', null],
                    ['arr-func', 'func', null],
                    ['arr-arr', 'arr', null],
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
                result:undefined
            },
            {result:new TypeError()}
        ]
    }, {...VALUES, ...ARRAY_VALUES}, TYPES, pick(VALUES, ['true', 'false'])))(
        'Method "%s" returns expected result: (%O, %O, %s)',
        (method, value, type, isRequired, result) => {
            const call = () => TypeAudit[method](value, type, 'This inner variable', isRequired);
            if (result instanceof Error) {
                const outcome = expect(call);
                outcome.toThrow(result.constructor);
                outcome.toThrow(new RegExp(`^This inner variable ${isRequired ? 'must be' : 'can be only'} .+: `));
            }
            else {
                expect(call()).toBe(result);
            }
        }
    );

    /*it.each(expandTable({
        arrayOf:[
            {result:new TypeError()}
        ]
    }, pick(VALUES, ['str-1']), omit(VALUES, ['func', 'str-2']), pick(VALUES, ['true'])))(
        'Method "%s" throws error at wrong item type: (%O, %O, %s)',
        (method, value, type, isRequired, result) => {
            const call = () => TypeAudit[method](value, type, 'value:test', isRequired);
            if (result instanceof Error) {
                const outcome = expect(call);
                outcome.toThrow(result.constructor);
                outcome.toThrow(/^Wrong argument "itemType": /);
            }
            else {
                expect(call()).toBe(result);
            }
        }
    );*/
});
