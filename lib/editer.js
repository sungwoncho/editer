import locater from 'locater';
import _ from 'lodash';

const lineBreak = '\n';

export function insert(string, target, options) {

  /**
   * Get the final string to insert into the target, optionally inserting a
   * line break before and after depending on whether it should be a new line,
   * and whether there are already line breaks before and after the string
   *
   * @param nextChar {String} - character that will come after the string after
   *        it is inserted to the target
   * @param prevChar {String} - character that will come before the string
   *         after it is inserted to the target
   * @return {String} - a modifier that will be inserted to the target
   */
  function getModifier(nextChar, prevChar) {
    if (! options.asNewLine) {
      return string;
    }

    if (nextChar !== lineBreak) {
      string = string + '\n';
    }
    if (prevChar !== lineBreak) {
      string = '\n' + string;
    }

    return string;
  }

  /**
   * Insert the modifier to the target at the desired position, and returns the
   * resulting, modified target
   *
   * @param targetIndex {Number} - index in the target string at which the
   *        modifier is to be inserted
   * @return {String} - a modified target
   */
  function getModifiedTarget(targetIndex) {
    return target.slice(0, targetIndex) +
           getModifier(target[targetIndex], target[targetIndex - 1]) +
           target.slice(targetIndex);
  }

  if (options.after) {
    if (options.after.line) {
      let newLinePos = locater.find('\n', target, {getGlobalIndices: true});
      let targetNewLinePos = _.find(newLinePos, {line: options.after.line});
      let targetIndex = targetNewLinePos.globalIndex;

      return getModifiedTarget(targetIndex);
    }

    if (options.after.regex) {
      let matches = locater.find(options.after.regex, target, {
        getGlobalIndices: true,
        getMatches: true
      });
      let targetMatchPos, targetIndex;

      if (options.after.occurrence) {
        targetMatchPos = matches[options.after.occurrence - 1];
      } else if (options.after.last) {
        targetMatchPos = matches[matches.length - 1];
      } else {
        targetMatchPos = matches[0];
      }

      if (targetMatchPos.match.slice(-1) === lineBreak) {
        targetIndex = targetMatchPos.globalIndex + targetMatchPos.match.length - 1;
      } else {
        targetIndex = targetMatchPos.globalIndex + targetMatchPos.match.length;
      }

      return getModifiedTarget(targetIndex);
    }
  }

  if (options.before) {
    if (options.before.line) {
      let newLinePos = locater.find('\n', target, {getGlobalIndices: true});
      let targetNewLinePos = _.find(newLinePos, {line: options.before.line - 1});
      let targetIndex;

      if (targetNewLinePos) {
        targetIndex = targetNewLinePos.globalIndex + 1;
      } else {
        targetIndex = 0;
      }

      return getModifiedTarget(targetIndex);
    }

    if (options.before.regex) {
      let matches = locater.find(options.before.regex, target, {
        getGlobalIndices: true,
        getMatches: true
      });
      let targetMatchPos, targetIndex;

      if (options.before.occurrence) {
        targetMatchPos = matches[options.before.occurrence - 1];
      } else if (options.before.last) {
        targetMatchPos = matches[matches.length - 1];
      } else {
        targetMatchPos = matches[0];
      }

      targetIndex = targetMatchPos.globalIndex;

      return getModifiedTarget(targetIndex);
    }
  }
}
