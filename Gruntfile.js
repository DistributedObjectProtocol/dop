module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['src/*','src/*/*','src/*/*/*','src/*/*/*/*'],
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
            nodejs: {
                src: [
                    'src/dop.js',
                    'src/util/*',
                    'src/core/*',
                    'src/api/*',
                    'src/protocol/*',
                    'src/node/*',
                    'src/adapter/nodejs/*/*'
                ],
                dest: 'dist/nodejs.js'
            },
            browser: {
                src: [
                    'src/dop.js',
                    'src/util/*',
                    'src/core/*',
                    'src/api/*',
                    'src/protocol/*',
                    'src/node/*',
                    'src/adapter/browser/*/*'
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


    grunt.registerTask('default', ['concat:nodejs', 'concat:browser', 'uglify', 'watch']);




};
