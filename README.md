synko
=======

Synko is a small library that allows you synchronize data objects between server and clients and call remote functions with a very friendly [API](https://objectsyncprotocol.gitbooks.io/synko/). Synko is based on the [Object Sync Protocol](https://github.com/ObjectSyncProtocol/protocol) and can be used in conjuntion with [SockJS](https://github.com/sockjs) or [socket.io](https://github.com/socketio/socket.io) as connector to comunicate server and browser.

`npm install synko`

## How to use
**Server side:**
```js
var synko = require('synko').server
var myserver = synko.create();
myserver.on('connect', function( user ) {
  user.sync('controllers', controllers);
});
var controllers = {
  login: function(email, password, req) {
    if ( DBValidUser(email, password) )
      req.resolve();
    else
      req.reject('Invalid email or password');
  }
};
```



**Browser side:**

```js
var controllers = {};
var server = synko.create();
server.connect()
  .then(function(token) {
    console.log('Connected!! My token is:', token);
    return server.sync('controllers', controllers);
  })
  .then(function() {
    console.log('Controller object synced:');
    return controllers.login('enzo@josema.es', 'MyP4ssw0rd');
  })
  .then(function() {
    console.log('Logged!');
  })
  .catch(function( error ) {
    console.error( error );
  });
```

You can load synko on the browser as oldschool style
```html
<script src="./browser/dist/synko.min.js">
```
Or with ES6 (webpack and babel):
```js
import synko from 'synko';
```



#### You can use synko with socket.io or SockJS as connector




```js
var server = synko.create({connector:synko.socketio});
...
```
## API

For full API documentation visit: https://objectsyncprotocol.gitbooks.io/synko/
