(function(root) {

var dop = {

    version: '0.1.0',
    name: 'dop',

    // Where all the internal information is stored
    data: {
        node_inc:0,
        node:{},
        object_inc:1,
        object:{},
        object_data:{},
        collectors:[],
        lastGet:{}
    },

    // src
    util:{},
    core:{},
    protocol:{},
    listener:{},
    connector:{},
    transport:{listen:{}, connect:{}},


    // Special properties assigned to user objects
    specialprop: {
        socket_token: '~TOKEN_DOP',
        dop: '~dop'
    }

};