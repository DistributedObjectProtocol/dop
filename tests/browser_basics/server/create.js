

test('111 ok cona timing test', function (t) {

    t.plan(5);
    
    t.equal(typeof Date.now, 'function');
    t.equal(1, 1);
    t.equal(1, 1);
    t.equal(1, 1);
    t.equal(1, 1);


});


test('222 ok cona timing test', function (t) {

    
    t.equal(typeof Date.now, 'function', 'ok custom assert');
    var start = Date.now();
    
    setTimeout(function () {
        t.equal(Date.now() - start, 1000, 'the setTimeout is not exacly');
        t.end();
    }, 1000);

});