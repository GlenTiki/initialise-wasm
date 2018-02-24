# initialise-wasm

A small utility function to load small bits of wasm into your js programs. Supports loading asynchronously, with a promise, or loading scynchronously.

This does not support streaming loading as it is directly aimed at small WASM library usage.

Sweet!

## Installation

```
npm i initialise-wasm
```

## Usage

To use this, require it, and call it with a valid wasm buffer object, with the overrides you want to provide. It will provide you with the WASM instance that is created.

In the following examples, the wasm that gets loaded exports a function `add_one` which you can call from your javascript.

To load your wasm with a promise, do the following:

```js
const loader = require('initialise-wasm')

loader(validWasm)
  .then(loadedModule => loadedModule.exports)
  .then(exportedFuncs => {
    const answer = exportedFuncs.add_one(41)
  })
```

Of course, this works with async/await:

```js
const loader = require('initialise-wasm')

async function main () {
  const { exports: exportedFuncs } = await loader(validWasm)
  const answer = exportedFuncs.add_one(41)
}

main()
```

To instantiate with a callback, set the `promise` option to `false` and provide a callback:

```js
const loader = require('initialise-wasm')

loader(validWasm, { promise: false }, ({exports: exportedFuncs}) => {
  const answer = exportedFuncs.add_one(41)
})
```

To instantiate synchronously, set the `promise` option to `false` and provide no callback:

```js
const loader = require('initialise-wasm')

const { exports: exportedFuncs } = loader(validWasm, { promise: false })
const answer = exportedFuncs.add_one(41)
```

You can additionally pass WebAssembly options to the instantiated module by using the importObject option:

```js
const loader = require('initialise-wasm')

async function main () {
  const memory = new WebAssembly.Memory({initial:10, maximum:100});

  const { exports: exportedFuncs } = await loader(validWasm, { importObject: { js: { mem: memory } } })
  const answer = exportedFuncs.add_one(41)
  // you can use memory funcs declared here for wasm module if desired:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory
}

main()
```

## License

MIT
