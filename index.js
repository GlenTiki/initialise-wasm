const assert = require('assert')

module.exports = function (buf, { promise = true, importObject = {} } = {}, cb = void 0) {
  assert(buf, 'A typed array or ArrayBuffer must be provided as the first argument to laod wasm.')

  assert(
    typeof importObject === 'object' || importObject === void 0,
    'wasm loading options must be an object.'
  )

  assert(
    (promise === false && typeof cb === 'function') || cb === void 0,
    'Callback must be a function with if it is provided, with the promise option set to false.'
  )

  if (promise || cb) {
    const loadPromise = WebAssembly.instantiate(buf, importObject)
    if (cb) {
      loadPromise.then(loaded => cb(loaded.instance))
    } else {
      return loadPromise.then(loaded => loaded.instance)
    }
  }

  return new WebAssembly.Instance(WebAssembly.Module(buf), importObject)
}
