

module.exports = function (tape, synko, httpExpress, config) {
    
    test = tape;
    require('./create')(tape, synko, httpExpress, config);

};