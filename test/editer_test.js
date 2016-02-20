var fs = require('fs');
var expect = require('chai').expect;
var editer = require('../dist/editer');

describe(".insert", function() {
  describe("after.line", function() {
    it("inserts a string to target after the line", function() {
      var target = 'line 1\nline 3';
      var result = editer.insert(' extended', target, {after: {line: 1}});

      expect(result).to.equal('line 1 extended\nline 3');
    });
  });

  describe("after.line, asNewLine", function() {
    it("inserts a string to target after the line as a new line", function() {
      var target = 'line 1\nline 3';
      var result = editer.insert('line 2', target, {after: {line: 1}, asNewLine: true});

      expect(result).to.equal('line 1\nline 2\nline 3');
    });
  });

  describe("before.line", function() {
    it("inserts a string to target before the line", function() {
      var target = 'line 1\nline 2\nline 3';
      var result = editer.insert('this is ', target, {before: {line: 2}});

      expect(result).to.equal('line 1\nthis is line 2\nline 3');
    });

    it("can insert a string to the target before the line if the first line", function() {
      var target = 'line 1\nline 2\nline 3';
      var result = editer.insert('this is ', target, {before: {line: 1}});

      expect(result).to.equal('this is line 1\nline 2\nline 3');
    });
  });

  describe("before.line asNewLine", function() {
    it("inserts a string to target before the line as a new line", function() {
      var target = 'line 0\nline 2\nline 3';
      var result = editer.insert('line 1', target, {before: {line: 2}, asNewLine: true});

      expect(result).to.equal('line 0\nline 1\nline 2\nline 3');
    });
  });
});
