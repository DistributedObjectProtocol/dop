

syncio.client.request = function( direction, action ) {

    // PERF: We can make this as basic forloop: http://jsperf.com/array-prototype-slice-call-vs-slice-call/17
    var data = Array.prototype.slice.call( arguments );

    data.unshift(this.request_id++);

    this.write(
        (action < 2) ? 
            JSON.stringify(data, syncio.protocol.stringify)
        :
            JSON.stringify(data)
    );

};




