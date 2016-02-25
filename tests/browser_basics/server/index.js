

module.exports = function (tape, dop, httpExpress, config) {
    
    test = tape;
    require('./create')(tape, dop, httpExpress, config);

};