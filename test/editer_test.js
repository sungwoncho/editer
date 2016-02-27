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

    it("inserts a string to target after the last line as a new line", function() {
      var target = 'line 1\nline 2';
      var result = editer.insert('line 3', target, {after: {line: 2}, asNewLine: true});

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

    it("inserts a string to target before the first line as a new line", function() {
      var target = 'line 1\nline 2\nline 3';
      var result = editer.insert('line 0', target, {before: {line: 1}, asNewLine: true});

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

    it("can pass asNewLine option within a condition in 'or'", function() {
      var target = "Whoa, whoa, whoa, whoa... stop right there.";
      var options = {or: [
        {before: {regex: /unicorn/ig, last: true}},
        {after: {regex: /whoa\.\.\.\s/ig}, asNewLine: true},
      ]};
      var result = editer.insert("hey.", target, options);

      expect(result).to.equal("Whoa, whoa, whoa, whoa... \nhey.\nstop right there.");
    });
  });
});

describe(".remove", function() {
  describe("after.regex", function() {
    it("removes a string in the target after the regex", function() {
      var target = 'I love you\n Honey Bunny, , , \nNooby.';
      var result = editer.remove(',', target, {after: {regex: /Bunny/g}, multi: false});

      expect(result).to.equal('I love you\n Honey Bunny , , \nNooby.');
    });
  });

  describe("after.regex multi", function() {
    it("removes all occurrences of the string in the target after the regex", function() {
      var target = 'Hey Charlie you asleep?\n Charlie are you asleep?';
      var result = editer.remove(' asleep', target, {after: {regex: /Hey/g}, multi: true});

      expect(result).to.equal('Hey Charlie you?\n Charlie are you?');
    });
  });

  describe("after.regex onSameline", function() {
    it("does not remove the string if outside the line where the regex matches", function() {
      var target = 'I love you\n Honey Bunny\n Bobby Nooby';
      var result = editer.remove('Bobby', target, {after: {regex: /Honey/g}, onSameLine: true});

      expect(result).to.equal('I love you\n Honey Bunny\n Bobby Nooby');
    });

    it("removes a string in the target before the regex match if on the same line", function() {
      var target = 'I love you\n Honey Bunny Bobby Nooby';
      var result = editer.remove('Bobby ', target, {after: {regex: /Honey/g}, onSameLine: true, multi: false});

      expect(result).to.equal('I love you\n Honey Bunny Nooby');
    });
  });

  describe("after.regex onSameLine multi", function() {
    it("removes all occurrences of the string in the target after the regex on the same line", function() {
      var target = 'Hey Charlie you asleep hey hey?\n Charlie are you asleep?';
      var result = editer.remove(' hey', target, {after: {regex: /Hey/g}, onSameLine: true, multi: true});

      expect(result).to.equal('Hey Charlie you asleep?\n Charlie are you asleep?');
    });
  });

  describe("before.regex", function() {
    it("removes a string in the target before the regex", function() {
      var target = 'I love you\n Honey, Bunny';
      var result = editer.remove(',', target, {before: {regex: /Bunny/g}, onSameLine: false, multi: false});

      expect(result).to.equal('I love you\n Honey Bunny');
    });
  });

  describe("before.regex", function() {
    it("does not do anything if there is no match", function() {
      var target = 'I love you\n Honey, Bunny';
      var result = editer.remove('unicorn', target, {before: {regex: /Bunny/g}, onSameLine: false, multi: false});

      expect(result).to.equal('I love you\n Honey, Bunny');
    });
  });

  describe("before.regex multi", function() {
    it("removes all occurrences of the string in the target before the regex", function() {
      var target = 'Hey Charlie you asleep asleep?\nYo Charlie are you asleep?';
      var result = editer.remove(' asleep', target, {before: {regex: /Yo/g}, onSameLine: false, multi: true});

      expect(result).to.equal('Hey Charlie you?\nYo Charlie are you asleep?');
    });
  });

  describe("before.regex onSameLine", function() {
    it("does not remove a string in the target before the regex match if not on the same line", function() {
      var target = 'I love you\n Honey, Bunny';
      var result = editer.remove('you', target, {before: {regex: /Bunny/g}, onSameLine: true, multi: false});

      expect(result).to.equal('I love you\n Honey, Bunny');
    });

    it("removes a string in the target before the regex match if on the same line", function() {
      var target = 'I love\nyou Honey, Bunny';
      var result = editer.remove('you', target, {before: {regex: /Bunny/g}, onSameLine: true, multi: false});

      expect(result).to.equal('I love\n Honey, Bunny');
    });
  });


  describe("before.regex onSameLine multi", function() {
    it("removes all occurrences of the string in the target before the regex on the smae line", function() {
      var target = 'Hey Charlie you asleep asleep? Hey, Charlie.\nHey, Hey, Yo, Charlie are you asleep?';
      var result = editer.remove('Hey, ', target, {before: {regex: /Yo/g}, onSameLine: true, multi: true});

      expect(result).to.equal('Hey Charlie you asleep asleep? Hey, Charlie.\nYo, Charlie are you asleep?');
    });
  });
});
