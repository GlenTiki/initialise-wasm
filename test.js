const test = require('tap').test
const validWasm = require('rust-wasm/build/wasm.js')

const loader = require('./index.js')

test('that it works as a promise by default', (t) => {
  loader(validWasm)
    .then(loadedModule => loadedModule.exports)
    .then(exportedFuncs => {
      t.equal(exportedFuncs.add_one(68), 69)
      t.equal(exportedFuncs.add_one(55), 56)
      t.end()
    })
})

test('that it works with async/await when using a promise', async (t) => {
  const { exports: exportedFuncs } = await loader(validWasm)
  t.equal(exportedFuncs.add_one(68), 69)
  t.equal(exportedFuncs.add_one(55), 56)
  t.end()
})

test('that it can work with a callback when the promise option is set to false', (t) => {
  loader(validWasm, { promise: false }, (loadedModule) => {
    const exportedFuncs = loadedModule.exports
    t.equal(exportedFuncs.add_one(68), 69)
    t.equal(exportedFuncs.add_one(55), 56)
    t.end()
  })
})

test('that it can load synchronously when promise is set to false and no callback is provided', (t) => {
  const { exports: exportedFuncs } = loader(validWasm, { promise: false })
  t.equal(exportedFuncs.add_one(68), 69)
  t.equal(exportedFuncs.add_one(55), 56)
  t.end()
})

test('that it throws if the buffer is not provided', (t) => {
  try {
    loader()
  } catch (e) {
    t.equal(e.message, 'A typed array or ArrayBuffer must be provided as the first argument to laod wasm.')
    t.end()
  }
})

test('that it throws if the callback param is set but the promise option isnt set to false', (t) => {
  try {
    loader(validWasm, {}, () => true) // test the promise option defaulting to true
  } catch (e) {
    t.equal(e.message, 'Callback must be a function with if it is provided, with the promise option set to false.')
  }
  try {
    loader(validWasm, { promise: true }, () => true) // test promise option set to true
  } catch (e) {
    t.equal(e.message, 'Callback must be a function with if it is provided, with the promise option set to false.')
    t.end()
  }
})

test('that it throws if the callback param isnt a function', (t) => {
  try {
    loader(validWasm, {}, {})
  } catch (e) {
    t.equal(e.message, 'Callback must be a function with if it is provided, with the promise option set to false.')
    t.end()
  }
})

test('that it throws if the importObject option is anything other than an object', (t) => {
  try {
    loader(validWasm, { importObject: function () {} })
  } catch (e) {
    t.equal(e.message, 'wasm loading options must be an object.')
    t.end()
  }
})
