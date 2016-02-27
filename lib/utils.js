import locater from 'locater';
import _ from 'lodash';

const lineBreak = '\n';

export default function getTargetInfo(target, condition) {
  if (condition.after) {
    if (condition.after.line) {
      let newLinePos = locater.find('\n', target, {getGlobalIndices: true});
      if (!newLinePos.length) {
        return;
      }
      let targetNewLinePos = _.find(newLinePos, {line: condition.after.line});
      let targetIndex = targetNewLinePos.globalIndex;

      return {
        index: targetIndex,
        line: targetNewLinePos.line
      };
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

      if (! targetIndex) {
        return;
      } else {
        return {
          index: targetIndex,
          line: targetMatchPos.line
        };
      }
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
        return {
          index: targetNewLinePos.globalIndex + 1,
          line: targetNewLinePos.line
        };
      } else {
        return {
          index: 0,
          line: 0
        };
      }
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

      return {
        index: targetIndex,
        line: targetMatchPos.line
      };
    }
  }
}
