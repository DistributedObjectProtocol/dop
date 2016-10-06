(function(root) {

var dop = {version: '0.1.0'};

// Hidding but exposing api
Object.defineProperties(dop, {
  // Where all the internal information is stored
  "data": {
    value: {
        node_inc:0,
        node:{},
        object_inc:1,
        object:{},
        object_data:{},
        collectors:[],
        lastGet:{}
    }
  },
  // src
  "util": {value: {}},
  "core": {value: {}},
  "protocol": {value: {}},
  "transport": {value: {listen:{}, connect:{}}}
});



// Special properties assigned to user objects
var CONS = {
    socket_token: '~TOKEN_DOP',
    dop: '~dop'
};
