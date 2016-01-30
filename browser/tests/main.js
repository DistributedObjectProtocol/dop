
var assert = chai.aseert;
var expect = chai.expect;
var should = chai.should();

console.log(assert);

describe('Compare Numbers', function() {

    it('1 should equal 1', function() {
        expect(1).to.equal(1);
    });

    it('Fail expect', function() {
        expect(1).to.equal(true);
        // done();
    });

    it('Async', function(done) {
        done();
    });

    it('Assync never throw', function(done) {
    });

    it('Assync Error', function(done) {
        if (true) throw Error('caca');
        done();
    });


});