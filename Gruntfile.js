module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['src/*','src/*/*'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
            },
        },

        concat: {
            options: {
                process: function(src, filepath) {
                    return '\n\n\n\n//////////  ' + filepath + '\n' + src;
                }
            },
            server: {
                src: [
                    'src/dop.js',
                    'src/core/*',
                    'src/api/*',
                    'src/on/*',
                    'src/node/*',
                    'src/util/*',
                    'src/side/server/*/*'
                ],
                dest: 'dist/server.js'
            },
            browser: {
                src: [
                    'src/dop.js',
                    'src/core/*',
                    'src/api/*',
                    'src/on/*',
                    'src/node/*',
                    'src/util/*',
                    'src/side/browser/*/*'
                ],
                dest: 'dist/browser.js'
            }
        },

        uglify: {
            build: {
                src: 'dist/browser.js',
                dest: 'dist/browser.min.js'
            }
        },

    });



    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.registerTask('default', ['concat:server', 'concat:browser', 'uglify', 'watch']);




};
