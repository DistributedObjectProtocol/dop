<div align="center">

<p align="center"><a href="https://distributedobjectprotocol.org"><img src="https://distributedobjectprotocol.org/img/logo.svg"  width="200"></a></p>

[![npm](https://img.shields.io/npm/v/dop?style=flat-square)](https://www.npmjs.com/package/dop)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/dop?style=flat-square)](https://bundlephobia.com/result?p=dop)
[![Build Status](https://api.travis-ci.org/DistributedObjectProtocol/dop.svg?branch=master&style=flat-square)](https://travis-ci.org/DistributedObjectProtocol/dop)
![GitHub](https://img.shields.io/github/license/artalar/reatom?style=flat-square)

<br/>
<a href="https://distributedobjectprotocol.org">https://distributedobjectprotocol.org/</a>
<br/>
<br/>

</div>

Distributed Object Protocol is a thin layer on top of your data network that helps you communicate server and clients (nodes) using [RPCs](https://en.wikipedia.org/wiki/Remote_procedure_call). It is also a pattern that makes easy update, mutate or even sync the state of your App using [Patches](https://tools.ietf.org/html/rfc7386).

## Quick example using RPCs with WebSockets

```js
// Server (node.js)
const { createNode } = require('dop')
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

function getCalculator() {
    return {
        sum: (a, b) => a + b,
        multiply: (a, b) => a * b
    }
}

wss.on('connection', ws => {
    const client = createNode()
    client.open(msg => ws.send(JSON.stringify(msg)), getCalculator)
    ws.on('message', msg => client.message(JSON.parse(msg)))
    ws.on('close', client.close)
})
```

```js
// Client (Browser)
import { createNode } from 'dop'
const ws = new WebSocket('ws://localhost:8080')
const server = createNode()

ws.onopen = async () => {
    const getCalculator = server.open(msg => ws.send(JSON.stringify(msg)))
    const { sum, multiply } = await getCalculator()
    const result1 = await sum(5, 5)
    const result2 = await multiply(5, 5)
    console.log(result1, result2) // 10, 25
}
ws.onmessage = msg => server.message(JSON.parse(msg.data))
ws.onclose = server.close
```

Check the website for more info [https://distributedobjectprotocol.org/](https://distributedobjectprotocol.org/)

## License

[MIT](http://opensource.org/licenses/MIT)
