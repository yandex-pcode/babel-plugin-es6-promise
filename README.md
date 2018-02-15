Fork of: [`babel-plugin-es6-promise`]

# babel-plugin-custom-promise

Babel plugin that rewrites Promise references to any custom Promise library, but only if
necessary. Tested with Node.js 0.10 and above.

## Installation

```console
$ npm install --save-dev babel-plugin-custom-promise
```

Then add Promise to your Babel config, like:

```json
{
  "plugins": ["es6-promise"]
}
```

**Promise library must be installed separately.**

##Configuration

`buildPollyfill`: template string that should inserts in files. Default is:

```js
var _Promise = typeof Promise === 'undefined'
  ? require('es6-promise').Promise
  : Promise
```

## Behavior

This plugin rewrites files that reference the `Promise` built-in. It inserts the
code specified in `buildPollyfill` option at the top of each file

This means Promise is only loaded when there is no `Promise` built-in
available. Each `Promise` reference is rewritten to `_Promise`.

Note that `require()` is used rather than a ES2015 module import. This may make
it difficult to do further import transforms.

Also note that the `_Promise` variable name in this example is determined by
Babel and may differ depending on your code.

[`babel-plugin-es6-promise`]: https://github.com/yandex-pcode/babel-plugin-es6-promise