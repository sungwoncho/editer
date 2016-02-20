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

  describe("after.regex", function() {
    it("inserts a string to target after the first match of regex ending with newline", function() {
      var target = "It's Zed's.\nWho's Zed?";
      var result = editer.insert(' Baby.', target, {after: {regex: /Zed.*\n/g}});

      expect(result).to.equal("It's Zed's. Baby.\nWho's Zed?");
    });

    it("inserts a string to target after the first match of regex", function() {
      var target = "It's Zed's.\nWho's Zed?";
      var result = editer.insert("oo", target, {after: {regex: /Zed/g}});

      expect(result).to.equal("It's Zedoo's.\nWho's Zed?");
    });
  });

  describe("after.regex after.occurrence", function() {
    it("inserts a string to target after the nth match", function() {
      var target = "It's Zed's.\nWho's Zed?";
      var options = {after: {regex: /Zed/g, occurrence: 2}};
      var result = editer.insert("oo", target, options);

      expect(result).to.equal("It's Zed's.\nWho's Zedoo?");
    });
  });

  describe("after.regex after.last", function() {
    it("inserts a string to target after the last match", function() {
      var target = "Whoa, whoa, whoa, whoa... stop right there.";
      var options = {after: {regex: /whoa/ig, last: true}};
      var result = editer.insert(", aww", target, options);

      expect(result).to.equal("Whoa, whoa, whoa, whoa, aww... stop right there.");
    });
  });

  describe("after.regex asNewLine", function() {
    it("inserts a string to target after the first match of regex as a new line", function() {
      var target = "I love you\nHoney Bunny.";
      var result = editer.insert('Nooby ', target, {after: {regex: /[a-zA-z]{5}\s/g}, asNewLine: true});

      expect(result).to.equal("I love you\nHoney \nNooby \nBunny.");
    });
  });

  describe("after.regex after.occurrence asNewLine", function() {
    it("inserts a string to target after the nth occurrence of regex as a new line", function() {
      var target = "I love you\nHoney Bunny Babby.";
      var options = {after: {regex: /[a-zA-z]{5}/g, occurrence: 2}, asNewLine: true};
      var result = editer.insert('Nooby', target, options);

      expect(result).to.equal("I love you\nHoney Bunny\nNooby\n Babby.");
    });
  });

  describe("before.regex", function() {
    it("inserts a string to target before the first match of regex", function() {
      var target = "It's Zed's.\nWho's Zed?";
      var result = editer.insert("... ", target, {before: {regex: /Zed.*\n/g}});

      expect(result).to.equal("It's ... Zed's.\nWho's Zed?");
    });
  });

  describe("before.regex asNewLine", function() {
    it("inserts a string to target before the first match of regex as a new line", function() {
      var target = "It's Zed's.\nWho's Zed?";
      var options = {before: {regex: /Zed.*\n/g}, asNewLine: true};
      var result = editer.insert("...", target, options);

      expect(result).to.equal("It's \n...\nZed's.\nWho's Zed?");
    });
  });

  describe("before.regex before.occurrence", function() {
    it("inserts a string to target before the nth match of regex", function() {
      var target = "I love you\nHoney Bunny.";
      var options = {before: {regex: /[a-zA-z]{5}/g, occurrence: 2}};
      var result = editer.insert("Nooby ", target, options);

      expect(result).to.equal("I love you\nHoney Nooby Bunny.");
    });
  });

  describe("before.regex before.occurrence asNewLine", function() {
    it("inserts a string to target before the nth match of regex as a new line", function() {
      var target = "I love you\nHoney Bunny.";
      var options = {before: {regex: /[a-zA-z]{5}/g, occurrence: 2}, asNewLine: true};
      var result = editer.insert("Nooby", target, options);

      expect(result).to.equal("I love you\nHoney \nNooby\nBunny.");
    });
  });

  describe("before.regex before.last", function() {
    it("inserts a string to target before the last match of regex", function() {
      var target = "Whoa, whoa, whoa, whoa... stop right there.";
      var options = {before: {regex: /whoa/ig, last: true}};
      var result = editer.insert("my god, ", target, options);

      expect(result).to.equal("Whoa, whoa, whoa, my god, whoa... stop right there.");
    });
  });

  describe("or", function() {
    it("performs the second operation if the first one's condition does not yield match", function() {
      var target = "Whoa, whoa, whoa, whoa... stop right there.";
      var options = {or: [
        {before: {regex: /unicorn/ig, last: true}},
        {after: {regex: /whoa,\s/ig, occurrence: 3}},
        {after: {regex: /stop/i}}
      ]};
      var result = editer.insert("hey, ", target, options);

      expect(result).to.equal("Whoa, whoa, whoa, hey, whoa... stop right there.");
    });
  });
});
