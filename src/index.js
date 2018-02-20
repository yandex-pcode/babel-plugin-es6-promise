import template from 'babel-template'
import * as t from 'babel-types'

const defaultOptions = {
  pragma: `
  var PROMISE = typeof Promise === 'undefined'
    ? require('es6-promise').Promise
    : Promise`,
  replacement: null
}

let replacement = '';

const replaceIdentifier = {
  ReferencedIdentifier (path) {
    const { node, scope } = path

    if (node.name !== 'Promise') return
    if (scope.getBindingIdentifier(node.name)) return

    replacement
      ? path.replaceWithSourceString(replacement)
      : path.replaceWith(this.getReplacement())
  }
}

export default function (api) {
  return {
    visitor: {
      Program (path, state) {
        const options = Object.assign({}, defaultOptions, state.opts)
        const buildPolyfill = template(options.pragma)
        replacement = options.replacement

        const name = path.scope.generateUid('Promise')

        let used = false
        path.traverse(replaceIdentifier, {
          getReplacement () {
            used = true
            return t.identifier(name)
          }
        })

        if (used) {
          path.unshiftContainer('body', buildPolyfill({
            PROMISE: t.identifier(name)
          }))
        }
      }
    }
  }
}
