import * as Err from '../src/err';
import omit from 'lodash.omit';



const VALUES = {
    func: () => {},
    'arr-void': [],
    'obj-1': {},
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

const ERRORS = {
    'src-1': {
        name: 'TypeError',
        message: 'Sample error message',
        fileName: 'http://some.host/path/1.js',
        lineNumber: 1,
        columnNumber: 11,
        stack: [
            'method3@http://some.host/path/3.js:3:33',
            'method5@http://some.host/path/5.js:5:55',
            'method7@http://some.host/path/7.js:7:77'
        ].join('\n')
    },
    'result-1': {
        name: 'TypeError',
        message: 'Sample error message',
        fileName: 'http://some.host/path/7.js',
        lineNumber: 7,
        columnNumber: 77,
        stack: 'method7@http://some.host/path/7.js:7:77'
    },
    'src-2': {
        name: 'TypeError',
        message: 'Sample error message',
        stack: [
            'TypeError: Sample error message',
            'at method3 (http://some.host/path/3.js:3:33)',
            'at method5 (http://some.host/path/5.js:5:55)',
            'at method7 (http://some.host/path/7.js:7:77)'
        ].join('\n')
    },
    'result-2': {
        name: 'TypeError',
        message: 'Sample error message',
        stack: [
            'TypeError: Sample error message',
            'at method7 (http://some.host/path/7.js:7:77)'
        ].join('\n')
    }
};

const NAMINGS = [
    'arg:someArg',
    'param:someParam',
    'Some name'
];



const outerJoin = (a, b) => {
    const result = [];
    for (let i = 0; i < a.length; i += 1) {
        for (let j = 0; j < b.length; j += 1) {
            result.push([a[i], b[j]]);
        }
    }
    return result;
};



describe('Module "Err"', () => {
    it.each(outerJoin([...NAMINGS, ...NAMINGS.map((item) => () => item)], [true, false]))(
        'Method "makeMessage" returns expected result (variant %#)',
        (naming, isRequired) => {
            expect(
                Err.makeMessage(naming, {name:'string', isRequired}, VALUES['str-2'])
            ).toMatch(
                new RegExp(`(?:Argument "someArg"|Param "someParam"|Some name) ${isRequired ? 'must be' : 'can be only'} a string: ${VALUES['str-2']}`)
            );
        }
    );

    it.each([
        ...Object.values(omit(VALUES, ['func', 'str-2'])).map((item) => [item])
    ])(
        'Method "makeMessage" throws error at wrong naming value (variant %#)',
        (naming) => {
            const outcome = expect(
                () => Err.makeMessage(naming, 'string', null)
            );
            outcome.toThrow(TypeError);
            outcome.toThrow(/^Wrong argument "naming": /);
        }
    );

    it.each([
        ...Object.values(omit(VALUES, ['func', 'str-2'])).map((item) => [() => item])
    ])(
        'Method "makeMessage" throws error at naming function returns a wrong result (variant %#)',
        (naming) => {
            const outcome = expect(
                () => Err.makeMessage(naming, 'string', null)
            );
            outcome.toThrow(TypeError);
            outcome.toThrow(/^Argument "naming" returns a wrong result: /);
        }
    );

    it.each([
        ...Object.values(omit(VALUES, ['str-2', 'obj-1', 'obj-c1', 'obj-c2'])).map((item) => [item]),
        ...Object.values(omit(VALUES, ['str-2'])).map((item) => [{name:item}]),
    ])(
        'Method "makeMessage" throws error at wrong info (variant %#)',
        (info) => {
            const outcome = expect(
                () => Err.makeMessage('Sample error name', info, null)
            );
            outcome.toThrow(TypeError);
            outcome.toThrow(/^Wrong argument "info": /);
        }
    );

    it.each([
        [VALUES['str-2']],
        [{name:VALUES['str-2']}]
    ])(
        'Method "makeMessage" throws error at info with unknown name (variant %#)',
        (info) => {
            const outcome = expect(
                () => Err.makeMessage('Sample error name', info, null)
            );
            outcome.toThrow(TypeError);
            outcome.toThrow(/^Argument "info" contains an unknown (?:name|value): /);
        }
    );

    it.each([
        ['instanceOf'],
        ['arrayOf'],
        [{name:'instanceOf'}],
        [{name:'arrayOf'}]
    ])(
        'Method "makeMessage" throws error at info without needed subtype (variant %#)',
        (info) => {
            const outcome = expect(
                () => Err.makeMessage('Sample error name', info, null)
            );
            outcome.toThrow(TypeError);
            outcome.toThrow(/^Argument "info" must contain a type specification: /);
        }
    );

    it.each([
        [ERRORS['src-1'], 2, ERRORS['result-1']],
        [ERRORS['src-2'], 2, ERRORS['result-2']]
    ])(
        'Method "setup" returns expected result (variant %#)',
        (error, deep, result) => {
            expect(
                Err.setup(error, deep)
            ).toStrictEqual(
                result
            );
        }
    );
});
