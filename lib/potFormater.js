'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
/**
 * Ensure that multi-line strings are properly commented out
 *
 * For instance:
 * This is\nmy multi-line\ncomment
 *
 * should be escaped as :
 * #. This is
 * #. my multi-line
 * #. comment
 *
 * @param {String} commentPrefix
 * @param {String} rawComment
 * @returns {String}
 *
 * @author Guillaume Boddaert
 */
var potCommentMultiLineWrapper = function potCommentMultiLineWrapper(
  commentPrefix,
  rawComment,
) {
  var comments = rawComment.split('\n');
  return comments.reduce(function(a, b) {
    return '' + a + commentPrefix + ' ' + b + '\n';
  }, '');
};

/**
 * Formatting POT comments
 * @param {Object[]} messageList
 * @return {String}
 *
 * example: see tests
 *
 * @author Michael Hsu
 * @author Guillaume Boddaert
 */
var potCommentsFormater = function potCommentsFormater(messageList) {
  return messageList.reduce(function(acc, _ref) {
    var filename = _ref.filename,
      description = _ref.description;

    var out = acc;
    out += potCommentMultiLineWrapper('#:', filename);
    if (description) {
      out += potCommentMultiLineWrapper('#.', description);
    }

    return out;
  }, '');
};

/**
 * Formatting POT contexts
 * @param {String} messageContext
 * @return {String}
 *
 * @author Sandy Suh
 */
var potContextsFormater = function potContextsFormater(messageContext) {
  return messageContext
    ? 'msgctxt ' + JSON.stringify(messageContext) + '\n'
    : '';
};

/**
 * Formatting POT comments
 * @param {Object[]} messageList
 * @return {String}
 */
var potStringFormater = function potStringFormater(messageList) {
  return 'msgstr ' + JSON.stringify(messageList);
};

/**
 * Formatting POT comments
 * @param {Object} messageObject
 * @return {String}
 *
 * example: see tests
 *
 * @author Michael Hsu
 */

var potFormater = function potFormater(messageObject) {
  return Object.keys(messageObject) // return array of id
    .sort()
    .map(function(id) {
      return Object.keys(messageObject[id])
        .map(function(context) {
          return (
            '' +
            potCommentsFormater(messageObject[id][context]) +
            potContextsFormater(context) +
            'msgid ' +
            JSON.stringify(id) +
            '\n' +
            potStringFormater(messageObject[id][context][0].defaultMessage) +
            '\n'
          );
        })
        .join('\n');
    })
    .join('\n');
};

exports.default = potFormater;
module.exports = exports['default'];
