import locater from 'locater';
import getTargetInfo from './utils';
import _ from 'lodash';

const lineBreak = '\n';

function getNthLine(string, lineNumber) {
  let arr = string.split(lineBreak);
  return arr[lineNumber - 1];
}

function replaceNthLine(string, lineNumber, newString) {
  let arr = string.split(lineBreak);
  arr[lineNumber - 1] = newString;

  return arr.join('\n');
}

export default function remove(string, target, options) {

  function getModifiedTarget(targetInfo, condition) {
    let targetSubstring;

    if (condition.onSameLine) {
      targetSubstring = getNthLine(target, targetInfo.line);
    } else {
      if (condition.after) {
        targetSubstring = target.slice(targetInfo.index);
      } else if (condition.before) {
        targetSubstring = target.slice(0, targetInfo.index);
      }
    }

    let regex;

    if (condition.multi) {
      regex = new RegExp(_.escapeRegExp(string), 'g');
    } else {
      regex = new RegExp(_.escapeRegExp(string));
    }

    let newSubstring = targetSubstring.replace(regex, '');

    if (condition.onSameLine) {
      return replaceNthLine(target, targetInfo.line, newSubstring);
    } else {
      return target.replace(targetSubstring, newSubstring);
    }
  }

  if (options.or) {
    for (let i = 0; i < options.or.length; i++) {
      let targetInfo = getTargetInfo(target, options.or[i]);
      if (targetInfo) {
        return getModifiedTarget(targetInfo, options.or[i]);
      }
    }
  } else {
    let targetInfo = getTargetInfo(target, options);
    return getModifiedTarget(targetInfo, options);
  }
}
