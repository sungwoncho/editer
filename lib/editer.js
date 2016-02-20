import locater from 'locater';
import _ from 'lodash';

const lineBreak = '\n';

export function insert(string, target, options) {

  function getModifier(nextChar) {
    let shouldAppendNewLine = nextChar !== lineBreak;

    if (options.asNewLine && shouldAppendNewLine) {
      return '\n' + string + '\n';
    } else if (options.asNewLine) {
      return '\n' + string;
    } else {
      return string;
    }
  }

  function getModifiedTarget(targetIndex) {
    return target.slice(0, targetIndex) +
           getModifier(target[targetIndex]) +
           target.slice(targetIndex);
  }

  let newLinePos = locater.find('\n', target, {getGlobalIndices: true});

  if (options.after) {
    if (options.after.line) {
      let targetNewLinePos = _.find(newLinePos, {line: options.after.line});
      let targetIndex = targetNewLinePos.globalIndex;

      return getModifiedTarget(targetIndex);
    }
  }

  if (options.before) {
    if (options.before.line) {
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
