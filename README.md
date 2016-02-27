# editer

[![Build Status](https://travis-ci.org/sungwoncho/editer.svg?branch=master)](https://travis-ci.org/sungwoncho/editer)

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

## API

### insert(string, target, options)

Inserts `string` to `target` at the position specified by `options` and returns
the modified `target`. If `options` fails to find the desired position, returns
`undefined`.

**string**

* type: `String`
* a string to be inserted at the target

**target**

* type: `String`
* a string to be modified by inserting `string`

**options**

* type: `Object`
* an object specifying the position at which the `string` is to be inserted to
`target` and how it should be inserted (e.g. as a new line or a regular line).

At top level, it can have the following keys:

* `before`
* `after`
* `or`
* `asNewLine`

#### before, after

An object with either `before` or `after` is a 'condition'. A condition cannot
have both `before` and `after`. They take as value an object with following
possible key-value pairs.

**line**

* type: `Number`
* the line number in the target

**regex**

* type: `RegExp`
* the regex to be matched in the target. You may optionally provide `occurrence`
if providing this option. See below. All regex should have **global** flag, as
Editer uses [lcoater](https://github.com/sungwoncho/locater) internally.

**occurrence**

* type: `Number`
* the order of occurrence after which `target` is to be modified. If not
provided, `target` is modified at the first occurrence of the `regex`.

**last**

* type: `Boolean`
* if set to true, modify the `target` at last occurrence of the regex.

*Example*

```js
var target = "I love you\nHoney Bunny.";
var options = {before: {regex: /[a-zA-z]{5}/g, occurrence: 2}};
var result = editer.insert("Nooby ", target, options);
console.log(result);
// => "I love you\nHoney Nooby Bunny."

var target = "Whoa, whoa, whoa, whoa... stop right there.";
var options = {before: {regex: /whoa/ig, last: true}};
var result = editer.insert("my god, ", target, options);
console.log(result);
// => "Whoa, whoa, whoa, my god, whoa... stop right there."
```

#### or

`or` is an array of conditions. Editer attempts to use the conditions
sequentially from the first to the last. If a condition matches, Editer ignores
the rest of the conditions.

*Example*

```js
var target = "Whoa, whoa, whoa, whoa... stop right there.";
var options = {or: [
  {before: {regex: /unicorn/ig, last: true}},
  {after: {regex: /whoa,\s/ig, occurrence: 3}},
  {after: {regex: /stop/i}}
]};
var result = editer.insert("hey, ", target, options);
console.log(result);
// => "Whoa, whoa, whoa, hey, whoa... stop right there."
```

#### asNewLine

* type: `Boolean`
* default: `false`
* insert the `string` as a new line to the `target`.

*Example*

```js
var target = "It's Zed's.\nWho's Zed?";
var options = {before: {regex: /Zed.*\n/g}, asNewLine: true};
var result = editer.insert("...", target, options);
console.log(result);
// => "It's \n...\nZed's.\nWho's Zed?"
```

### remove(string, target, options)

Removes `string` from the `target` at the position specified by `options`.

**string**

* type: `String`
* a string to be removed from the target

**target**

* type: `String`
* a string to be modified by removing `string`

**options**

* type: `Object`
* an object specifying the position at which the `string` is to be removed from
`target`.

At top level, it can have the following keys:

* `before`
* `after`
* `or`
* `multi`
* `onSameLine`

All `before`, `after`, and `or` options are similar to those of `insert` API.
The only difference is that here they support only regex, not line number.

#### multi

* type: `Boolean`
* default: `false`
* Remove all occurrences of the `string` in the section of the `target` scoped
by the condition, and other options such as `onSameLine`.

#### onSameLine

* type: `Boolean`
* default: `false`
* Scope the removal to the same line as the match of the regex in the target.


## License

MIT
