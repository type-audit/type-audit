import * as Err from '../src/err';



const VALUE_SRC_1 = {
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
};

const VALUE_DST_1 = {
    name: 'TypeError',
    message: 'Sample error message',
    fileName: 'http://some.host/path/7.js',
    lineNumber: 7,
    columnNumber: 77,
    stack: 'method7@http://some.host/path/7.js:7:77'
};

const VALUE_SRC_2 = {
    name: 'TypeError',
    message: 'Sample error message',
    stack: [
        'TypeError: Sample error message',
        'at method3 (http://some.host/path/3.js:3:33)',
        'at method5 (http://some.host/path/5.js:5:55)',
        'at method7 (http://some.host/path/7.js:7:77)'
    ].join('\n')
};

const VALUE_DST_2 = {
    name: 'TypeError',
    message: 'Sample error message',
    stack: [
        'TypeError: Sample error message',
        'at method7 (http://some.host/path/7.js:7:77)'
    ].join('\n')
};



describe('Module "Err"', () => {
    it('Method "setup" returns expected result (1)', () => {
        expect(
            Err.setup(VALUE_SRC_1, 2)
        ).toStrictEqual(
            VALUE_DST_1
        );
    });

    it('Method "setup" returns expected result (2)', () => {
        expect(
            Err.setup(VALUE_SRC_2, 2)
        ).toStrictEqual(
            VALUE_DST_2
        );
    });
});
