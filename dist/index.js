'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (api) {
  return {
    visitor: {
      Program: function (path, state) {
        var options = Object.assign({}, defaultOptions, state.opts);
        var buildPolyfill = (0, _babelTemplate2.default)(options.pragma);
        var replacement = options.replacement;

        var name = path.scope.generateUid('Promise');

        var used = false;
        path.traverse(replaceIdentifier, {
          getReplacement: function () {
            used = true;
            return replacement || t.identifier(name);
          }
        });

        if (used) {
          path.unshiftContainer('body', buildPolyfill({
            PROMISE: replacement || t.identifier(name)
          }));
        }
      }
    }
  };
};

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  pragma: '\n  var PROMISE = typeof Promise === \'undefined\'\n    ? require(\'es6-promise\').Promise\n    : Promise',
  replacement: null
};

var replaceIdentifier = {
  ReferencedIdentifier: function (path) {
    var node = path.node,
        scope = path.scope;


    if (node.name !== 'Promise') return;
    if (scope.getBindingIdentifier(node.name)) return;

    path.replaceWith(this.getReplacement());
  }
};
//# sourceMappingURL=index.js.map