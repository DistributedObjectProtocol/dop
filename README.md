<div align="center">

<p align="center"><a href="https://distributedobjectprotocol.org"><img width="200" src="https://distributedobjectprotocol.org/img/logo.svg"></a></p>

[![npm](https://img.shields.io/npm/v/dop?style=flat-square)](https://www.npmjs.com/package/dop)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/dop?style=flat-square)](https://bundlephobia.com/result?p=dop)
[![Build Status](https://api.travis-ci.org/DistributedObjectProtocol/dop.svg?branch=master&style=flat-square)](https://travis-ci.org/DistributedObjectProtocol/dop)
[![Join the community](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/dop)

<br/>
<a href="https://distributedobjectprotocol.org/guide/javascript">https://distributedobjectprotocol.org/</a>
<br/>
<br/>

</div>

**Distributed Object Protocol** is a thin layer on top of your data network that helps you communicate server and clients (nodes) using [RPCs](https://en.wikipedia.org/wiki/Remote_procedure_call). It is also a pattern that makes easy update, mutate or even sync the state of your App using [Patches](https://github.com/DistributedObjectProtocol/protocol#Patches).

## Quick example connecting nodes and using RPCs with WebSockets

```js
// Server
const { createNode } = require('dop')
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

const sum = (a, b) => a + b
const multiply = (a, b) => a * b
const getCalculator = () => ({ sum, multiply })

wss.on('connection', ws => {
    const client = createNode()
    client.open(ws.send.bind(ws), getCalculator)
    ws.on('message', client.message)
})
```

```js
// Client
const ws = new WebSocket('ws://localhost:8080')
const server = createNode()
ws.on('open', async () => {
    const getCalculator = server.open(ws.send.bind(ws))
    const { sum, multiply } = await getCalculator()
    const result1 = await sum(5, 5)
    const result2 = await multiply(3, 3)
    console.log(result1, result2) // 10, 9
})
ws.on('message', server.message)
```

# Quick example using Stores and Patches

```js
// Server
const { createStore } = require('dop')

const store = createStore({ players: 0 })

function subscribeToServerStore(listener) {
    const { state } = store
    // Incrementing number of player as a patch
    const listeners = store.applyPatch({ players: state.players + 1 })
    // We emit the patch to all the subscribers
    listeners.forEach(({ listener, patch }) => listener(patch))
    // Here we subscribe our client
    store.subscribe(listener)
    return state
}
```

```js
// Client
const { createStore } = require('dop')

// Getting the current state of the server and subscribing to it
const state = await subscribeToServerStore(onPatch)
// Creates a local store where our UX components can subscribe to
const store = createStore(state)

function onPatch(patch) {
    // Applying patch from the server
    const listeners = store.applyPatch(patch)
    // We emit the patch to subscribers. Like React components.
    listeners.forEach(({ listener, patch }) => listener(patch))
}
```

Check the website for more info [https://distributedobjectprotocol.org/](https://distributedobjectprotocol.org/guide/javascript)

## License

[MIT](http://opensource.org/licenses/MIT)
