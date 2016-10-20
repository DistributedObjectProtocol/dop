

module.exports = function (tape, dop, httpExpress, config) {
    
    test = tape;
    require('./ws')(tape, dop, httpExpress, config);

};