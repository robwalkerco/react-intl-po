'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _readAllMessageAsObjectSync = require('./readAllMessageAsObjectSync');

var _readAllMessageAsObjectSync2 = _interopRequireDefault(
  _readAllMessageAsObjectSync,
);

var _readAllPOAsObjectSync = require('./readAllPOAsObjectSync');

var _readAllPOAsObjectSync2 = _interopRequireDefault(_readAllPOAsObjectSync);

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
} /* eslint-disable no-console */

var isAJSONFile = function isAJSONFile(string) {
  return /.json/.test(string);
};

var getContext = function getContext(messageContext) {
  return function(message) {
    return messageContext ? message[messageContext] + '\x04' : '';
  };
};

var makeLangMapper = function makeLangMapper(pattern) {
  var index =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return function(filepath) {
    return filepath.match(pattern)[index];
  };
};

function filterPOAndWriteTranslateSync(srcPatterns, _ref) {
  var _ref$messageKey = _ref.messageKey,
    messageKey =
      _ref$messageKey === undefined ? 'defaultMessage' : _ref$messageKey,
    _ref$messageContext = _ref.messageContext,
    messageContext =
      _ref$messageContext === undefined ? '' : _ref$messageContext,
    messagesPattern = _ref.messagesPattern,
    langMapperPattern = _ref.langMapperPattern,
    langMapperPatternIndex = _ref.langMapperPatternIndex,
    output = _ref.output,
    indentation = _ref.indentation,
    sortById = _ref.sortById;

  var sort = sortById ? R.sortBy(R.prop('id')) : R.identity;

  var placeholder = R.pipe(
    _readAllMessageAsObjectSync2.default,
    // 1. Object { messagekey: { messageContext: [[] , []] } }
    R.values,
    // 2. Array [{ messageContext: [[], []] }]
    R.map(R.values),
    // 3. Array [[], []]
    R.flatten,
    sort,
    // 4. Array []
    R.indexBy(R.prop('id')),
    // 5. Object { id: [] }
    R.mapObjIndexed(
      R.converge(R.concat, [getContext(messageContext), R.prop(messageKey)]),
    ),
    // 6. Object { id: key }, key = (messageContext + messagekey)
  )(messagesPattern, messageKey, messageContext);

  var langMapperFn =
    langMapperPattern !== undefined
      ? makeLangMapper(langMapperPattern, langMapperPatternIndex)
      : undefined;

  var result = R.pipe(
    _readAllPOAsObjectSync2.default,
    // 1. Object { locale: { key: '' } }
    function(translation) {
      return Object.keys(translation).map(function(locale) {
        return _defineProperty(
          {},
          locale,
          R.mapObjIndexed(function(k) {
            return translation[locale][k] || '';
          })(placeholder),
        );
      });
    },
    // 2. Array [{ locale: { id: '' } }], replace key to translated string
    R.mergeAll,
    // 3. Object { locale: { id: '' } }
  )(srcPatterns, langMapperFn);

  // Output
  if (isAJSONFile(output)) {
    _mkdirp2.default.sync(_path2.default.dirname(output)); // ensure the output folder exists
    _fs2.default.writeFileSync(
      output,
      JSON.stringify(result, null, indentation),
    );
    console.log(
      _chalk2.default.green(
        '> [react-intl-po] write file -> ' + output + ' \u2714\uFE0F\n',
      ),
    );
  } else {
    _mkdirp2.default.sync(output); // ensure the output folder exists

    Object.keys(result).forEach(function(lang) {
      _fs2.default.writeFileSync(
        _path2.default.join(output, lang + '.json'),
        JSON.stringify(result[lang], null, indentation),
      );
      console.log(
        _chalk2.default.green(
          '> [react-intl-po] write file -> ' +
            _path2.default.join(output, lang + '.json') +
            ' \u2714\uFE0F',
        ),
      );
    });
  }
}

exports.default = filterPOAndWriteTranslateSync;
module.exports = exports['default'];
