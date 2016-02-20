import locater from 'locater';
import _ from 'lodash';

const lineBreak = '\n';

export function insert(string, target, options) {

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
  }
}
