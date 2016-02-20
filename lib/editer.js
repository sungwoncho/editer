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

  function _run(conditions) {
    if (conditions.after) {
      if (conditions.after.line) {
        let newLinePos = locater.find('\n', target, {getGlobalIndices: true});
        if (!newLinePos.length) {
          return;
        }
        let targetNewLinePos = _.find(newLinePos, {line: conditions.after.line});
        let targetIndex = targetNewLinePos.globalIndex;

        return getModifiedTarget(targetIndex);
      }

      if (conditions.after.regex) {
        let matches = locater.find(conditions.after.regex, target, {
          getGlobalIndices: true,
          getMatches: true
        });
        if (!matches.length) {
          return;
        }
        let targetMatchPos, targetIndex;

        if (conditions.after.occurrence) {
          targetMatchPos = matches[conditions.after.occurrence - 1];
        } else if (conditions.after.last) {
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

    if (conditions.before) {
      if (conditions.before.line) {
        let newLinePos = locater.find('\n', target, {getGlobalIndices: true});
        if (!newLinePos.length) {
          return;
        }
        let targetNewLinePos = _.find(newLinePos, {line: conditions.before.line - 1});
        let targetIndex;

        if (targetNewLinePos) {
          targetIndex = targetNewLinePos.globalIndex + 1;
        } else {
          targetIndex = 0;
        }

        return getModifiedTarget(targetIndex);
      }

      if (conditions.before.regex) {
        let matches = locater.find(conditions.before.regex, target, {
          getGlobalIndices: true,
          getMatches: true
        });
        if (!matches.length) {
          return;
        }
        let targetMatchPos, targetIndex;

        if (conditions.before.occurrence) {
          targetMatchPos = matches[conditions.before.occurrence - 1];
        } else if (conditions.before.last) {
          targetMatchPos = matches[matches.length - 1];
        } else {
          targetMatchPos = matches[0];
        }

        targetIndex = targetMatchPos.globalIndex;

        return getModifiedTarget(targetIndex);
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
