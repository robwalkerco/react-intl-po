'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

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

/**
 * Create a POT header string
 * @param {Object} options
 * @param {String|String[]} [options.comments]
 * @param {Date} [options.potCreationDate] used for POT-Creation-Date
 * @param {String} [options.projectIdVersion] Project-Id-Version
 * @param {String} [options.charset]
 * @param {String} [options.encoding]
 * @return {String} potSource
 *
 * example: see tests
 *
 * @see https://www.gnu.org/software/trans-coord/manual/gnun/html_node/PO-Header.html
 * @author Guillaume Boddaert
 */

var potHeader = function potHeader() {
  var options =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var o = R.evolve({
    comments: R.pipe(
      R.cond([[R.is(Array), R.identity], [R.is(String), R.of]]),
      R.map(R.split('\n')),
      R.flatten,
      R.map(function(e) {
        return '# ' + e;
      }),
      R.join('\n'),
    ),
    projectIdVersion: function projectIdVersion(e) {
      return '"Project-Id-Version: ' + e + '\\n"';
    },
    potCreationDate: function potCreationDate(e) {
      return '"POT-Creation-Date: ' + e.toISOString() + '\\n"';
    },
    charset: function charset(e) {
      return '"Content-Type: text/plain; charset=' + e + '\\n"';
    },
    encoding: function encoding(e) {
      return '"Content-Transfer-Encoding: ' + e + '\\n"';
    },
  })(options);

  return (
    o.comments +
    '\nmsgid ""\nmsgstr ""\n' +
    o.projectIdVersion +
    '\n' +
    o.potCreationDate +
    '\n' +
    o.charset +
    '\n' +
    o.encoding +
    '\n"MIME-Version: 1.0\\n"\n"X-Generator: react-intl-po\\n"\n\n\n'
  ).replace(/undefined\r?\n|\r/g, '');
};

exports.default = potHeader;
module.exports = exports['default'];
