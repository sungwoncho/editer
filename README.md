# editer

A high level multiline string manipulation library.


## What does it do

Using editer, you can:

* insert a string before/after a certain line in a multiline string optionally
as a new line
* insert a string before/after nth match of a regex in a multiline string
optionally as a new line

## Installation

    npm install --save editer


## Usage

Here are some examples of what editer can do.

### Example 1

Insert a new line after a certain line number.

```js
var editer = require('editer');
var target = 'line 1\nline 3';

var result = editer.insert('line 2', target, {after: {line: 1}, asNewLine: true});
console.log(result);
// => 'line 1\nline 2\nline 3';
```

### Example 2

Insert a string after the second occurrence of regex.

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
    occurrence: 2,
  },
  asNewLine: true
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
