module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // copy: {
        //     main: { 
        //         files: [{
        //             src: '../browser/src/core/protocol.js',
        //             dest: 'src/core/protocol.js',
        //         }],
        //     }
        // },

        symlink: {
            expanded: {
                files: [{
                    src: '../browser/src/core/protocol.js',
                    dest: 'src/core/protocol.js'
                }, {
                    src: '../browser/src/core/typeof.js',
                    dest: 'src/core/typeof.js'
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
                    'src/syncio.js',
                    'src/core/*',
                    'src/app/*',
                    'src/scope/*',
                    'src/client/*',
                    'src/export.js'
                ],
                dest: 'lib/<%= pkg.name %>.js'
            }
        }
    });



    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-concat');

    //grunt.registerTask('default', ['concat', 'uglify', 'jshint', 'watch']);
    grunt.registerTask('default', ['symlink', 'concat']);



};
