import getTargetInfo from './utils';

const lineBreak = '\n';

export default function insert(string, target, options) {

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

  if (options.or) {
    for (let i = 0; i < options.or.length; i++) {
      let targetInfo = getTargetInfo(target, options.or[i]);
      if (targetInfo) {
        return getModifiedTarget(targetInfo.index, options.or[i]);
      }
    }
  } else {
    let targetInfo = getTargetInfo(target, options);
    return getModifiedTarget(targetInfo.index, options);
  }
}
