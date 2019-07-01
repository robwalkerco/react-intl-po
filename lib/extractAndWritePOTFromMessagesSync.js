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
  }; /* eslint-disable no-console */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _readAllMessageAsObjectSync = require('./readAllMessageAsObjectSync');

var _readAllMessageAsObjectSync2 = _interopRequireDefault(
  _readAllMessageAsObjectSync,
);

var _potFormater = require('./potFormater');

var _potFormater2 = _interopRequireDefault(_potFormater);

var _potHeader = require('./potHeader');

var _potHeader2 = _interopRequireDefault(_potHeader);

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

function extractAndWritePOTFromMessagesSync(srcPatterns, _ref) {
  var _ref$messageKey = _ref.messageKey,
    messageKey =
      _ref$messageKey === undefined ? 'defaultMessage' : _ref$messageKey,
    _ref$messageContext = _ref.messageContext,
    messageContext =
      _ref$messageContext === undefined ? '' : _ref$messageContext,
    output = _ref.output,
    headerOptions = _ref.headerOptions;

  var result = R.pipe(
    _readAllMessageAsObjectSync2.default,
    // 1. Object { messagekey: { messageContext: [[] , []] } }
    _potFormater2.default,
    // 2. String: pot formated
    R.concat(
      (0, _potHeader2.default)(
        _extends(
          {
            potCreationDate: new Date(),
            charset: 'UTF-8',
            encoding: '8bit',
          },
          headerOptions,
        ),
      ),
    ),
    // 3. String: with pot head
  )(srcPatterns, messageKey, messageContext);

  // Output
  _fs2.default.writeFileSync(output, result);
  console.log(
    _chalk2.default.green(
      '> [react-intl-po] write file -> ' + output + ' \u2714\uFE0F\n',
    ),
  );
}

exports.default = extractAndWritePOTFromMessagesSync;
module.exports = exports['default'];
