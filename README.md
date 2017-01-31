
<p align="center"><a href="https://distributedobjectprotocol.org"><img width="200"src="https://distributedobjectprotocol.org/img/logo.svg"></a></p>

<p align="center">
    <a href="https://www.npmjs.com/package/dop"><img alt="npm version" src="https://img.shields.io/npm/v/dop.svg"></a>
    <a href="https://travis-ci.org/DistributedObjectProtocol/dop"><img alt="Build Status" src="https://travis-ci.org/DistributedObjectProtocol/dop.svg?branch=master"></a>
    <a href="https://www.npmjs.com/package/dop"><img alt="license" src="https://img.shields.io/npm/l/dop.svg"></a>
    <a href="https://gitter.im/DistributedObjectProtocol/dop?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"><img alt="Join the chat at" src="https://badges.gitter.im/DistributedObjectProtocol/dop.svg"></a>
</p>

## What is dop?

Distributed Object Protocol is for Data-sync, Pub/Sub, Remote procedure calls, Reactive programming,
Optimistic updates, Time-travel debugging, State management,
Unidirectional data flow, Real time apps and more.

This repository is the JavaScript implementation of the protocol that runs on node.js and Browsers.


## Basic example

```js
// Server (node.js)
const dop = require('dop')
const listener = dop.listen() // WebSockets on port 4444 (https://github.com/websockets/ws)
const myObject = {
    Hello: 'World',
    square: number => number * number
}
dop.onSubscribe(() => myObject)
```

```js
// Client (browser)
import dop from 'dop'
const server = dop.connect() // Native WebSockets 'ws://localhost:4444'
const serverObject = await server.subscribe()
const squareOfFive = await serverObject.square(5)
console.log(squareOfFive) // > 25
```

Check the website for more detailed documentation [https://distributedobjectprotocol.org/](https://distributedobjectprotocol.org/)



## License

[MIT](http://opensource.org/licenses/MIT)