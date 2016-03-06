
dop.core.generateToken = function () {

    return ( dop.node_inc++ ).toString(36) + (Math.random() * Math.pow(10,18)).toString(36); // http://jsperfcom/token-generator

};