'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _po2json = require('po2json');

var _po2json2 = _interopRequireDefault(_po2json);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

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

var parseFileSync = R.pipe(
  // 1. Convert po to json format
  function(filename) {
    return _po2json2.default.parseFileSync(filename);
  },
  // 2. Omit pot epmty head above
  R.omit(['']),
  // 3. Omit plural
  R.mapObjIndexed(R.nth(1)),
);

exports.default = {
  parseFileSync: parseFileSync,
};
module.exports = exports['default'];
