import {expandTable} from './jest-more-expand-table';
import omit from 'lodash.omit';



const VALUES = {
    func: () => {},
    'arr-void': [],
    'obj-1': {},
    'obj-2': {abc:'xyz'},
    //'obj-c1': new (class TestClass1 {})(),
    //'obj-c2': new (class TestClass2 {})(),
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

const TABLE = {
    method: []
};



describe('Module "JestMore/expandTable"', () => {
    it.each(
        Object.values(omit(VALUES, ['obj-1', 'obj-2'])).map((item) => [item]),
    )(
        'Method "expandTable" throws error at wrong "shortTable" argument (variant %#)',
        (shortTable) => {
            const outcome = expect(
                () => expandTable(shortTable, null, null)
            );
            outcome.toThrow(TypeError);
            outcome.toThrow(/^Wrong argument "shortTable": /);
        }
    );

    it.each(
        Object.values(omit(VALUES, ['obj-1', 'obj-2'])).map((item) => [item]),
    )(
        'Method "expandTable" throws error at wrong "arg1Values" argument (variant %#)',
        (arg1Values) => {
            const outcome = expect(
                () => expandTable(VALUES['obj-1'], arg1Values, null, null)
            );
            outcome.toThrow(TypeError);
            outcome.toThrow(/^Wrong argument "arg1Values": /);
        }
    );

    it.each(
        Object.values(omit(VALUES, ['obj-1', 'obj-2'])).map((item) => [item]),
    )(
        'Method "expandTable" throws error at wrong "arg2Values" argument (variant %#)',
        (arg2Values) => {
            const outcome = expect(
                () => expandTable(VALUES['obj-1'], VALUES['obj-2'], arg2Values, null)
            );
            outcome.toThrow(TypeError);
            outcome.toThrow(/^Wrong argument "arg2Values": /);
        }
    );

    it.each(
        Object.values(omit(VALUES, ['obj-1', 'obj-2'])).map((item) => [item]),
    )(
        'Method "expandTable" throws error at wrong "arg3Values" argument (variant %#)',
        (arg3Values) => {
            const outcome = expect(
                () => expandTable(VALUES['obj-1'], VALUES['obj-2'], VALUES['obj-2'], arg3Values)
            );
            outcome.toThrow(TypeError);
            outcome.toThrow(/^Wrong argument "arg3Values": /);
        }
    );

    it.each(
        Object.values(omit(VALUES, ['arr-void'])).map((item) => [{someMethod:item}]),
    )(
        'Method "expandTable" throws error at wrong table section (variant %#)',
        (shortTable) => {
            const outcome = expect(
                () => expandTable(shortTable, VALUES['obj-2'], VALUES['obj-2'], VALUES['obj-2'])
            );
            outcome.toThrow(TypeError);
            outcome.toThrow(/^Wrong shortTable section for "someMethod"/);
        }
    );

    it.each(
        Object.values(omit(VALUES, ['arr-void', 'undef'])).map((item) => [{otherMethod:[{args:item}]}]),
    )(
        'Method "expandTable" throws error at wrong property "args" in table section (variant %#)',
        (shortTable) => {
            const outcome = expect(
                () => expandTable(shortTable, VALUES['obj-2'], VALUES['obj-2'], VALUES['obj-2'])
            );
            outcome.toThrow(TypeError);
            outcome.toThrow(/^Wrong property "args" in shortTable section for "otherMethod": /);
        }
    );

    it('Method "expandTable" returns empty table without argNValues',
        () => {
            expect(
                expandTable({aMeyhod:[{result:true}]})
            ).toStrictEqual(
                []
            );
        }
    );
});
