'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          newObj[key] = obj[key];
      }
    }
    newObj.default = obj;
    return newObj;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Read extracted .json file synchronized and
 * aggregates origin messages objects
 *
 * @param {String} srcPatterns - path to translated .json file
 * @param {String} messageKey - [defaultMessage]
 * @param {String} messageContext - [''] empty string
 * @return {Object} messages - return aggregates object
 *
 * @author Michael Hsu
 */

var readAllMessageAsObjectSync = function readAllMessageAsObjectSync(
  srcPatterns,
) {
  var messageKey =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : 'defaultMessage';
  var messageContext =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return R.pipe(
    _glob.sync,
    // 1. Array [filename, ...]
    R.map(function(filename) {
      return JSON.parse(_fs2.default.readFileSync(filename, 'utf8')).map(
        function(e) {
          return _extends({}, e, {
            filename: filename,
          });
        },
      );
    }),
    R.flatten,
    // 2. Array [{ ...messages, filename  }, ... ]
    R.groupBy(R.prop(messageKey)),
    // 3. Object { messageKey: { }, ... }
    R.mapObjIndexed(R.groupBy(R.propOr(messageContext, messageContext))),
    // 4. Object { messagekey: { messageContext: { } } }
    // 4. groupBy context (nested for -c argument)
  )(srcPatterns);
};

exports.default = readAllMessageAsObjectSync;
module.exports = exports['default'];
