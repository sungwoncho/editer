# editer

A high level multiline string manipulation library.


## What does it do

Using editer, you can:

* insert a string after a certain line in a multiline string

## Installation

    npm install --save editer


## Usage


### Example 1

Insert a string after a certain line number.

```js
var editer = require('editer');
var target = 'line 1\nline 3';

var result = editer.insert('line 2', target, {after: {line: 1}});
console.log(result);
// => 'line 1\nline 2\nline 3';
```

### Example 2

Insert a string as a new line after the last occurrence of regex.

```target.js
import create from './create';
import generate from './generate';

export {
  create
  generate
};
```

```js
var fs = require('fs');
var editer = require('editer');
var target = fs.readFileSync('./target');

var result = editer.insert("import modify from './modify'", target, {
  after: {
    regex: /import .*$/,
    last: true,
    newLine: true
  }
});
console.log(result);
// import create from './create';
// import generate from './generate';
// import modify from './modify';
//
// export {
//   create
//   generate
// };

```


## License

MIT
