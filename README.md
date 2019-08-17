TypeAudit allows you to check the types of variables, arguments and other values where necessary.

## Installation

To install the stable version:

```
npm install --save type-audit
```

This assumes you are using [npm](https://www.npmjs.com/) as your package manager.

## Usage

Checking arguments:

```js
import TypeAudit from 'type-audit';

...
function someFunction(id, data) {
    TypeAudit.notEmptyString(id, 'arg:id', true);
    TypeAudit.object(data, 'arg:data');
    ...
}
...
someFunction('abc', {prop:'123'}); // It's Ok
someFunction('abc', null); // It's Ok
someFunction('abc'); // It's Ok
someFunction(''); // Throws TypeError: 'Argument "id" must be not empty string'
someFunction(); // Throws TypeError: 'Argument "id" must be not empty string: undefined'
someFunction(123); // Throws TypeError: 'Argument "id" must be not empty string: 123'
someFunction('abc', '123'); // Throws TypeError: 'Argument "data" can be only an object: 123'
```

Checking various values:

```js
import TypeAudit from 'type-audit';

...
function someFunction(data) {
    ...
    TypeAudit.positiveInteger(data.level, 'threshold:level');
    TypeAudit.notNegativeNumber(data.num, 'value:num', true);
    ...
}
...
someFunction({level:17, num:0}); // It's Ok
someFunction({level:null, num:1}); // It's Ok
someFunction({num:3}); // It's Ok
someFunction({level:0, num:7}); // Throws TypeError: 'Threshold "level" can be only positive integer: 0'
someFunction({num:'abc'}); // Throws TypeError: 'Value "num" must be not negative number: abc'
```

Checking values in react components:

```js
import TypeAudit from 'type-audit';

...
class MyComponent extends React.Component {
    static propTypes = {
        ...
        someProp: TypeAudit.prop.integer.isRequired;
        ...
    }
    ...
}
```

Checking values in conditions:

```js
import TypeAudit from 'type-audit';

...
   if (TypeAudit.is.notEmptyArray(value, true) && TypeAudit.is.arrayOf(value, SomeClass, true)) {
       // value is ok
   }
   else {
       // bad value
   }
...
```
