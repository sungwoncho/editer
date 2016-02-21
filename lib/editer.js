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
  function getModifier(nextChar, prevChar, condition) {
    if (! condition.asNewLine) {
      return string;
    }

    if (nextChar && nextChar !== lineBreak) {
      string = string + '\n';
    }
    if (prevChar && prevChar !== lineBreak) {
      string = '\n' + string;
    }
    if (condition._appendToModifier) {
      string = string + condition._appendToModifier;
    }
    if (condition._prependToModifier) {
      string = condition._prependToModifier + string;
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
  function getModifiedTarget(targetIndex, condition) {
    return target.slice(0, targetIndex) +
           getModifier(target[targetIndex], target[targetIndex - 1], condition) +
           target.slice(targetIndex);
  }

  function _run(condition) {
    if (condition.after) {
      if (condition.after.line) {
        let newLinePos = locater.find('\n', target, {getGlobalIndices: true});
        if (!newLinePos.length) {
          return;
        }
        let targetNewLinePos = _.find(newLinePos, {line: condition.after.line});
        let targetIndex = targetNewLinePos.globalIndex;

        return getModifiedTarget(targetIndex, condition);
      }

      if (condition.after.regex) {
        let matches = locater.find(condition.after.regex, target, {
          getGlobalIndices: true,
          getMatches: true
        });
        if (!matches.length) {
          return;
        }
        let targetMatchPos, targetIndex;

        if (condition.after.occurrence) {
          targetMatchPos = matches[condition.after.occurrence - 1];
        } else if (condition.after.last) {
          targetMatchPos = matches[matches.length - 1];
        } else {
          targetMatchPos = matches[0];
        }

        if (targetMatchPos.match.slice(-1) === lineBreak) {
          targetIndex = targetMatchPos.globalIndex + targetMatchPos.match.length - 1;
        } else {
          targetIndex = targetMatchPos.globalIndex + targetMatchPos.match.length;
        }

        return getModifiedTarget(targetIndex, condition);
      }
    }

    if (condition.before) {
      if (condition.before.line) {
        let newLinePos = locater.find('\n', target, {getGlobalIndices: true});
        if (!newLinePos.length) {
          return;
        }
        let targetNewLinePos = _.find(newLinePos, {line: condition.before.line - 1});
        let targetIndex;

        if (targetNewLinePos) {
          targetIndex = targetNewLinePos.globalIndex + 1;
        } else {
          targetIndex = 0;
        }

        return getModifiedTarget(targetIndex, condition);
      }

      if (condition.before.regex) {
        let matches = locater.find(condition.before.regex, target, {
          getGlobalIndices: true,
          getMatches: true
        });
        if (!matches.length) {
          return;
        }
        let targetMatchPos, targetIndex;

        if (condition.before.occurrence) {
          targetMatchPos = matches[condition.before.occurrence - 1];
        } else if (condition.before.last) {
          targetMatchPos = matches[matches.length - 1];
        } else {
          targetMatchPos = matches[0];
        }

        targetIndex = targetMatchPos.globalIndex;

        return getModifiedTarget(targetIndex, condition);
      }
    }
  }

  if (options.or) {
    for (var i = 0; i < options.or.length; i++) {
      var result = _run(options.or[i]);
      if (result) {
        return result;
      }
    }
  } else {
    return _run(options);
  }
}
