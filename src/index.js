import template from 'babel-template'
import * as t from 'babel-types'

const defaultOptions = {
  pragma: `
  var PROMISE = typeof Promise === 'undefined'
    ? require('es6-promise').Promise
    : Promise`,
  replacement: null
}

const replaceIdentifier = {
  ReferencedIdentifier (path) {
    const { node, scope } = path

    if (node.name !== 'Promise') return
    if (scope.getBindingIdentifier(node.name)) return

    path.replaceWith(this.getReplacement())
  }
}

export default function (api, pluginOptions) {
  const options = Object.assign({}, defaultOptions, pluginOptions)
  const buildPolyfill = template(options.pragma)
  const replacement = options.replacement

  return {
    visitor: {
      Program (path) {
        const name = path.scope.generateUid('Promise')

        let used = false
        path.traverse(replaceIdentifier, {
          getReplacement () {
            used = true
            return replacement || t.identifier(name)
          }
        })

        if (used) {
          path.unshiftContainer('body', buildPolyfill({
            PROMISE: replacement || t.identifier(name)
          }))
        }
      }
    }
  }
}
