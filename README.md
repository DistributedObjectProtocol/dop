
<p align="center"><a href="https://distributedobjectprotocol.org"><img width="200"src="https://distributedobjectprotocol.org/img/logo.svg"></a></p>

<p align="center">
    <a href="https://www.npmjs.com/package/dop"><img alt="npm version" src="https://img.shields.io/npm/v/dop.svg"></a>
    <a href="https://travis-ci.org/DistributedObjectProtocol/dop"><img alt="Build Status" src="https://api.travis-ci.org/DistributedObjectProtocol/dop.svg?branch=master"></a>
    <a href="https://www.npmjs.com/package/dop"><img alt="license" src="https://img.shields.io/npm/l/dop.svg"></a>
    <a href="https://gitter.im/DistributedObjectProtocol/dop?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"><img alt="Join the chat at" src="https://badges.gitter.im/DistributedObjectProtocol/dop.svg"></a>
</p>

## Distributed Object Protocol is for

**State management**, Remote procedure calls, Reactive programming, 
Data sync, Pub/Sub, Optimistic updates, Time-travel debugging, Unidirectional data flow and **Real time apps**.

This repository is the JavaScript implementation of the protocol that runs on node.js and Browsers.

<!--
## Connecting two nodes

```js
// Server (node.js)
const dop = require('dop')
const object = dop.register({
    fullname: 'John Doe',
    square: number => number * number
})
dop.listen() // WebSockets on port 4444 (https://github.com/websockets/ws)
dop.onSubscribe(() => object)
```

```js
// Client (browser)
import dop from 'dop'
const server = dop.connect() // Native WebSockets 'ws://localhost:4444'
const objectFromServer = await server.subscribe()
console.log(objectFromServer.fullname) // > "John Doe"
console.log(await objectFromServer.square(5)) // > 25
```-->





Check the website for more detailed information [https://distributedobjectprotocol.org/](https://distributedobjectprotocol.org/)



## License

[MIT](http://opensource.org/licenses/MIT)