

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            main: { 
                files: [{
                    src: '../browser/src/core/protocol.js',
                    dest: 'src/core/protocol.js',
                }],
            }
        },

        concat: {
            options: {
                process: function(src, filepath) {
                    return '\n\n\n\n//////////  ' + filepath + '\n' + src;
                }
            },
            dist: {
                src: [
                    'src/sangular.js'
                    ,'src/core/*'
                    ,'src/sockjs/*'
                    ,'src/export.js'
                ],
                dest: 'lib/<%= pkg.name %>.js'
            }
        }
    });



    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    //grunt.registerTask('default', ['concat', 'uglify', 'jshint', 'watch']);
    grunt.registerTask('default', ['copy','concat']);



};
