

dop.user = function( instance, user_socket ){

    this.dop = instance;
    this.socket = user_socket;
    this.writables = {};
    this.objects = {};
    this.token = ( instance.user_inc++ ).toString(36) + (Math.random() * Math.pow(10,18)).toString(36); // http://jsperfcom/token-generator
             // (this.user_inc++).toString(36) + (Math.random() * Math.pow(10,18)).toString(36)  // http://jsperf.com/token-generator-with-id
             //  Number((this.user_inc++) + "" + (Math.random() * Math.pow(10,18))).toString(36)

};